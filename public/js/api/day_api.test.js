import { jest } from '@jest/globals';
import { Day } from "../../../shared/data/day.js";
import { fetch_day, FETCH_TIMEOUT, InvalidAuth, post_schedule, ServerErr } from "./day_api";
import { Activity } from "../../../shared/data/schedule.js";
import { json } from "express";

const valid_date_path = "/day/1-1-2004";
const valid_date = new Date();
valid_date.setDate(1);
valid_date.setMonth(1);
valid_date.setFullYear(2004);
const fetched_day = new Day(valid_date);
fetched_day.schedule.add_activity(new Activity());

describe("fetch_day", () => {
    test("fetch_day: success", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 200, 
            json: () => Promise.resolve(fetched_day.prepare_json_obj())
        })));
        await expect(fetch_day(valid_date)).resolves.toEqual(fetched_day);
    });
    
    //  Technically, any valid date would work, the ones used for the errors are simply used
    //  in the mocked functions to create those specific errors
    test("fetch_day: Can't access data when not logged in", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 401
        })));
        await expect(fetch_day(valid_date)).rejects.toThrow(InvalidAuth);
    });
    
    test("fectch_day: Server internal error", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 500
        })));
        await expect(fetch_day(valid_date)).rejects.toThrow(ServerErr);
    });

    test("fetch day: TimedOut", () => {
        global.fetch = jest.fn(() => new Promise(resolve => setTimeout(resolve, FETCH_TIMEOUT + 1)));
        jest.useFakeTimers();
        expect(() => fetch_day(valid_date)).rejects.toThrow(DOMException);
        jest.advanceTimersByTime(FETCH_TIMEOUT);
    })
});

describe("post_mood_fields", () => {

});

describe("post_schedule", () => {

});