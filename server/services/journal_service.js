import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { JournalDAO } from "../dao/journal_dao.js";
import { InternalServerError } from "../server_const.js";

export class JournalService {
    #journal_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#journal_dao = new JournalDAO(db);
    }

    get_json_day_obj(user, decomposed_date = {date, month, year}) {
    }

}

export class InvalidDate extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDate";
    }
}


