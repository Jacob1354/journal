import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement";
import { User } from "../data/auth_data";

export class AuthDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }
    
    get_user(username) {
        validate_type(username, "string");
        let user;
        const row = this.#db.prepare("SELECT * FROM user WHERE username = ?").get(username);
        if(row) {
            user = new User({
                username: row.username,
                hash: row.hash,
                name: row.name
            });
        }
        return user ? user : null;
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
