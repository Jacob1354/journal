import { validate_type } from "../../../shared/clean_code/clean_code_enforcement.js";
import {User} from "../../../shared/data/user.js"
import { ERROR_CLASS } from "../../const.js";
import { msg_pop_up } from "../../dom_utils.js";

export function sign_up(user) {
    validate_type(user, User);
    if(!user.password) {
        msg_pop_up("You must enter a name and a password to signup", ERROR_CLASS);
    }
    fetch("/signup", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
        "Content-type": "application/json"
    }
    })
    .then(_handle_signup_response)
    .catch(_handle_signup_err);
}

export function sign_in(user) {
    validate_type(user, User);
    if(!user.password) {
        msg_pop_up("You must enter a password to signin", ERROR_CLASS);
    }
    fetch("/signin", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(_handle_signin_response)
    .catch(_handle_signin_error);
}

function _handle_signup_response(res) {
    if(res.status < 200 || res.status > 299) {
        res.text()
            .then((text) => {
                msg_pop_up({msg: text, el_class: ERROR_CLASS});
            })
        }
        else {
            res.text()
            .then((text) => {
                msg_pop_up({msg: "New account created successfully"});
        })
    }
}

function _handle_signup_err (err) {
    console.log(err);
    msg_pop_up({ msg: "Couldn't create account sorry :/", el_class: ERROR_CLASS });
}


function _handle_signin_response(res) {
    if(res.status < 200 || res.status > 299) {
        res.text()
            .then((text) => {
                msg_pop_up({msg: text, el_class: ERROR_CLASS});
            })
    }
    else {  
        window.location.href = "/day";
    }
}

function _handle_signin_error(err) {
    console.log(err);
    msg_pop_up({ msg: "An error occured and we couldn't sign you in sorry :/", el_class: ERROR_CLASS});
}