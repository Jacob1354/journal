import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";
import {  } from "./dom/schedule.js";
import { DomDay } from "./dom/dom_day.js"

function get_day() {
    return new Day();
}

let dom_day = new DomDay(get_day());

dom_day.render_day();

document.getElementById("activity_adder_btn").addEventListener("click", () => dom_day.add_activity());