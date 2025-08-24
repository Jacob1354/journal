import { DomDay } from "./dom/dom_day.js"
import { fetch_day, get_date_from_url } from "./api/day_api.js";

let dom_day = new DomDay(fetch_day(get_date_from_url(window.location.href)));

dom_day.render_day();

document.getElementById("activity_adder_btn").addEventListener("click", () => dom_day.add_activity());