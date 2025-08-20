import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement";
import { User } from "../data/auth_data";
import { InvalidUser } from "../services/auth_sevice";

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
        validate_type(session, "string");
        let user;
        let row = this.#db.prepare("SELECT * FROM session WHERE session = ?").get(session);
        if(row) {
            row = this.#db.prepare("SELECT * FROM user WHERE username = ?").get(row.username);
            if(row) {
                user = new User({
                    username: row.username,
                    name: row.name
                })
            } 
        }
        return user ? user : null;
    }

    add_user(user) {
        validate_type(user, User);
        if(!user.username || !user.hash || !user.name)
            throw new InvalidUser("auth_dao: Couldn't add_user, it is invalid");
        try{
            this.#db.prepare("INSERT INTO user (username, hash, name) VALUES (?, ?, ?)")
                .run(user.username, user.hash, user.name);
        } catch(err) {
            if(err instanceof Database.SqliteError 
                && (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY" 
                    || err.code === "SQLITE_CONSTRAINT_UNIQUE")) {
                throw new UnavailableUsername("Unvailable unsername");
            }
            else
                throw err;
        }
    }

    add_session(user, session) {
        validate_type(user, User);
        validate_type(session, "string");
        try {
            this.#db.prepare("INSERT INTO session (username, session) VALUES (?, ?)")
                .run(user.username, session);
        }
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
