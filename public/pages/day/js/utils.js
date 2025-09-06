import { post_signout } from "./api/day_api.js";

const SIGN_OUT_ID = "sign_out";

export function init() {
    document.getElementById(SIGN_OUT_ID).addEventListener("click", signout);
}


export function signout() {
    post_signout();
    window.location.href = "/signin";
}