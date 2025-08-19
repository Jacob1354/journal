import { validate_type } from "../../shared/clean_code/clean_code_enforcement";
import { AuthDAO } from "../dao/auth_dao";
import { randomBytes } from 'crypto';
import { User } from "../data/auth_data";
import Database from "better-sqlite3";

export class AuthService {
    #auth_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#auth_dao = new AuthDAO(db);
    }

    signup_user(user) {
        validate_type(user, User);
        this._check_if_user_is_valid(user);
        this._check_if_username_is_taken(user);
        this.#auth_dao.add_user(user);
    }


    /*
     * Checks if the user exists using the username and if the password is valid.
     * If it's the case, it creates and return a session cookie
    */
    signin_user(user) {
        validate_type(user, User);
        const db_user = this.#auth_dao.get_user(user.username)
        if(!db_user)
            throw new UserNotFound("Couldn't sign in user since they couldn't be found");
        if(user.password != db_user.password)
            throw new InvalidPassword("Invalid password");

        const session = randomBytes(32);
        this.#auth_dao.add_session(user, session);
        return session;
    }

    authenticate_session(session) {
        validate_type(session, "string");
        const user = this.#auth_dao.get_user_from_session(session);
        if(user == null) 
            throw new InvalidSession("Invalid Session");
        return user;
    }

    _check_if_user_is_valid(user) {
        validate_type(user, User);
        if(!user.username || user.username === ""
            || !user.password || user.password === "" 
            || !user.name || user.name === ""
        ) {
            throw new InvalidUser("One of the props of the user is invalid");
        }
    }

    _check_if_username_is_taken(user) {
        try {
            if(this.#auth_dao.get_user(user.username))
                throw new UnavailableUsername("Unvailable username");
        } catch(err) {
            if(err instanceof UnavailableUsername)
                throw err;
            else 
                throw new UnableToCreateUser("Couldn't get_user from db to check username");
        }
    }

}



export class UnableToCreateUser extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnableToCreateUser";
    }
}

export class UnavailableUsername extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UnavailableUsername";
    }
}

export class InvalidUser extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidUser";
    }
}

export class UserNotFound extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UserNotFound";
    }
}

export class InvalidPassword extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidPassword";
    }
}

export class InvalidSession extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidSession";
    }
}
