import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";
import {  } from "./dom/schedule.js";
import { DomDay } from "./dom/dom_day.js"

function get_day_from_url() {

}

function fetch_day(day) {
    
}

let dom_day = new DomDay(new Day());

dom_day.render_day();

document.getElementById("activity_adder_btn").addEventListener("click", () => dom_day.add_activity());