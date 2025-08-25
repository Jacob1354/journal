import { jest } from '@jest/globals';
import { Day } from "../../../shared/data/day.js";
import { fetch_day, InvalidAuth, ServerErr } from "./day_api";
import { Activity } from "../../../shared/data/schedule.js";
import { json } from "express";

const valid_date_path = "/day/1-1-2004";
const valid_date = new Date();
valid_date.setDate(1);
valid_date.setMonth(1);
valid_date.setFullYear(2004);

const invalid_auth_date_path = "/day/1-1-2005";
const invalid_auth_date = new Date();
invalid_auth_date.setDate(1);
invalid_auth_date.setMonth(1);
invalid_auth_date.setFullYear(2005);

const internal_server_error_date_path = "/day/1-1-2006";
const internal_server_error_date = new Date();
internal_server_error_date.setDate(1);
internal_server_error_date.setMonth(1);
internal_server_error_date.setFullYear(2006);

const fetched_day = new Day(valid_date);
fetched_day.schedule.add_activity(new Activity());


/*
 * NOTE: Although the way this mock is implemented leads to thinking an invalid
 *       path could lead to an error of different types from the servers, those
 *       are actually triggered by other factors. It's been done this way to
 *       reach a clearer demonstration. 
 *       
 * Here's what actually triggers those errors:
 *          -> invalid_auth: No valid session cookie was sent with the request
 *          -> internal_server_err: An error happened on the server-side 
*/
global.fetch = jest.fn((path, info = {}) => {
    if(path === valid_date_path)  {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(fetched_day)
        });
    } else if(path === invalid_auth_date_path) {
        return Promise.resolve({
            status: 401
        });
    } else if(path === internal_server_error_date_path) {
        return Promise.resolve({
            status: 500
        });
    }
});

test("fetch_day: success", async () => {
    await expect(fetch_day(valid_date)).resolves.toEqual(fetched_day);
});

//  Technically, any valid date would work, the ones used for the errors are simply used
//  in the mocked functions to create those specific errors
test("fetch_day: Can't access data when not logged in", async () => {
    await expect(fetch_day(invalid_auth_date)).rejects.toThrow(InvalidAuth);
});

test("fectch_day: Server internal error", async () => {
    await expect(fetch_day(internal_server_error_date)).rejects.toThrow(ServerErr);
});