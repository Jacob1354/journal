import { User } from "../../../../../shared/data/user.js";
import { ERROR_CLASS } from "../../const.js";
import { msg_pop_up, validate_form } from "../../dom_utils.js";
import { sign_up } from "./connexion_api.js";

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

document.getElementById("sign_up_btn").addEventListener("click", (e) => {
    const form = e.currentTarget.closest("form");
    if(validate_form(form)) {
        sign_up(get_user_from_form());
    } 
    else {
        msg_pop_up({ msg: "Error ! Cannot send a form with empty fields", el_class: ERROR_CLASS});
    }
});