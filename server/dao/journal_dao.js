import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";
import { InvalidUser, User } from "../../shared/data/user.js";

export class JournalDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }

    create_day(user, date) {

    }

    get_day(user, date) {
        validate_type(user, User);
        validate_type(date, Date);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        const mood_fields_id = this._get_mood_fields_id(user, date); 
        if(mood_fields_id != null) { // If a day exists, it always has a mood_fields row, even without mood fields
            const day = new Day(date);
            day.mood_fields = this._get_mood_fields(user, mood_fields_id);
            day.schedule.add_activities(this._get_activities(user, date));
            return day;
        } else {
            return null;
        }
    }

    _check_if_user_exists(user) {
        const user_result = this.#db.prepare("SELECT username FROM user WHERE username = ?").get(user.username);
        return user_result ? true : false;
    }
    _get_mood_fields_id(user, date) {

    }
    _get_mood_fields(user, mood_fields_id) {

    }
    _get_activities(user, date) {

    }
}