import { User } from "../../data/user.js";

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
                signup_error_text.innerText = text;
                signup_success_text.innerText = "";
            })
        }
        else {
            res.text()
            .then((text) => {
                signup_success_text.innerText = 
                    "New account created successfully";
                signup_error_text.innerText = "";
        })
    }
}

function handle_signup_err (err) {
    console.log(err);
    signup_error_text.innerText = 
                    "Couldn't create account sorry :/";
    signup_success_text.innerText = "";
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
            signup_error_text.innerText = "Error ! Cannot send a form with empty fields";
            signup_success_text.innerText = "";
        }
    }
);