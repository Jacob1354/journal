import Database from "better-sqlite3";
import { ClientNotUpToDate, CouldntUpdateDay, DayAlreadyExists, DayDoesntExist, JournalDAO } from "./journal_dao";
import { AuthDAO } from "./auth_dao";
import {readFileSync} from 'fs';
import { InvalidUser, User } from "../../shared/data/user";
import { Day } from "../../shared/data/day";
import { Activity, HoursAndMinutes, Schedule } from "../../shared/data/schedule";
import { FractionField, NumberField, SliderField, TextField } from "../../shared/data/mood_field";

const nb_field = new NumberField("nb_field", 10);
const text_field1 = new TextField("text_field1", "text");
const text_field2 = new TextField("text_field2", "text");
const fraction_field = new FractionField("fraction_field", 9, 10);
const slider_field = new SliderField("slider_field", 10);
const fields = [nb_field, text_field1, fraction_field, slider_field, text_field2];

const existing_date = new Date();
existing_date.setDate(1);
existing_date.setMonth(1);
existing_date.setFullYear(1995);
let existing_day = new Day(existing_date);
const existing_activity = new Activity();
existing_day.schedule.add_activity(existing_activity);
existing_day.mood_fields = [...fields];

const existing_empty_day = new Day();
existing_empty_day.date.setFullYear(1990);
existing_empty_day.mood_fields = [];
const existing_day_update_timestamp = 500;
existing_day.update_timestamp = existing_day_update_timestamp;

const new_date = new Date();
const new_day = new Day(new_date);
const new_activity = new Activity();
new_day.schedule.add_activity(new_activity);
new_day.mood_fields = [...fields];

const db = new Database(":memory:");
const journal_dao = new JournalDAO(db);
const user = new User({username: "user", hash: "hash", name: "name"});
const invalid_user = new User({username: "invalid_user"});

beforeAll(() => {
    const auth_script = readFileSync("./server/db_scripts/auth_setup.sql", "utf8");
    const journal_script = readFileSync("./server/db_scripts/journal_setup.sql", "utf8");
    const auth_dao = new AuthDAO(db);
    db.exec(auth_script);
    db.exec(journal_script);
    auth_dao.add_user(user);
});

beforeEach(() => {
    db.prepare("INSERT INTO day (username, date, update_timestamp) VALUES (?, ?, ?)")
    .run(user.username, String(existing_day.date), existing_day.update_timestamp);
    const day_id = db.prepare("SELECT id FROM day WHERE username = ? AND date = ?")
        .get(user.username, String(existing_day.date)).id;
    db.prepare("INSERT INTO activity(day_id, title, content, start_time,end_time) VALUES (?, ?, ?, ?, ?)")
        .run(day_id, existing_activity.title, existing_activity.content,
            String(existing_activity.start_time), String(existing_activity.end_time)
        );

    db.prepare("INSERT INTO number_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
        .run(day_id, 0, nb_field.get_field_name(), nb_field.get_data());
    db.prepare("INSERT INTO text_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
        .run(day_id, 1, text_field1.get_field_name(), text_field1.get_data());
    db.prepare("INSERT INTO fraction_field (day_id, arr_index, title, data, denominator) VALUES (?, ?, ?, ?, ?)")
        .run(day_id, 2, fraction_field.get_field_name(), fraction_field.get_data(), fraction_field.get_denominator());
    db.prepare("INSERT INTO slider_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
        .run(day_id, 3, slider_field.get_field_name(), slider_field.get_data());
    db.prepare("INSERT INTO text_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
        .run(day_id, 4, text_field2.get_field_name(), text_field2.get_data());
    db.prepare("INSERT INTO day (username, date, update_timestamp) VALUES (?, ?, ?)")
        .run(user.username, String(existing_empty_day.date), existing_day.update_timestamp);

    existing_day = new Day(existing_date);
    existing_day.update_timestamp = existing_day_update_timestamp;
    existing_day.schedule.add_activity(existing_activity);
    existing_day.mood_fields = [...fields];
});

afterEach(() => {
    const reset_script = `
        DELETE FROM activity;
        DELETE FROM number_field;
        DELETE FROM fraction_field;
        DELETE FROM text_field;
        DELETE FROM slider_field;
        DELETE FROM day;
    `;
    db.exec(reset_script);
});

describe("JournalDAO", () => {
    describe("get_day", () => {
        test("Success", () => {
            expect(journal_dao.get_day(user, existing_day.date)).toEqual(existing_day);
        });
        
        test("No data found (null)", () => {
            expect(journal_dao.get_day(user, new_day.date)).toBe(null);
        });
        
        test("InvalidUser", () => {
            expect(() => journal_dao.get_day(invalid_user, existing_day.date)).toThrow(InvalidUser);
        });

        describe("Private functions", () => {
            test("_check_if_user_exists: success", () => {
                expect(journal_dao._check_if_user_exists(user)).toBeTruthy();
                expect(journal_dao._check_if_user_exists(invalid_user)).toBeFalsy();
            });
            
            test("_get_mood_fields_id: success", () => {
                expect(journal_dao._get_day_id(user, existing_day.date)).toBeTruthy();
                expect(journal_dao._get_day_id(user, new_day.date)).toBeFalsy();
            });
            
            test("_get_mood_fields: success", () => {
                const mood_fields_id = journal_dao._get_day_id(user, existing_day.date);
                const result = journal_dao._get_mood_fields(mood_fields_id)
                                            .sort((a, b) => a.get_field_name().localeCompare(b.get_field_name()));
                const expected = existing_day.mood_fields
                                            .sort((a, b) => a.get_field_name().localeCompare(b.get_field_name()));
                expect(result).toEqual(expected);
            });
            
            test("_get_activities: success", () => {
                //Uses schedule to make sure they're sorted properly
                const day_id = journal_dao._get_day_id(user, existing_day.date);
                const result_schedule = new Schedule(journal_dao._get_activities(day_id));
                expect(result_schedule.get_activities()).toEqual(existing_day.schedule.get_activities());
            });
        })

    });

    describe("create_day", () => {
        test("success", () => {
            journal_dao.create_day(user, new_day);
            expect(journal_dao.get_day(user, new_day.date)).toEqual(new_day);
        });
        test("InvalidUser", () => {
            expect(() => journal_dao.create_day(invalid_user, new_day)).toThrow(InvalidUser);
        });
        test("DayAlreadyExists", () => {
            expect(() => journal_dao.create_day(user, existing_day)).toThrow(DayAlreadyExists);
        });
    });

    describe("update_day", () => {
        test("Success", () => {
            const new_timestamp = existing_day.update_timestamp + 1;
            jest.spyOn(Date, "now").mockImplementation(() => new_timestamp);
            existing_day.schedule.update_activity_content(0, existing_day.schedule.get_activities()[0].content + "now different");
            const new_activity = new Activity();
            new_activity.title = "New activity";
            existing_day.schedule.add_activity(new_activity);
            existing_day.mood_fields[0].set_data(existing_day.mood_fields[0].get_data() + 1);
            existing_day.mood_fields[2].set_denominator(existing_day.mood_fields[2].get_denominator() + 1);

            journal_dao.update_day(user, existing_day);
            expect(journal_dao.get_day(user, existing_day.date).prepare_json_obj())
                .toEqual(existing_day.prepare_json_obj());
            Date.now.mockRestore();
        });
        test("DayDoesntExist", () => {
            expect(() => journal_dao.update_day(user, new_day)).toThrow(DayDoesntExist);
        });
        test("InvalidUser", () => {
            expect(() => journal_dao.update_day(invalid_user, existing_day)).toThrow(InvalidUser);
        });
        test("CouldntUpdateDay", () => {
            const og = journal_dao._update_db_transaction;
            journal_dao._update_db_transaction = () => {throw new Error()};
            expect(() => {journal_dao.update_day(user, existing_day)}).toThrow(CouldntUpdateDay);
            
            journal_dao._update_db_transaction = og;
        });
        test("ClientNotUpToDate", () => {
            existing_day.update_timestamp = existing_day_update_timestamp + 1;
            expect(() => journal_dao.update_day(user, existing_day)).toThrow(ClientNotUpToDate);
        });
    })
})
