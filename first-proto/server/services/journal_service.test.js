import { InvalidDate } from "./journal_service.js";
import { get_date_from_url } from "./journal_service.js";


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
    expect(() => get_date_from_url(no_date_url)).toThrow(InvalidDate);
    expect(() => get_date_from_url(too_many_dates_url)).toThrow(InvalidDate);
});
