import Database from "better-sqlite3";
import { JournalService } from "./journal_service";
import { Day } from "../../shared/data/day";
import { InvalidUser, User } from "../../shared/data/user";
import { InternalServerError } from "../server_const";

const user = new User({username: "user"});
const invalid_user = new User({username: "invalid_user"});
const existing_day = new Day();
const existing_day_decomposed_date = {
    date: existing_day.date.getDate(), 
    month: existing_day.date.getMonth(), 
    year: existing_day.date.getFullYear()
};
const existing_day_json = existing_day.prepare_json_obj();

const new_date = new Date();
new_date.setDate(1);
new_date.setMonth(1);
new_date.setFullYear(1995);
const new_day = new Day(new_date);
const new_day_decomposed_date = {
    date: new_date.getDate(),
    month: new_date.getMonth(),
    year: new_date.getFullYear()
};
const new_day_json = new_day.prepare_json_obj();

const journal_service = new JournalService(new Database());

test.each([
    [existing_day_decomposed_date, existing_day_json], 
    [new_day_decomposed_date, new_day_json]
])("JournalService.get_json_day_obj: success", (decomposed_date, day) => {
    expect(journal_service.get_json_day_obj(user, decomposed_date)).resolves.toEqual(day);
});

test("JournalService.get_json_day_obj: Invalid user", () => {
    expect(journal_service.get_json_day_obj(invalid_user, existing_day)).rejects.toThrow(InvalidUser);
});

test("JournalService.get_json_day_obj: InternalServerError", () => {
    expect(journal_service.get_json_day_obj(user, existing_day)).rejects.toThrow(InternalServerError);
});