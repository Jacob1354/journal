function validate_form(form) {
    const inputs = form.getElementsByTagName("input");
    for(let i = 0;  i < inputs.length; i++)
        if(inputs[i].value.trim() === "")
            return false;

    return true;
}

document.getElementById("sign_in_btn").addEventListener("click", (e) => {
        const form = e.currentTarget.closest("form");
        if(validate_form(form)) {
            const username = document.getElementById("username_input").value;
            const password = document.getElementById("password_input").value;
            const user = { "username": username, "pwd": password};
            fetch("/signin", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-type": "application/json"
                }
                })
                .then((res) => {
                    if(res.status < 200 || res.status > 299) {
                        res.text()
                            .then((text) => {
                                document.getElementById("signin_err").innerText = text;
                                document.getElementById("signin_success").innerText = "";
                            })
                        }
                        else {
                            res.json()
                            .then((obj) => {
                                document.getElementById("signin_success").innerText = 
                                    "Welcome " + obj.name + "!";
                                    document.getElementById("signin_err").innerText = "";
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            document.getElementById("signin_err").innerText = 
                            "An error occured and we couldn't sign you in sorry :/";
                            document.getElementById("signin_success").innerText = "";
                        });
        } 
        else {
            document.getElementById("signin_err").innerText = "Error ! Cannot send a form with empty fields";
            document.getElementById("signin_success").innerText = "";
        }
    })
            