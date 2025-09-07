import { get_day, post_signout } from "./api/day_api.js";
import { DAY_NAV_LEFT_ARROW_ID, DAY_NAV_RIGHT_ARROW_ID } from "./dom/constants.js";
import { DomDay } from "./dom/dom_day.js";

const SIGN_OUT_ID = "sign_out";

export class DayController {
    #dom_day;
    constructor() {
    }

    async init() {
        document.getElementById(SIGN_OUT_ID).addEventListener("click", () => this.signout());
        document.getElementById(DAY_NAV_LEFT_ARROW_ID).addEventListener(
            "click", () => this.move_to_previous_day()
        );
        document.getElementById(DAY_NAV_RIGHT_ARROW_ID).addEventListener(
            "click", () => this.move_to_next_day()
        );

        this.#dom_day = new DomDay(await get_day());
        this.#dom_day.render_day();
    }

    async signout() {
        //TODO avoid depending on close() working properly
        this.#dom_day.close()
            .then(() => post_signout())
            .then(() => window.location.href = "/signin");
    }

    async move_to_next_day() {
        await this.load_new_day(new Date(
            this.#dom_day.get_date().getTime() + 1000 * 60 * 60 * 24 //Adding 24h to move to the next day
        ));
    }
    
    async move_to_previous_day() {
        await this.load_new_day(new Date(
            this.#dom_day.get_date().getTime() - 1000 * 60 * 60 * 24 //Removing 24h to move to the next day
        ));
    }

    async load_new_day(new_date) {
        this.#dom_day.close();
        this.#dom_day = new DomDay(await get_day(new_date));
        this.#dom_day.render_day();
    }
}
