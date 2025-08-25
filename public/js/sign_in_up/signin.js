import { User } from "../../../shared/data/user.js";

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
                document.getElementById("signin_err").innerText = text;
                document.getElementById("signin_success").innerText = "";
            })
    }
    else {  
        window.location.href = "/day";
    }
}

function handle_signin_error(err) {
    console.log(err);
    document.getElementById("signin_err").innerText = 
    "An error occured and we couldn't sign you in sorry :/";
    document.getElementById("signin_success").innerText = "";
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
        document.getElementById("signin_err").innerText = "Error ! Cannot send a form with empty fields";
        document.getElementById("signin_success").innerText = "";
    }
})
            