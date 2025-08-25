/**
 * @jest-environment jsdom
 */

import { AbstractFunctionNotOverriden } from "../../../shared/clean_code/clean_code_enforcement.js";
import { Activity, HoursAndMinutes, Schedule } from "../../../shared/data/schedule.js"
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_CONTENT_WRAPPER_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_TIMEINTERVAL_CLASS, ACTIVITIY_TITLE_CLASS, ACTIVITIES_ID, ACTIVITY_CLASS } from "./constants.js";
import { DOMSchedule } from "./schedule.js";

let a1, a2, a3, activities, schedule, dom_schedule;

beforeEach(() => {
    a1 = new Activity(
                            new HoursAndMinutes(10, 0), 
                            new HoursAndMinutes(12, 0), 
                            "A1", 
                            "a1");
    a2 = new Activity(
                            new HoursAndMinutes(16, 0), 
                            new HoursAndMinutes(23, 30), 
                            "A2", 
                            "a2");
    a3 = new Activity(
                            new HoursAndMinutes(12, 0), 
                            new HoursAndMinutes(15, 30), 
                            "A2", 
                            "a2");
    activities = [a1, a2, a3];
    schedule = new Schedule(activities);
    dom_schedule = new DOMSchedule(new Date(), schedule);
});

test("create_scheduled_activities", () => {
    const schedule_el = dom_schedule._create_scheduled_activities(activities);

    expect(schedule_el.id).toBe(ACTIVITIES_ID);
    expect(schedule_el.children[0].getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0].innerText).toBe(a1.title);
    expect(schedule_el.children[0].getAttribute("index")).toBe("0");
    expect(schedule_el.children[1].getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0].innerText).toBe(a3.title);
    expect(schedule_el.children[1].getAttribute("index")).toBe("1");
    expect(schedule_el.children[2].getElementsByClassName(ACTIVITIY_TITLE_CLASS)[0].innerText).toBe(a2.title);
    expect(schedule_el.children[2].getAttribute("index")).toBe("2");
});

test("_create_activity", () => {
    const activity = dom_schedule._create_activity(a1, 0);
    expect(activity.classList.contains(ACTIVITY_CLASS)).toBe(true);
    expect(activity.getAttribute("index")).toBe("0");
    expect(activity.children[0].innerText).toBe(a1.title);
    expect(activity.children[1].classList.contains(ACTIVITIY_TIMEINTERVAL_CLASS)).toBe(true);
    expect(activity.children[2].classList.contains(ACTIVITIY_REMOVE_BTN_CLASS)).toBe(true);
    expect(activity.children[3].classList.contains(ACTIVITIY_CONTENT_WRAPPER_CLASS)).toBe(true);

});

test("create_activity_title", () => {
    const title = dom_schedule._create_activity_title(a1);
    
    expect(title.nodeName).toBe("H3");
    expect(title.classList.contains(ACTIVITIY_TITLE_CLASS)).toBe(true);
    expect(title.innerText).toBe(a1.title);
});

test("create_activity_time_interval", () => {
    const interval = dom_schedule._create_activity_time_interval(a1);

    expect(interval.nodeName).toBe("DIV");
    expect(interval.classList.contains(ACTIVITIY_TIMEINTERVAL_CLASS)).toBe(true);
    expect(interval.children[0].nodeName).toBe("INPUT");
    expect(interval.children[1].nodeName).toBe("P");
    expect(interval.children[2].nodeName).toBe("INPUT");

    expect(interval.children[0].type).toBe("time");
    expect(interval.children[2].type).toBe("time");
    
    expect(interval.children[0].value).toBe(String(a1.start_time));
    // @ts-ignore
    expect(interval.children[1].innerText).toBe("to");
    expect(interval.children[2].value).toBe(String(a1.end_time));
});

test("create_activity_remove_btn", () => {
    const btn = dom_schedule._create_activity_remove_btn();

    expect(btn.nodeName).toBe("BUTTON");
    expect(btn.classList.contains(ACTIVITIY_REMOVE_BTN_CLASS)).toBe(true);
    expect(btn.innerHTML).toBe(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>`
    );
});

test("create_activity_content", () => {
    const content = dom_schedule._create_activity_content(a1);

    expect(content.nodeName).toBe("DIV");
    expect(content.classList.contains(ACTIVITIY_CONTENT_WRAPPER_CLASS)).toBe(true);
    
    expect(content.firstChild.nodeName).toBe("INPUT");
    expect(content.firstChild.classList.contains(ACTIVITIY_CONTENT_CLASS)).toBe(true);
    expect(content.firstChild.type).toBe("text");
    expect(content.firstChild.value).toBe(a1.content);
})

