/**
 * @jest-environment jsdom
 */

import { Day } from "../data/day.js";
import { Activity, HoursAndMinutes } from "../data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELDS_CLASS, MOOD_FIELDS_ID, SCHEDULED_ACTIVITIES_ID } from "./constants.js";
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
    activities.id = SCHEDULED_ACTIVITIES_ID;
    mood_fields.id = MOOD_FIELDS_ID;
    mood_fields.classList.add(MOOD_FIELDS_CLASS);
    document.body.appendChild(activities);
    document.body.appendChild(mood_fields);

    dom_day.render_day();

});

test("DomDay.remove_activity", () => {
    let btns = document.getElementsByClassName(ACTIVITIY_REMOVE_BTN_CLASS);
    // @ts-ignore
    btns[0].click();
    
    let activities = document.getElementById(SCHEDULED_ACTIVITIES_ID);
    expect(activities.children.length).toBe(1);
    // @ts-ignore
    expect(activities.children[0].getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0].innerText).toBe("A2");
    
    btns = document.getElementsByClassName(ACTIVITIY_REMOVE_BTN_CLASS);
    btns[0].appendChild(document.createElement("div"));
    // @ts-ignore
    btns[0].getElementsByTagName("div")[0].click();
    activities = document.getElementById(SCHEDULED_ACTIVITIES_ID);
    expect(activities.children.length).toBe(0);
});

test("DomDay._", () => {
    const index = 3; //In the default template, the 4th mood_field is a TextField
    const new_input = "this is the new input";
    const test_field = document.getElementById(MOOD_FIELDS_ID).querySelector('[index="' + index + '"]');
    
    expect(dom_day._get_day_copy_for_test().mood_fields[index].get_data()).not.toBe(new_input);
    
    test_field.value = new_input;
    test_field.dispatchEvent(new Event("input", {bubbles: true}));
    expect(dom_day._get_day_copy_for_test().mood_fields[index].get_data()).toBe(new_input);
});