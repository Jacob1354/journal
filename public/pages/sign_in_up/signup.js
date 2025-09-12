import { User } from "../../../../../shared/data/user.js";
import { ERROR_CLASS } from "../../const.js";
import { msg_pop_up } from "../../dom_utils.js";

function validate_form(form) {
    const inputs = form.getElementsByTagName("input");
    for(let i = 0;  i < inputs.length; i++)
        if(inputs[i].value.trim() === "")
            return false;

    return true;
}

function get_user_from_form() {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;
    const user = new User({
        username: username,
        password: password,
        name: name
    });
    return user;
}

function handle_signup_response(res) {
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

function handle_signup_err (err) {
    console.log(err);
    msg_pop_up({ msg: "Couldn't create account sorry :/", el_class: ERROR_CLASS });
}

let signup_success_text = document.getElementById("create_user_success");
let signup_error_text = document.getElementById("create_user_error");

document.getElementById("sign_up_btn").addEventListener("click", (e) => {
    const form = e.currentTarget.closest("form");
    if(validate_form(form)) {
        const user = get_user_from_form();
        fetch("/signup", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json"
            }
            })
            .then(handle_signup_response)
            .catch(handle_signup_err);
        } 
        else {
            msg_pop_up({ msg: "Error ! Cannot send a form with empty fields", el_class: ERROR_CLASS});
        }
    }
);