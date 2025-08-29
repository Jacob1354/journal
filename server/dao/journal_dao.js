import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";
import { InvalidUser, User } from "../../shared/data/user.js";
import { FractionField, NumberField, SliderField, TextField } from "../../shared/data/mood_field.js";
import { Activity, HoursAndMinutes } from "../../shared/data/schedule.js";

export class JournalDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }

    create_day(user, date) {
        validate_type(user, User);
        validate_type(date, Date);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        if(this._get_mood_fields_id(user, date)) throw new DayAlreadyExists();// Every day, even without mood_fields has a mood_fields_id
        const day = new Day(date);
        this._create_activities(user, day);
        this._create_mood_fields(user, day);
    }

    get_day(user, date) {
        validate_type(user, User);
        validate_type(date, Date);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        const mood_fields_id = this._get_mood_fields_id(user, date); 
        if(mood_fields_id != null) { // If a day exists, it always has a mood_fields row, even without mood fields
            const day = new Day(date);
            day.mood_fields = this._get_mood_fields(mood_fields_id);
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
        const mood_fields = this.#db.prepare("SELECT id FROM mood_fields WHERE username = ? AND date = ?")
            .get(user.username, String(date));
        return mood_fields ? mood_fields.id : null;
    }
    _get_mood_fields(mood_fields_id) {
        let fields = [];
        const nb_fields = this._get_number_fields(mood_fields_id);
        if(nb_fields) fields = fields.concat(nb_fields);
        const text_fields = this._get_text_fields(mood_fields_id);
        if(text_fields) fields = fields.concat(text_fields);
        const fraction_fields = this._get_fraction_fields(mood_fields_id);
        if(fraction_fields) fields = fields.concat(fraction_fields);
        const slider_fields = this._get_slider_fields(mood_fields_id);
        if(slider_fields) fields = fields.concat(slider_fields);
        return fields;
    }
    _get_number_fields(mood_fields_id) {
        const fields = this.#db.prepare("SELECT * FROM number_field WHERE mood_fields_id = ?")
                                    .all(mood_fields_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push(new NumberField(field.title, Number(field.data)));
            });
        }
        return result;
    }
    _get_text_fields(mood_fields_id) {
        const fields = this.#db.prepare("SELECT * FROM text_field WHERE mood_fields_id = ?")
                                    .all(mood_fields_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push(new TextField(field.title, field.data));
            });
        }
        return result;
    }
    _get_fraction_fields(mood_fields_id) {
        const fields = this.#db.prepare("SELECT * FROM fraction_field WHERE mood_fields_id = ?")
                                    .all(mood_fields_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push(new FractionField(field.title, Number(field.data), Number(field.denominator)));
            });
        }
        return result;
    }
    _get_slider_fields(mood_fields_id) {
        const fields = this.#db.prepare("SELECT * FROM slider_field WHERE mood_fields_id = ?")
                                    .all(mood_fields_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push(new SliderField(field.title, Number(field.data)));
            });
        }
        return result;
    }
    _get_activities(user, date) {
        const activities = this.#db.prepare("SELECT * FROM activity WHERE username = ? AND date = ?")
            .all(user.username, String(date));
        const result = [];
        if(activities) {
            activities.forEach(activity => {
                result.push(new Activity(
                    HoursAndMinutes.from_string(activity.start_time),
                    HoursAndMinutes.from_string(activity.end_time),
                    activity.title,
                    activity.content
                ));
            })
        }
        return result;
    }

    _create_activities(user, day) {

    }
    _create_mood_fields(user, day) {
        
    }
}

export class DayAlreadyExists extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DayAlreadyExists";
    }
}