import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";

export class JournalDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }
}