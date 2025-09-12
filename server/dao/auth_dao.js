import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { User, InvalidUser } from "../../shared/data/user.js";

export class AuthDAO {
    #db;
    constructor(db) {
        validate_type(db, Database);
        this.#db = db;
    }
    
    
    /**
     * Returns the user if it was found and null otherwise
     * 
     * @param {string} username 
     * @returns {User} 
     */
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

    
    /**
     * Returns the user if it was found and null otherwise
     *
     * @param {string} session 
     * @returns {User} 
     */
    get_user_from_session(session) {
        validate_type(session, "string");
        let user;
        let row = this.#db.prepare("SELECT * FROM session WHERE session = ?").get(session);
        if(row) {
            if(row.delete_time > Date.now()) {
                row = this.#db.prepare("SELECT * FROM user WHERE username = ?").get(row.username);
                if(row) {
                    user = new User({
                        username: row.username,
                        name: row.name
                    })
                } 
            } else {
                this.#db.prepare("DELETE FROM session WHERE session = ? AND username = ?")
                    .run(session, row.username);
            }
        }
        return user ? user : null;
    }

    
    /**
     * Add a user tp the db
     *
     * @param {User} user 
     * 
     * @throws {InvalidUser} If the User object doesn't have a username, name or hash
     * @throws {UnavailableUsername} If username isn't unique
     */
    add_user(user) {
        validate_type(user, User);
        if(!user.username || !user.hash || !user.name)
            throw new InvalidUser("auth_dao: Couldn't add_user, it is invalid");
        try{
            this.#db.prepare("INSERT INTO user (username, hash, name) VALUES (?, ?, ?)")
                .run(user.username, user.hash, user.name);
        } catch(err) {
            if(err.code === "SQLITE_CONSTRAINT_PRIMARYKEY" || err.code === "SQLITE_CONSTRAINT_UNIQUE")
                throw new UnavailableUsername("Unvailable unsername");
            else
                throw err;
        }
    }

    
    /**
     * Creates a new session token in the db with a max_age of ms_before_removal milliseconds
     *
     * @param {User} user 
     * @param {string} session 
     * @param {number} ms_before_removal 
     * 
     * @throws {InvalidSession} If the session isn't unique
     */
    add_session(user, session, ms_before_removal) {
        validate_type(user, User);
        validate_type(session, "string");
        try {
            this.#db.prepare("INSERT INTO session (username, session, delete_time) VALUES (?, ?, ?)")
                .run(user.username, session, Date.now() + ms_before_removal);
        } catch(err) {
            if(err.code === "SQLITE_CONSTRAINT_UNIQUE" || err.code === "SQLITE_CONSTRAINT_PRIMARYKEY")
                throw new InvalidSession("Session already taken");
            else
                throw err;
        }
    }

    
    /**
     * Removes a session from the db
     *
     * @param {string} session 
     */
    remove_session(session) {
        validate_type(session, "string");
        this.#db.prepare("DELETE FROM session WHERE session = ?").run(session);
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

