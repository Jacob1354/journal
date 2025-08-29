import Database from "better-sqlite3";
import { JournalDAO } from "./journal_dao";
import { AuthDAO } from "./auth_dao";
import {readFileSync} from 'fs';
import { InvalidUser, User } from "../../shared/data/user";
import { Day } from "../../shared/data/day";
import { Activity, HoursAndMinutes, Schedule } from "../../shared/data/schedule";
import { FractionField, NumberField, SliderField, TextField } from "../../shared/data/mood_field";

const nb_field = new NumberField("nb_field", 10);
const text_field = new TextField("text_field", "text");
const fraction_field = new FractionField("fraction_field", 9, 10);
const slider_field = new SliderField("slider_field", 10);
const fields = [nb_field, text_field, fraction_field, slider_field];

const existing_date = new Date();
existing_date.setDate(1);
existing_date.setMonth(1);
existing_date.setFullYear(1995);
const existing_day = new Day(existing_date);
const existing_activity = new Activity();
existing_day.schedule.add_activity(existing_activity);
existing_day.mood_fields = [...fields];

const existing_empty_day = new Day();
existing_date.setFullYear(1990);
existing_empty_day.mood_fields = [];

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
    db.prepare("INSERT INTO activity(username, date, title, content, start_time,end_time) VALUES (?, ?, ?, ?, ?, ?)")
        .run(user.username, String(existing_date), 
            existing_activity.title, existing_activity.content,
            String(existing_activity.start_time), String(existing_activity.end_time)
        );
    db.prepare("INSERT INTO mood_fields (username, date) VALUES (?, ?)")
        .run(user.username, String(existing_day.date));
    const mood_id = db.prepare("SELECT id FROM mood_fields WHERE username = ? AND date = ?")
        .get(user.username, String(existing_day.date)).id;
    db.prepare("INSERT INTO number_field (mood_fields_id, title, data) VALUES (?, ?, ?)")
        .run(mood_id, nb_field.get_field_name(), nb_field.get_data());
    db.prepare("INSERT INTO text_field (mood_fields_id, title, data) VALUES (?, ?, ?)")
        .run(mood_id, text_field.get_field_name(), text_field.get_data());
    db.prepare("INSERT INTO fraction_field (mood_fields_id, title, data, denominator) VALUES (?, ?, ?, ?)")
        .run(mood_id, fraction_field.get_field_name(), fraction_field.get_data(), fraction_field.get_denominator());
    db.prepare("INSERT INTO slider_field (mood_fields_id, title, data) VALUES (?, ?, ?)")
        .run(mood_id, slider_field.get_field_name(), slider_field.get_data());
    db.prepare("INSERT INTO mood_fields (username, date) VALUES (?, ?)")
        .run(user.username, String(existing_empty_day.date));
});


test("JournalDAO.get_day: success", () => {
    expect(journal_dao.get_day(user, existing_day.date)).toEqual(existing_day);
});

test("JournalDAO.get_day: no data found (null)", () => {
    expect(journal_dao.get_day(user, existing_day.date)).toBe(null);
});

test("JournalDAO.get_day: InvalidUser", () => {
    expect(() => journal_dao.get_day(invalid_user, existing_day.date)).toThrow(InvalidUser);
});

test("JournalDAO._check_if_user_exists: success", () => {
    expect(journal_dao._check_if_user_exists(user)).toBeTruthy();
    expect(journal_dao._check_if_user_exists(invalid_user)).toBeFalsy();
});
test("JournalDAO._get_mood_fields_id: success", () => {
    expect(journal_dao._check_if_user_exists(user, existing_day.date)).toBeTruthy();
    expect(journal_dao._check_if_user_exists(user, new_day.date)).toBeFalsy();
});
test("JournalDAO._get_mood_fields: success", () => {
    const result = journal_dao._get_mood_fields(user, existing_day.date)
                                .sort((a, b) => a.get_field_name().localCompare(b.get_field_name()));
    const expected = existing_day.mood_fields
                                .sort((a, b) => a.get_field_name().localCompare(b.get_field_name()));
    expect(mood_fields).toEqual(expected);
    expect(journal_dao._get_mood_fields(user, existing_empty_day.date)).toBeFalsy();
});
test("JournalDAO._get_activities: success", () => {
    //Uses schedule to make sure they're sorted properly
    const result_schedule = new Schedule(journal_dao._get_activities(user, existing_day.date));
    expect(result_schedule.get_activities()).toEqual(existing_day.schedule.get_activities());
    expect(journal_dao._get_activities(user, existing_empty_day.date)).toBeFalsy();
});

