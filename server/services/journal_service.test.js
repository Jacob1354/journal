import Database from "better-sqlite3";
import { JournalService } from "./journal_service";
import { Day } from "../../shared/data/day";
import { InvalidUser, User } from "../../shared/data/user";
import { InternalServerError, SQL_AUTH_SETUP_PATH, SQL_JOURNAL_SETUP_PATH } from "../server_const";
import { JournalDAO, CouldntUpdateDay } from "../dao/journal_dao";
import { jest } from "@jest/globals";
import { AuthDAO } from "../dao/auth_dao";
import { readFileSync } from 'fs';
import { Activity, HoursAndMinutes } from "../../shared/data/schedule";
import { ClientNotUpToDate } from "../../shared/const";

const user = new User({username: "user", hash: "hash", name: "name"});
const invalid_user = new User({username: "invalid_user"});

const default_timestamp = 500;

let existing_day = new Day();
existing_day.schedule.add_activity(new Activity());
existing_day.update_timestamp = default_timestamp;
let existing_day_json = existing_day.prepare_json_obj();

const new_date = new Date();
new_date.setDate(1);
new_date.setMonth(1);
new_date.setFullYear(1995);
const new_day = new Day(new_date);
new_day.update_timestamp = default_timestamp;
const new_day_json = new_day.prepare_json_obj();

const journal_service = new JournalService(new Database());
let journal_dao;


beforeEach(() => {
    jest.spyOn(Date, "now").mockImplementation(() => default_timestamp);
    existing_day = new Day();
    existing_day.schedule.add_activity(new Activity());
    existing_day.update_timestamp = default_timestamp;
    existing_day_json = existing_day.prepare_json_obj();
    const db = new Database(":memory:");
    const db_auth_script = readFileSync(SQL_AUTH_SETUP_PATH, "utf8");
    const db_journal_script = readFileSync(SQL_JOURNAL_SETUP_PATH, "utf8");
    db.exec(db_auth_script);
    db.exec(db_journal_script);
    journal_dao = new JournalDAO(db);
    const auth_dao = new AuthDAO(db);
    auth_dao.add_user(user);
    journal_dao.create_day(user, existing_day);
    journal_service._set_dao_for_tests(journal_dao);
});

describe("JournalService", () => {
    describe("get_json_day_obj", () => {
        test.each([
            [existing_day.date, existing_day_json], 
            [new_day.date, new_day_json]
        ])("Success", (date, day) => {
            expect(journal_service.get_json_day_obj(user, date)).toEqual(day);
        });
        
        test("InvalidUser", () => {
            expect(() => journal_service.get_json_day_obj(invalid_user, existing_day.date)).toThrow(InvalidUser);
        });
        
        test("InternalServerError", () => {
            journal_dao.get_day = jest.fn(() => {throw new Error();});
            expect(() => journal_service.get_json_day_obj(user, existing_day.date)).toThrow(InternalServerError);
        });
    });
    describe("update_day", () => {
        test("Success", () => {
            const new_timestamp = default_timestamp + 1;
            jest.spyOn(Date, "now").mockImplementation(() => new_timestamp);
            const non_basic_activity = new Activity(
                new HoursAndMinutes(20, 5), new HoursAndMinutes(23,44), "non_basic", "non_basic_content"
            );
            existing_day.schedule.add_activity(new Activity());
            existing_day.schedule.add_activity(non_basic_activity);
            existing_day.mood_fields[0].set_data(existing_day.mood_fields[0].get_data() + 1);

            expect(journal_service.update_day(user, existing_day)).toBe(new_timestamp);
            existing_day.update_timestamp = new_timestamp;
            expect(journal_service.get_json_day_obj(user, existing_day.date)).toEqual(existing_day.prepare_json_obj());
        });
        test("CouldntUpdateDay", () => {
            journal_dao.update_day = () => {throw new Error()};
            expect(() => journal_service.update_day(user, existing_day)).toThrow(CouldntUpdateDay);
        });
        test("ClientNotUpToDate", () => {
            existing_day.update_timestamp = default_timestamp - 1;
            expect(() => journal_service.update_day(user, existing_day)).toThrow(ClientNotUpToDate);
        });
    });
})

