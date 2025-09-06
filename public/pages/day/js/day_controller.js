import { get_day, post_signout } from "./api/day_api.js";
import { DomDay } from "./dom/dom_day.js";

const SIGN_OUT_ID = "sign_out";

export class DayController {
    #dom_day;
    constructor() {
    }

    async init() {
        document.getElementById(SIGN_OUT_ID).addEventListener("click", () => this.signout());
        this.#dom_day = new DomDay(await get_day());
        this.#dom_day.render_day();
    }

    async signout() {
        this.#dom_day.close()
            .then(() => post_signout())
            .then(() => window.location.href = "/signin");
    }
}
