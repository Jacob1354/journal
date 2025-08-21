import Database from "better-sqlite3";
import { AuthService } from "./services/auth_sevice.js";
import { JournalService } from "./services/journal_service.js";
import {readFileSync} from 'fs';
import { SQL_AUTH_SETUP_PATH, SQL_JOURNAL_SETUP_PATH } from "./server_const.js";

export class JournalServer {
    
    constructor() {
        this.db = this._setup_db();
        this.auth_service = new AuthService(this.db);
        this.journal_service = new JournalService(this.db);
    }

    close() {
        this.db.close();
    }

    _setup_db() {
        let db;
        try {
            db = new Database("journal.db", {fileMustExist: true});
        } catch(err) {
            try {
                db = new Database("journal.db");
                const auth_setup = readFileSync(SQL_AUTH_SETUP_PATH, "utf8"); //Order is important
                const journal_setup = readFileSync(SQL_JOURNAL_SETUP_PATH, "utf8");
                db.exec(auth_setup);
                db.exec(journal_setup);
            } catch (err) {
                throw new CouldntStartDB("Couldn't start db during server setup :\n" + err);
            }
        }
        return db;
    }
}

class CouldntStartDB extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CouldntStartDB";
    }
}