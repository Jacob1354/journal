/**
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";
import { Day } from "../../../../../shared/data/day";
import { ACTIVITIES_ID, ACTIVITY_ADDER_BTN_ID, DAY_NAV_DATE_ID, DAY_NAV_LEFT_ARROW_ID, DAY_NAV_RIGHT_ARROW_ID, EVENT_ADD_ACTIVITY, EVENT_MOVE_TO_NEXT_DAY, EVENT_MOVE_TO_PREVIOUS_DAY, EVENT_SIGNOUT, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, SIGNOUT_ID } from "./constants";
import { DomDay } from "./dom_day";

const dispatch_spy = jest.spyOn(EventTarget.prototype, "dispatchEvent");

const date = new Date();
date.setDate(8);
date.setMonth(8);
date.setFullYear(2025);
const date_str = "Monday, 8 September 2025"
const day = new Day(date);
const get_day = () => Day.from(day);

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
document.body.appendChild(right_arrow_btn); //Not relevant wether it's actually at the right place or not up to here
const dom_day = new DomDay(get_day);

beforeAll(() => {
    dom_day.render();
})

beforeEach(() => {
    dispatch_spy.mockClear();
})

describe("DomDay", () => {
    test("activity adder button triggers add_activity event", () => {
        activity_adder_btn.dispatchEvent(new Event("click", {bubbles:true}));
        expect(dispatch_spy.mock.calls[1][0].type).toBe(EVENT_ADD_ACTIVITY);
    });
    test("left arrow button triggers move_to_previous_day event", () => {
        left_arrow_btn.dispatchEvent(new Event("click", {bubbles:true}));
        expect(dispatch_spy.mock.calls[1][0].type).toBe(EVENT_MOVE_TO_PREVIOUS_DAY);
    });
    test("right arrow button triggers move_to_next_day event", () => {
        right_arrow_btn.dispatchEvent(new Event("click", {bubbles:true}));
        expect(dispatch_spy.mock.calls[1][0].type).toBe(EVENT_MOVE_TO_NEXT_DAY);
    });
    test("signout button triggers signout event", () => {
        signout_btn.dispatchEvent(new Event("click", {bubbles:true}));
        expect(dispatch_spy.mock.calls[1][0].type).toBe(EVENT_SIGNOUT);
    });
    test("date title of the nav is the right one", () => {
        expect(document.getElementById(DAY_NAV_DATE_ID).innerText).toBe(date_str);
    })
});

    