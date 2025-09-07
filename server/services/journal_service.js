import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { CouldntUpdateDay, JournalDAO } from "../dao/journal_dao.js";
import { InternalServerError } from "../server_const.js";
import { Day } from "../../shared/data/day.js";
import { InvalidUser } from "../../shared/data/user.js";
import { ClientNotUpToDate } from "../../shared/const.js";

export class JournalService {
    #journal_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#journal_dao = new JournalDAO(db);
    }

    get_json_day_obj(user, date) {
        let day;
        try {
            day = this.#journal_dao.get_day(user, date);
        } catch(err) {
            if(err instanceof InvalidUser)
                throw err;
            throw new InternalServerError("Couldn't get day\n" + err);
        }
        if(day == null) {
            try {
                this.#journal_dao.create_day(user, new Day(date));
            } catch(err) {
                throw new InternalServerError("Couldn't create new day\n" + err);
            }
            return this.get_json_day_obj(user, date);
        } else {
            return day.prepare_json_obj();
        }
    }

    update_day(user, day) {
        try {
            return this.#journal_dao.update_day(user, day);
        } catch(err) {
            if(err instanceof ClientNotUpToDate)
                throw err;
            throw new CouldntUpdateDay(err);
        }
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
