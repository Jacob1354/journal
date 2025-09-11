import Database from "better-sqlite3";
import { AuthService } from "./services/auth_sevice.js";
import { JournalService } from "./services/journal_service.js";
import {readFileSync} from 'fs';
import { ERR_MSG_MUST_BE_LOGGED, ERR_MSG_SERVER_ERR, SQL_AUTH_SETUP_PATH, SQL_JOURNAL_SETUP_PATH, SQL_RESET_PATH } from "./server_const.js";
import { validate_type } from "../shared/clean_code/clean_code_enforcement.js";
import { InvalidSession } from "./dao/auth_dao.js";


/**
 * @export
 * @class JournalServer
 * @typedef {JournalServer}
 */
export class JournalServer {
    
    constructor() {
        this.db = this._setup_db();
        this.auth_service = new AuthService(this.db);
        this.journal_service = new JournalService(this.db);
    }

    close() {
        this.db.close();
    }

    
    /**
     * Tries to get the user matching the session passed as parameter.
     * If no match is found, then sends an error message to the client
     *
     * @param {string} session 
     * @param {Response} res 
     * @returns {User}
     */
    authenticate_session(session, res) {
        let user;
        try {
            user = this.auth_service.authenticate_session(session);
        } catch(err) {
            if(err instanceof InvalidSession)
                res.status(401).send(ERR_MSG_MUST_BE_LOGGED);
            else 
                res.status(500).send(ERR_MSG_SERVER_ERR);
        }
        return user;
    }

    
    /** Clears all the data from the db */
    reset_db() {
        const reset_script = readFileSync(SQL_RESET_PATH, "utf8");
        this.db.exec(reset_script);
        this.db.close();
        this.db = this._setup_db();
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