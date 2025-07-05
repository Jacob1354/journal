/**
 * @jest-environment jsdom
 */

import { AbstractFunctionNotOverriden } from "../clean_code/clean_code_enforcement.js";
import { Activity, HoursAndMinutes } from "../data/schedule.js"
import { load_activity, _load_activity_content, _load_activity_remove_btn, _load_activity_time_interval, _load_activity_title } from "./schedule.js";

let a1, a2, a3;

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
                            
});

test("load_activity", () => {
    const activity = load_activity(a1);
    expect(activity.classList.contains("scheduled_activity")).toBe(true);
    expect(activity.children[0].innerText).toBe(a1.title);
    expect(activity.children[1].classList.contains("time_interval")).toBe(true);
    expect(activity.children[2].classList.contains("activity_remove_btn")).toBe(true);
    expect(activity.children[3].classList.contains("wrapper")).toBe(true);

});

test("load_activity_title", () => {
    const title = _load_activity_title(a1);
    
    expect(title.nodeName).toBe("H3");
    expect(title.innerText).toBe(a1.title);
});

test("load_activity_time_interval", () => {
    const interval = _load_activity_time_interval(a1);

    expect(interval.nodeName).toBe("DIV");
    expect(interval.classList.contains("time_interval")).toBe(true);
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

test("load_activity_remove_btn", () => {
    const btn = _load_activity_remove_btn();

    expect(btn.nodeName).toBe("BUTTON");
    expect(btn.classList.contains("activity_remove_btn")).toBe(true);
    expect(btn.innerHTML).toBe(
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>`
    );
});

test("load_activity_content", () => {
    const content = _load_activity_content(a1);

    expect(content.nodeName).toBe("DIV");
    expect(content.classList.contains("wrapper")).toBe(true);
    
    expect(content.firstChild.nodeName).toBe("INPUT");
    expect(content.firstChild.classList.contains("activity_content")).toBe(true);
    expect(content.firstChild.type).toBe("text");
    expect(content.firstChild.value).toBe(a1.content);
})
