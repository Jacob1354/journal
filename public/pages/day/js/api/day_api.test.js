import { jest } from '@jest/globals';
import { Day } from "../../../../../shared/data/day.js";
import { CouldntSaveData, get_day, FETCH_TIMEOUT, InvalidAuth, post_day, ServerErr, post_signout, SIGNOUT_TIMEOUT } from "./day_api";
import { Activity } from "../../../../../shared/data/schedule.js";
import { json } from "express";

const valid_date_path = "/day/1-1-2004";
const valid_date = new Date();
valid_date.setDate(1);
valid_date.setMonth(1);
valid_date.setFullYear(2004);
const fetched_day = new Day(valid_date);
fetched_day.schedule.add_activity(new Activity());

describe("fetch_day", () => {
    test("success", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 200, 
            json: () => Promise.resolve(fetched_day.prepare_json_obj())
        })));
        await expect(get_day(valid_date)).resolves.toEqual(fetched_day);
    });
    
    //  Technically, any valid date would work, the ones used for the errors are simply used
    //  in the mocked functions to create those specific errors
    test("Can't access data when not logged in", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 401
        })));
        await expect(get_day(valid_date)).rejects.toThrow(InvalidAuth);
    });
    
    test("Server internal error", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({
            status: 500
        })));
        await expect(get_day(valid_date)).rejects.toThrow(ServerErr);
    });

    test("TimedOut", () => {
        global.fetch = jest.fn(() => new Promise(resolve => setTimeout(resolve, FETCH_TIMEOUT + 1)));
        jest.useFakeTimers();
        expect(() => get_day(valid_date)).rejects.toThrow(DOMException);
        jest.advanceTimersByTime(FETCH_TIMEOUT);
    })
});

describe("post_day", () => {
    test("Success", async () => {
        global.fetch = jest.fn(() => Promise.resolve({status: 200}));        
        await expect(post_day(fetched_day)).resolves.toEqual({status: 200});
    });
    test("SignInRequired", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({status: 401})));
        await expect(post_day(fetched_day)).rejects.toThrow(InvalidAuth);
    });
    test("CouldntSaveData", async () => {
        global.fetch = jest.fn(() => Promise.resolve(({status: 500})));
        await expect(post_day(fetched_day)).rejects.toThrow(CouldntSaveData);
    });
    test("TimedOut", () => {
        global.fetch = jest.fn(() => new Promise(resolve => setTimeout(resolve, FETCH_TIMEOUT + 1)));
        jest.useFakeTimers();
        expect(() => post_day(fetched_day)).rejects.toThrow(DOMException);
        jest.advanceTimersByTime(FETCH_TIMEOUT);
    });
});