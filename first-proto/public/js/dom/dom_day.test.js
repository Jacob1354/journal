/**
 * @jest-environment jsdom
 */

import { Day } from "../../../shared/data/day.js";
import { Activity, HoursAndMinutes } from "../../../shared/data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, ACTIVITIES_ID, ACTIVITY_CLASS, ACTIVITIY_STARTTIME_CLASS, ACTIVITIY_ENDTIME_CLASS, MOOD_FIELD_INPUT_CLASS } from "./constants.js";
import { DomDay } from "./dom_day.js";

const start_time1 = new HoursAndMinutes(10, 0);
const end_time1 = new HoursAndMinutes(14, 0);
const start_time2 = new HoursAndMinutes(10, 0);
const end_time2 = new HoursAndMinutes(14, 0);

const a1 = new Activity(start_time1, end_time1, "A1", "a1");
const a2 = new Activity(start_time2, end_time2, "A2", "a2");
let day;
let dom_day;
const clean_dom = document.body.innerHTML;

beforeEach(() => {
    document.body.innerHTML = clean_dom;
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

test("_remove_activity", () => {
    const activity_index = 0;
    const update_event = new Event("");
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const remove_btn = a1.getElementsByClassName(ACTIVITIY_REMOVE_BTN_CLASS)[0];
    Object.defineProperty(update_event, "target", {
        value: remove_btn
    });

    dom_day._remove_activity(update_event);
    expect(dom_day._get_day_copy_for_test().schedule.get_activities().length).toBe(1);
    expect(dom_day._get_day_copy_for_test().schedule.get_activities()[activity_index].title).toBe("A2");
});

test("_update_activity_title", () => {
    const activity_index = 0;
    const update_event = new Event("");
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_title = "new title";
    const title = a1.getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0];
    Object.defineProperty(update_event, "target", {
        value: title
    });

    expect(dom_day._get_day_copy_for_test().schedule.get_activities()[activity_index].title).not.toBe(new_title);
    
    title.value = new_title;
    dom_day._update_activity_title(update_event);
    expect(dom_day._get_day_copy_for_test().schedule.get_activities()[activity_index].title).toBe(new_title);
});

test("_update_activity_content", () => {
    const activity_index = 0;
    const update_event = new Event("");
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_content = "new content";
    const content = a1.getElementsByClassName(ACTIVITIY_CONTENT_CLASS)[0];
    Object.defineProperty(update_event, "target", {
        value: content
    });

    expect(dom_day._get_day_copy_for_test().schedule.get_activities()[activity_index].content).not.toBe(new_content);
    
    content.value = new_content;
    dom_day._update_activity_content(update_event);
    expect(dom_day._get_day_copy_for_test().schedule.get_activities()[activity_index].content).toBe(new_content);
});

test("_update_activity_start_time", () => {
    const activity_index = 0;
    const update_event = new Event("");
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
                                                     // Makes sure it still is in position 0
    const new_start_time = String(new HoursAndMinutes(a2.start_time.hours - 1, 37));
    const start_time_el = a1.getElementsByClassName(ACTIVITIY_STARTTIME_CLASS)[0];
    Object.defineProperty(update_event, "target", {
        value: start_time_el
    });

    let current_start_time_str = String(dom_day._get_day_copy_for_test().schedule
                                    .get_activities()[activity_index].start_time);

    expect(current_start_time_str).not.toBe(new_start_time);
    
    start_time_el.value = new_start_time;
    dom_day._update_activity_start_time(update_event);

    current_start_time_str = String(dom_day._get_day_copy_for_test().schedule
                                    .get_activities()[activity_index].start_time);
    expect(current_start_time_str).toBe(new_start_time);
});

test("_update_activity_end_time", () => {
    const activity_index = 0;
    const update_event = new Event("");
    const selector = "." + ACTIVITY_CLASS + '[index="0"]';
    const a1 = document.querySelector(selector);
    const new_end_time = "21:37";
    const end_time_el = a1.getElementsByClassName(ACTIVITIY_ENDTIME_CLASS)[0];
    Object.defineProperty(update_event, "target", {
        value: end_time_el
    });

    let current_end_time_str = String(dom_day._get_day_copy_for_test().schedule
                                    .get_activities()[activity_index].end_time);

    expect(current_end_time_str).not.toBe(new_end_time);
    
    end_time_el.value = new_end_time;
    dom_day._update_activity_end_time(update_event);

    current_end_time_str = String(dom_day._get_day_copy_for_test().schedule
                                    .get_activities()[activity_index].end_time);
    expect(current_end_time_str).toBe(new_end_time);
});

test("_update_mood_field", () => {
    const index = 3; //In the default template, the 4th mood_field is a TextField
    const new_input = "this is the new input";
    const mood_fields_wrapper = document.createElement("div");
    mood_fields_wrapper.id = MOOD_FIELDS_WRAPPER_ID;
    document.body.appendChild(mood_fields_wrapper);
    dom_day.render_mood_fields();
    const mood_field = document.getElementById(MOOD_FIELDS_WRAPPER_ID).querySelector('[index="' + index + '"]');
    const input_field = mood_field.querySelector("." + MOOD_FIELD_INPUT_CLASS);
    expect(dom_day._get_day_copy_for_test().mood_fields[index].get_data()).not.toBe(new_input);
    
    input_field.value = new_input;
    input_field.dispatchEvent(new Event("input", {bubbles: true}));
    expect(dom_day._get_day_copy_for_test().mood_fields[index].get_data()).toBe(new_input);
});
