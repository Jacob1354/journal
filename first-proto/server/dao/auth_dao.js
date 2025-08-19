import Database from "better-sqlite3";
import { validate_type } from "first-proto/shared/clean_code/clean_code_enforcement";

export class AuthDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }
    
    get_user(username) {
        throw new Error("Not implemented");
    }

    get_user_from_session(session) {
        throw new Error("Not implemented");
    }

    add_user(user) {
        throw new Error("Not implemented");
    }

    add_session(user, session) {
        throw new Error("Not implemented");
    }
}

export class UnavailableUsername extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnavailableUsername";
    }
}

export class UnvailableSession extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnvailableSession";
    }
}
