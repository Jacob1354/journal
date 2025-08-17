import { AuthDAO } from "../dao/auth_dao";
import { randomBytes } from 'node:crypto';

export class AuthService {
    #auth_dao;
    constructor() {
        this.#auth_dao = new AuthDAO();
    }

    signup_user(user) {
        throw new Error("Not implemented");
    }


    /*
     * Checks if the user exists using the username and if the password is valid.
     * If it's the case, it creates and return a session cookie
    */
    signin_user(user) {
        const new_cookie = "TODO";
        
        return new_cookie;
    }

    authenticate_session(session) {
        
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
