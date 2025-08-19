import Database from "better-sqlite3";
import { validate_type } from "first-proto/shared/clean_code/clean_code_enforcement";
import { JournalDAO } from "../dao/journal_dao";

export class JournalService {
    #journal_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#journal_dao = new JournalDAO(db);
    }
}