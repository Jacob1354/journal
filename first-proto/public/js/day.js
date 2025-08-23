import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../shared/data/day.js";
import {  } from "./dom/schedule.js";
import { DomDay } from "./dom/dom_day.js"

function get_date_from_url() {
    const date_regex = /\d+-\d+-\d+/;
    const url = window.location.href;
    const date_array = url.match(date_regex)[0].match(/\d+/g); //Format: [day, month, year]
    const date = new Date();
    date.setFullYear(Number(date_array[2]));
    date.setMonth(Number(date_array[1])-1); //-1 because jan is 0 for a weird reason
    date.setDate(Number(date_array[0]));
    return date;
}

function fetch_day(day) {
    return new Day();
}

let dom_day = new DomDay(fetch_day(get_date_from_url()));

dom_day.render_day();

document.getElementById("activity_adder_btn").addEventListener("click", () => dom_day.add_activity());