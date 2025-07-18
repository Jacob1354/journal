/**
 * @jest-environment jsdom
 */

import { Day } from "../data/day.js";
import { Activity, HoursAndMinutes } from "../data/schedule.js";
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
    dom_day = new DomDay(day)

    const activities = document.createElement("div");
    const mood_fields = document.createElement("div");
    activities.id = "scheduled_activities";
    mood_fields.id = "mood_fields";
    document.body.appendChild(activities);
    document.body.appendChild(mood_fields);

    dom_day.render_day();

});

test("DomDay.remove_activity", () => {
    let btns = document.querySelectorAll(".activity_remove_btn");
    // @ts-ignore
    btns[0].click();
    
    let activities = document.querySelector("#scheduled_activities");
    expect(activities.children.length).toBe(1);
    // @ts-ignore
    expect(activities.children[0].querySelector(".activity_title").innerText).toBe("A2");
    
    btns = document.querySelectorAll(".activity_remove_btn");
    btns[0].appendChild(document.createElement("div"));
    // @ts-ignore
    btns[0].getElementsByTagName("div")[0].click();
    activities = document.querySelector("#scheduled_activities");
    expect(activities.children.length).toBe(0);
});