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

    create_day(user, day) {
        validate_type(user, User);
        validate_type(day, Day);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        if(this._get_day_id(user, day.date)) throw new DayAlreadyExists();// Every day, even without mood_fields has a day_id        
        this._create_day_row(user, day);
        const day_id = this._get_day_id(user, day.date);
        if(!day_id) throw new CouldntCreateDay("");
        this._create_activities(day_id, day);
        this._create_mood_fields(day_id, day);
    }

    get_day(user, date) {
        validate_type(user, User);
        validate_type(date, Date);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        const day_id = this._get_day_id(user, date); 
        if(day_id != null) { // If a day exists, it always has a mood_fields row, even without mood fields
            const day = new Day(date);
            day.mood_fields = this._get_mood_fields(day_id);
            day.schedule.add_activities(this._get_activities(day_id));
            return day;
        } else {
            return null;
        }
    }
    
    update_day(user, day) {
        validate_type(user, User);
        validate_type(day, Day);
        if(!this._check_if_user_exists(user)) throw new InvalidUser();
        if(!this._get_day_id(user, day.date)) throw new DayDoesntExist();// Every day, even without mood_fields has a day_id        
        try {
            this.#db.transaction((user, day) => {this._update_db_transaction(user, day)})(user, day);
        } catch(err) {
            throw new CouldntUpdateDay(err);
        }
    }

    _check_if_user_exists(user) {
        const user_result = this.#db.prepare("SELECT username FROM user WHERE username = ?").get(user.username);
        return user_result ? true : false;
    }
    _get_day_id(user, date) {
        const day_row = this.#db.prepare("SELECT id FROM day WHERE username = ? AND date = ?")
            .get(user.username, String(date));
        return day_row ? day_row.id : null;
    }
    _get_mood_fields(day_id) {
        let fields = [];
        this._get_number_fields(day_id).forEach(field_wrapper => {
            fields[field_wrapper.index] = field_wrapper.field;
        });
        this._get_text_fields(day_id).forEach(field_wrapper => {
            fields[field_wrapper.index] = field_wrapper.field;
        });
        this._get_fraction_fields(day_id).forEach(field_wrapper => {
            fields[field_wrapper.index] = field_wrapper.field;
        });
        this._get_slider_fields(day_id).forEach(field_wrapper => {
            fields[field_wrapper.index] = field_wrapper.field;
        });
        return fields;
    }
    _get_number_fields(day_id) {
        const fields = this.#db.prepare("SELECT * FROM number_field WHERE day_id = ?")
                                    .all(day_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push({
                    index: field.arr_index,
                    field: new NumberField(field.title, Number(field.data))
                });
            });
        }
        return result;
    }
    _get_text_fields(day_id) {
        const fields = this.#db.prepare("SELECT * FROM text_field WHERE day_id = ?")
                                    .all(day_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push({
                    index: field.arr_index,
                    field: new TextField(field.title, field.data)
                });
            });
        }
        return result;
    }
    _get_fraction_fields(day_id) {
        const fields = this.#db.prepare("SELECT * FROM fraction_field WHERE day_id = ?")
                                    .all(day_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push({
                    index: field.arr_index,
                    field: new FractionField(field.title, Number(field.data), Number(field.denominator))
                });
            });
        }
        return result;
    }
    _get_slider_fields(day_id) {
        const fields = this.#db.prepare("SELECT * FROM slider_field WHERE day_id = ?")
                                    .all(day_id);
        const result = [];
        if(fields) {
            fields.forEach(field => {
                result.push({
                    index: field.arr_index,
                    field: new SliderField(field.title, Number(field.data))
                });
            });
        }
        return result;
    }
    _get_activities(day_id) {
        const activities = this.#db.prepare("SELECT * FROM activity WHERE day_id = ?")
            .all(day_id);
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

    _create_day_row(user, day) {
        validate_type(user, User);
        validate_type(day, Day);
        this.#db.prepare("INSERT INTO day (username, date) VALUES (?, ?)")
            .run(user.username, String(day.date));
    }

    _create_activities(day_id, day) {
        validate_type(day, Day);
        if(!day_id) throw new DayDoesntExist("");
        day.schedule.get_activities().forEach(activity => {
            this.#db.prepare("INSERT INTO activity (day_id, title, content, start_time, end_time)" 
                + "VALUES (?, ?, ?, ?, ?)").run(
                    day_id,
                    activity.title,
                    activity.content,
                    String(activity.start_time),
                    String(activity.end_time)
                );
        });
    }
    _create_mood_fields(day_id, day) {
        validate_type(day, Day);
        if(!day_id) throw new DayDoesntExist("");
        day.mood_fields.forEach((field, index) => {
            if(field instanceof NumberField)
                this._create_number_field(day_id, field, index);
            else if(field instanceof TextField)
                this._create_text_field(day_id, field, index);
            else if(field instanceof FractionField)
                this._create_fraction_field(day_id, field, index);
            else if(field instanceof SliderField)
                this._create_slider_field(day_id, field, index);
        })
    }

    _create_number_field(day_id, field, index) {
        validate_type(day_id, "number");
        validate_type(field, NumberField);
        this.#db.prepare("INSERT INTO number_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
            .run(day_id, index, field.get_field_name(), field.get_data());
        }
    _create_text_field(day_id, field, index) {
        validate_type(day_id, "number");
        validate_type(field, TextField);
        this.#db.prepare("INSERT INTO text_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
            .run(day_id, index, field.get_field_name(), field.get_data());
        
    }
    _create_fraction_field(day_id, field, index) {
        validate_type(day_id, "number");
        validate_type(field, FractionField);
        this.#db.prepare("INSERT INTO fraction_field (day_id, arr_index, title, data, denominator) VALUES (?, ?, ?, ?, ?)")
            .run(day_id, index, field.get_field_name(), field.get_data(), field.get_denominator());
        
    }
    _create_slider_field(day_id, field, index) {
        validate_type(day_id, "number");
        validate_type(field, SliderField);
        this.#db.prepare("INSERT INTO slider_field (day_id, arr_index, title, data) VALUES (?, ?, ?, ?)")
            .run(day_id, index, field.get_field_name(), field.get_data());
    }

    _update_db_transaction(user, day) {
        validate_type(user, User);
        validate_type(day, Day);
        this._update_activities(user, day);
        this._update_mood_fields(user, day);
    }

    _update_activities(user, day) {
        this.#db.prepare("DELETE FROM activity WHERE username = ? AND date = ?")
            .run(user.username, String(day.date));
        this._create_activities(user, day);
    }

    _update_mood_fields(user, day) {
        const mood_fields_id = this._get_mood_fields_id(user, day.date);
        day.mood_fields.forEach(field => {
            if(field instanceof NumberField) {
                this.#db.prepare("UPDATE number_field SET data = ? WHERE mood_fields_id = ? AND title = ?")
                    .run(field.get_data(), mood_fields_id, field.get_field_name());
            }
            else if(field instanceof TextField) {
                this.#db.prepare("UPDATE text_field SET data = ? WHERE mood_fields_id = ? AND title = ?")
                    .run(field.get_data(), mood_fields_id, field.get_field_name());
                
            }
            else if(field instanceof FractionField) {
                this.#db.prepare("UPDATE fraction_field SET data = ?, denominator = ?" 
                                    + "WHERE mood_fields_id = ? AND title = ?")
                    .run(field.get_data(), field.get_denominator(), mood_fields_id, field.get_field_name());
                
            }
            else if(field instanceof SliderField) {
                this.#db.prepare("UPDATE number_field SET data = ? WHERE mood_fields_id = ? AND title = ?")
                    .run(field.get_data(), mood_fields_id, field.get_field_name());

            }
        })
    }
}

export class DayAlreadyExists extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DayAlreadyExists";
    }
}

export class CouldntUpdateDay extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CouldntUpdateDay";
    }
}

export class DayDoesntExist extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DayDoesntExist";
    }
}

export class CouldntCreateDay extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CouldntCreateDay";
    }
}
