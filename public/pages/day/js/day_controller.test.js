/**
 * @jest-environment jsdom
 */

import { Day } from "../../../../shared/data/day.js";
import { Activity, HoursAndMinutes } from "../../../../shared/data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, ACTIVITIES_ID, ACTIVITY_CLASS, ACTIVITIY_STARTTIME_CLASS, ACTIVITIY_ENDTIME_CLASS, MOOD_FIELD_INPUT_CLASS, ACTIVITY_ADDER_BTN_ID, DAY_NAMES, DAY_NAV_DATE_ID, SIGNOUT_ID, DAY_NAV_LEFT_ARROW_ID, DAY_NAV_RIGHT_ARROW_ID, EVENT_REMOVE_ACTIVITY } from "./dom/constants.js";
import { post_signout, post_day, InvalidAuth } from "./api/day_api.js";
import { jest } from "@jest/globals";

const activities = document.createElement("div");
activities.id = ACTIVITIES_ID;
const mood_fields = document.createElement("div");
mood_fields.id = MOOD_FIELDS_WRAPPER_ID;
mood_fields.classList.add(MOOD_FIELDS_WRAPPER_CLASS);

const signout_btn = document.createElement("button");
signout_btn.id = SIGNOUT_ID;
const activity_adder_btn = document.createElement("button");
activity_adder_btn.id = ACTIVITY_ADDER_BTN_ID;
const left_arrow_btn = document.createElement("button");
left_arrow_btn.id = DAY_NAV_LEFT_ARROW_ID;
const right_arrow_btn = document.createElement("button");
right_arrow_btn.id = DAY_NAV_RIGHT_ARROW_ID;
const day_nav_date = document.createElement("h1");
day_nav_date.id = DAY_NAV_DATE_ID;
document.body.appendChild(activity_adder_btn); //Not relevant wether it's actually at the right place or not until there
document.body.appendChild(activities);
document.body.appendChild(mood_fields);
document.body.appendChild(signout_btn);
document.body.appendChild(day_nav_date);
document.body.appendChild(left_arrow_btn);
document.body.appendChild(right_arrow_btn);

const input_event = new Event("input", {bubbles: true});

const start_time1 = new HoursAndMinutes(10, 0);
const end_time1 = new HoursAndMinutes(14, 0);
const start_time2 = new HoursAndMinutes(10, 0);
const end_time2 = new HoursAndMinutes(14, 0);

const a1 = new Activity(start_time1, end_time1, "A1", "a1");
const a2 = new Activity(start_time2, end_time2, "A2", "a2");
let day;
let day_controller;
const clean_dom = document.body.innerHTML;

jest.unstable_mockModule("./api/day_api.js", jest.fn(() => ({
    get_day: jest.fn(async () => day),
    post_day,
    post_signout,
    InvalidAuth
})));

const {get_day} = await import("./api/day_api.js");
const {DayController} = await import("./day_controller.js")

beforeEach(() => {
    document.body.innerHTML = clean_dom;

    const activities = document.createElement("div");
    const mood_fields = document.createElement("div");
    activities.id = ACTIVITIES_ID;
    mood_fields.id = MOOD_FIELDS_WRAPPER_ID;
    mood_fields.classList.add(MOOD_FIELDS_WRAPPER_CLASS);
    const activity_adder_btn = document.createElement("button");
    activity_adder_btn.id = ACTIVITY_ADDER_BTN_ID;
    const day_nav_date = document.createElement("h1");
    day_nav_date.id = DAY_NAV_DATE_ID;
    document.body.appendChild(activities);
    document.body.appendChild(mood_fields);
    document.body.appendChild(activity_adder_btn); //Not relevant wether it's actually at the right place or not
    document.body.appendChild(day_nav_date); //Not relevant wether it's actually at the right place or not

    day = new Day();
    day.schedule.add_activity(a1);
    day.schedule.add_activity(a2);
    day_controller = new DayController(day);

});

test("_remove_activity", () => {
    const spy_fct = jest.spyOn(day_controller, "_remove_activity");
    const activity_index = 0;
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const remove_btn = a1.getElementsByClassName(ACTIVITIY_REMOVE_BTN_CLASS)[0];
    const update_event = new Event("");
    Object.defineProperty(update_event, "target", { value: remove_btn });
    
    expect(day_controller.get_day().schedule.get_activities().length).toBe(2);
    day_controller._remove_activity(update_event);
    expect(day_controller.get_day().schedule.get_activities().length).toBe(1);
    expect(day_controller.get_day().schedule.get_activities()[activity_index].title).toBe("A2");
});

test("_update_activity_title", () => {
    const activity_index = 0;
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_title = "new title";
    const title_el = a1.getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0];
    const update_event = new Event("");
    Object.defineProperty(update_event, "target", { value: title_el });

    expect(day_controller.get_day().schedule.get_activities()[activity_index].title).not.toBe(new_title);
    
    title_el.value = new_title;
    day_controller._update_activity_title(update_event);
    expect(day_controller.get_day().schedule.get_activities()[activity_index].title).toBe(new_title);
});

test("_update_activity_content", () => {
    const activity_index = 0;
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_content = "new content";
    const content_el = a1.getElementsByClassName(ACTIVITIY_CONTENT_CLASS)[0];
    const event = new Event("");
    Object.defineProperty(event, "target", {value: content_el});

    expect(day_controller.get_day().schedule.get_activities()[activity_index].content).not.toBe(new_content);
    
    content_el.value = new_content;
    day_controller._update_activity_content(event);

    expect(day_controller.get_day().schedule.get_activities()[activity_index].content).toBe(new_content);
});

test("_update_activity_start_time", () => {
    const activity_index = 0;
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_start_time = String(new HoursAndMinutes(a2.start_time.hours - 1, 37));
    const start_time_el = a1.getElementsByClassName(ACTIVITIY_STARTTIME_CLASS)[0];
    const event = new Event("");
    Object.defineProperty(event, "target", {value: start_time_el});

    let current_start_time_str = String(day_controller.get_day().schedule
                                    .get_activities()[activity_index].start_time);

    expect(current_start_time_str).not.toBe(new_start_time);
    
    start_time_el.value = new_start_time;
    day_controller._update_activity_start_time(event);

    current_start_time_str = String(day_controller.get_day().schedule
                                    .get_activities()[activity_index].start_time);
    expect(current_start_time_str).toBe(new_start_time);
});

test("_update_activity_end_time", () => {
    const activity_index = 0;
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_end_time = "21:37";
    const end_time_el = a1.getElementsByClassName(ACTIVITIY_ENDTIME_CLASS)[0];
    const event = new Event("");
    Object.defineProperty(event, "target", {value: end_time_el});

    let current_end_time_str = String(day_controller.get_day().schedule
                                    .get_activities()[activity_index].end_time);

    expect(current_end_time_str).not.toBe(new_end_time);
    
    end_time_el.value = new_end_time;
    day_controller._update_activity_end_time(event);

    current_end_time_str = String(day_controller.get_day().schedule
                                    .get_activities()[activity_index].end_time);
    expect(current_end_time_str).toBe(new_end_time);
});

test("_update_mood_field", () => {
    const spy_fct = jest.spyOn(day_controller, "_update_mood_field");
    const index = 3; //In the default template, the 4th mood_field is a TextField
    const new_input = "this is the new input";
    const mood_field = document.getElementById(MOOD_FIELDS_WRAPPER_ID).querySelector('[index="' + index + '"]');
    const input_field = mood_field.querySelector("." + MOOD_FIELD_INPUT_CLASS);
    expect(day_controller.get_day().mood_fields[index].get_data()).not.toBe(new_input);
    const event = new Event("");
    Object.defineProperty(event, "target", { value: input_field });

    input_field.value = new_input;
    day_controller._update_mood_field(event);

    expect(day_controller.get_day().mood_fields[index].get_data()).toBe(new_input);
});
