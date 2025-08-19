import { jest } from "@jest/globals";
import Database from "better-sqlite3";
import {readFileSync} from "fs";
import { User } from "../data/auth_data";
import { AuthDAO, UnavailableUsername } from "./auth_dao";
import { InvalidSession } from "../services/auth_sevice";
jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

function set_up_db() {
    const db = new Database(":memory:");
    const db_script = readFileSync("./server/db_scripts/auth_setup.sql", "utf8");
    db.exec(db_script);
    return db;
} 

function reset_db(db) {
    db.prepare("DELETE FROM session").run();
    db.prepare("DELETE FROM user").run();
    db.prepare("INSERT INTO user (username, password, name) VALUES (?, ?, ?)")
    .run(preexisting_user.username, preexisting_user.password, preexisting_user.name);
    db.prepare("INSERT INTO session (session, username) VALUES (?, ?)")
    .run(preexisting_user_session, preexisting_user.username);
}

const preexisting_user = new User({
    username: "jacob_username",
    password: "pwd",
    name: "jacob"
});
const preexisting_user_session = "preexisting_user_session";

const new_user = new User({
    username: "new_username",
    password: "new_pwd",
    name: "new_name"
});
const new_user_session = "new_user_session";

let db;
let auth_dao;


beforeAll(() => {
    db = set_up_db();
    auth_dao = new AuthDAO(db);
}) 

beforeEach(() => {
    reset_db(db);
})



test("get_user: success", () => {
    expect(auth_dao.get_user(preexisting_user.username)).toEqual(preexisting_user);
});
test("get_user: notfound", () => {
    expect(auth_dao.get_user(new_user.username)).toBe(null);
});


test("get_user_from_session: success", () => {
    expect(auth_dao.get_user_from_session(preexisting_user_session)).toEqual(preexisting_user);
});
test("get_user_from_session: not_found", () => {
    expect(auth_dao.get_user_from_session(new_user_session)).toBe(null);
});


test("add_user: success", () => {
    expect(auth_dao.get_user(new_user.username)).toBe(null);
    expect(() => auth_dao.add_user(new_user)).not.toThrow(Error);
    expect(auth_dao.get_user(new_user.username)).toEqual(new_user);
});
test("add_user: UnavailableUsername", () => {
    expect(() => auth_dao.add_user(preexisting_user)).toThrow(UnavailableUsername);
});


test("add_session: success", () => {
    expect(auth_dao.get_user_from_session(new_user_session)).toBe(null);
    expect(() => auth_dao.add_session(new_user, new_user_session)).not.toThrow(Error);
    expect(auth_dao.get_user_from_session(new_user_session)).toEqual(new_user);
    jest.runAllTimers();
    expect(auth_dao.get_user_from_session(new_user_session)).toBe(null);
});
test("add_session: session key already taken", () => {
    expect(() => auth_dao.add_session(preexisting_user, preexisting_user_session)).toThrow(InvalidSession);
});

