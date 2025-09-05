import { jest } from "@jest/globals";
import Database from "better-sqlite3";
import {readFileSync} from "fs";
import { User } from "../../shared/data/user";
import { AuthDAO, UnavailableUsername } from "./auth_dao";
import { UserNotFound } from "../services/auth_sevice";
import { InvalidSession } from "./auth_dao";

function set_up_db() {
    const db = new Database(":memory:");
    const db_script = readFileSync("./server/db_scripts/auth_setup.sql", "utf8");
    db.exec(db_script);
    return db;
} 

function reset_db(db) {
    db.prepare("DELETE FROM session").run();
    db.prepare("DELETE FROM user").run();
    db.prepare("INSERT INTO user (username, hash, name) VALUES (?, ?, ?)")
        .run(preexisting_user.username, preexisting_user.hash, preexisting_user.name);
    db.prepare("INSERT INTO session (session, username, delete_time) VALUES (?, ?, ?)")
        .run(preexisting_user_session, preexisting_user.username, 1000);
}

const preexisting_user = new User({
    username: "jacob_username",
    hash: "hash",
    name: "jacob"
});
const preexisting_user_session = "preexisting_user_session";

const new_user = new User({
    username: "new_username",
    hash: "new_hash",
    name: "new_name"
});
const new_user_session = "new_user_session";

//The hash isn't returned when getting user from session
const returned_user = new User({
    username: preexisting_user.username,
    name: preexisting_user.name
});


let db;
let auth_dao = new AuthDAO(new Database());


beforeAll(() => {
    db = set_up_db();
    auth_dao = new AuthDAO(db);
}) 

beforeEach(() => {
    reset_db(db);
    Date.now = () => 0;
})

describe("AuthDAO", () => {
    describe("get_user", () => {
        test("Success", () => {
            expect(auth_dao.get_user(preexisting_user.username)).toEqual(preexisting_user);
        });
        test("Not found", () => {
            expect(auth_dao.get_user(new_user.username)).toBe(null);
        });
    });

    describe("get_user_from_session", () => {
        test("Success", () => {
            expect(auth_dao.get_user_from_session(preexisting_user_session)).toEqual(returned_user);
        });
        test("Not found", () => {
            expect(auth_dao.get_user_from_session(new_user_session)).toBe(null);
        });
        test("Passed delete_time", () => {
            const test_session = "test_session";
            db.prepare("INSERT INTO session (session, username, delete_time) VALUES (?, ?, ?)")
                .run(test_session, preexisting_user.username, 100);
            expect(auth_dao.get_user_from_session(test_session)).toEqual(returned_user);
            Date.now = () => 101;
            expect(auth_dao.get_user_from_session(test_session)).toBeNull();
        });
    });

    describe("add_user", () => {
        test("Success", () => {
            expect(auth_dao.get_user(new_user.username)).toBe(null);
            expect(() => auth_dao.add_user(new_user)).not.toThrow(Error);
            expect(auth_dao.get_user(new_user.username)).toEqual(new_user);
        });
        test("UnavailableUsername", () => {
            expect(() => auth_dao.add_user(preexisting_user)).toThrow(UnavailableUsername);
        });
    });

    describe("add_session", () => {
        test("Success", () => {
            const returned_user = new User({
                username: new_user.username,
                name: new_user.name
            });
            const ms_before_removal = 10;
            auth_dao.add_user(new_user);
            expect(auth_dao.get_user_from_session(new_user_session)).toBe(null);
            auth_dao.add_session(new_user, new_user_session, ms_before_removal);
            expect(auth_dao.get_user_from_session(new_user_session)).toEqual(returned_user);
        });
        test("Session key already taken", () => {
            expect(() => auth_dao.add_session(preexisting_user, preexisting_user_session, 100)).toThrow(InvalidSession);
        });
    });
});









