import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";

export class JournalDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }

    create_day(user, date) {

    }

    get_day(user, date) {
        return new Day();
    }
}