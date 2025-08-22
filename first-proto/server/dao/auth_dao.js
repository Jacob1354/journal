import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { User, InvalidUser } from "../../shared/data/user.js";

export class AuthDAO {
    #db;
    #SESSION_MAX_AGE = 10_000;
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
            setTimeout(() => this._remove_session(session, user.username), this.#SESSION_MAX_AGE);
        } catch(err) {
            if(err instanceof Database.SqliteError 
                && (err.code === "SQLITE_CONSTRAINT_UNIQUE"
                    || err.code === "SQLITE_CONSTRAINT_PRIMARYKEY"))
                throw new InvalidSession("Session already taken");
            else
                throw err;
        }
    }

    _remove_session(session, username) {
        validate_type(session, "string");
        validate_type(username, "string");
        try {
            this.#db.prepare("DELETE FROM session WHERE session = ? AND username = ?")
                .run(session, username);
        } catch(err) {
            console.log(err); //TODO handle error
        }

    }
}

export class UnavailableUsername extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnavailableUsername";
    }
}
export class InvalidSession extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidSession";
    }
}

