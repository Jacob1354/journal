import { DomDay } from "./dom/dom_day.js"
import { get_day } from "./api/day_api.js";

let dom_day = new DomDay(await get_day());

dom_day.render_day();

document.getElementById("activity_adder_btn").addEventListener("click", () => dom_day.add_activity());