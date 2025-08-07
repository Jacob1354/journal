/**
 * @jest-environment jsdom
 */

import { Day } from "../data/day.js";
import { Activity, HoursAndMinutes } from "../data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, ACTIVITIES_ID } from "./constants.js";
import { DomDay } from "./dom_day.js";

const start_time1 = new HoursAndMinutes(10, 0);
const end_time1 = new HoursAndMinutes(14, 0);
const start_time2 = new HoursAndMinutes(10, 0);
const end_time2 = new HoursAndMinutes(14, 0);

const a1 = new Activity(start_time1, end_time1, "A1", "a1");
const a2 = new Activity(start_time2, end_time2, "A2", "a2");
let day;
let dom_day;

beforeEach(() => {
    day = new Day();
    day.schedule.add_activity(a1);
    day.schedule.add_activity(a2);
    dom_day = new DomDay(day);

    const activities = document.createElement("div");
    const mood_fields = document.createElement("div");
    activities.id = ACTIVITIES_ID;
    mood_fields.id = MOOD_FIELDS_WRAPPER_ID;
    mood_fields.classList.add(MOOD_FIELDS_WRAPPER_CLASS);
    document.body.appendChild(activities);
    document.body.appendChild(mood_fields);

    dom_day.render_day();

});
