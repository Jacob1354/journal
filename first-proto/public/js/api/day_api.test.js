import { Day } from "first-proto/shared/data/day";
import { fetch_day, InvalidAuth, ServerErr } from "./day_api";
import { Activity } from "first-proto/shared/data/schedule";

const valid_date = new Date();
valid_date.setFullYear(2004);
const invalid_auth_date = new Date();
valid_date.setFullYear(2005);
const internal_server_error_date = new Date();
valid_date.setFullYear(2006);
const fetched_day = new Day(valid_date);
fetched_day.schedule.add_activity(new Activity());

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