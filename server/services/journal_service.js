import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { JournalDAO } from "../dao/journal_dao.js";
import { InternalServerError } from "../server_const.js";
import { Day } from "../../shared/data/day.js";

export class JournalService {
    #journal_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#journal_dao = new JournalDAO(db);
    }

    get_json_day_obj(user, decomposed_date = {date, month, year}) {
        const date = this._date_from_decomposed(decomposed_date);
        let day;
        try {
            day = this.#journal_dao.get_day(user, date);
        } catch(err) {
            throw new InternalServerError("Couldn't get day\n" + err);
        }
        if(day == null) {
            try {
                this.#journal_dao.create_day(user, new Day(date));
            } catch(err) {
                throw new InternalServerError("Couldn't create new day\n" + err);
            }
            return this.get_json_day_obj(user, decomposed_date);
        } else {
            return day.prepare_json_obj();
        }
    }

    _date_from_decomposed({date, month, year}) {
        const date_obj = new Date();
        try {
            date_obj.setDate(date);
            date_obj.setMonth(month);
            date_obj.setFullYear(year);
        } catch(err) {
            throw new CouldntCreateDate(err);
        }
        return date_obj;
    }

    _set_dao_for_tests(new_dao) {
        this.#journal_dao = new_dao;
    }
}

export class InvalidDate extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDate";
    }
}

export class CouldntCreateDate extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CouldntCreateDate";
    }
}

