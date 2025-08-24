import { Day } from "first-proto/shared/data/day";
import { fetch_day, get_date_from_url, InvalidAuth, InvalidDateURL, ServerErr } from "./day_api";
import { Activity } from "first-proto/shared/data/schedule";

const valid_date = new Date();
valid_date.setFullYear(2004);
const invalid_auth_date = new Date();
valid_date.setFullYear(2005);
const internal_server_error_date = new Date();
valid_date.setFullYear(2006);
const fetched_day = new Day(valid_date);
fetched_day.schedule.add_activity(new Activity());

test("get_date_from_url: success", () => {
    const valid_url = "http://127.0.0.1:3000/day/23-8-2025";
    const date = get_date_from_url(valid_url);
    expect(date.getDate()).toBe(23);
    expect(date.getMonth()).toBe(8 - 1); //Jan = 0, but I use the actual months
    expect(date.getFullYear()).toBe(2025);
});

test("get_date_from_url: InvalidDateURL", () => {
    const no_date_url = "http://domain/no_date_url";
    const too_many_dates_url = "http://domain/4-14-100/23-5-123";
    expect(() => get_date_from_url(no_date_url)).toThrow(InvalidDateURL);
    expect(() => get_date_from_url(too_many_dates_url)).toThrow(InvalidDateURL);
});


test("fetch_day: success", async () => {
    await expect(fetch_day(valid_date)).resolves.toEqual(fetched_day);
});

//  Technically, any valid date would work, the ones used for the errors are simply used
//  in the mocked functions to create those specific errors
test("fetch day: Can't access data when not logged in", async () => {
    await expect(fetch_day(invalid_auth_date)).rejects.toThrow(InvalidAuth);
});

test("fectch day: Server internal error", async () => {
    await expect(fetch_day(internal_server_error_date)).rejects.toThrow(ServerErr);
});