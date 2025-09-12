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
    const username = document.getElementById("username_input").value;
    const password = document.getElementById("password_input").value;
    const user = new User({
        username: username,
        password: password
    });
    return user;
}

function handle_signin_response(res) {
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

function handle_signin_error(err) {
    console.log(err);
    msg_pop_up({ msg: "An error occured and we couldn't sign you in sorry :/", el_class: ERROR_CLASS});
}


document.getElementById("sign_in_btn").addEventListener("click", (e) => {
    const form = e.currentTarget.closest("form");
    if(validate_form(form)) {
        const user = get_user_from_form();
        fetch("/signin", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(handle_signin_response)
        .catch(handle_signin_error);
    } 
    else {
        msg_pop_up({ msg: "Error ! Cannot send a form with empty fields", el_class: ERROR_CLASS});
    }
})
            