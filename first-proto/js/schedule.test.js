import { InvalidDataType } from "./clean_code_enforcement";
import * as Schedule from "./schedule"

test("Schedule construction", () => {
    const valid_array = [new Schedule.Activity(), new Schedule.Activity()];
    const invalid_array = [new Schedule.Activity(), "test", 1, 4, new Schedule.Activity()];

    expect(new Schedule.Schedule()).toBeInstanceOf(Schedule.Schedule);
    expect(new Schedule.Schedule(valid_array)).toBeInstanceOf(Schedule.Schedule);
    expect(() => new Schedule.Schedule(invalid_array)).toThrow(InvalidDataType);
});

test("Activity construction", () => {
    const valid_start_time = new Schedule.HoursAndMinutes(10, 10);
    const valid_end_time = new Schedule.HoursAndMinutes(20, 25);
    const valid_title = "title";
    const valid_content = "content";

    const invalid_start_time = 10;
    const invalid_end_time = "2005-15-23 10:25";
    const invalid_title = 10;
    const invalid_content = new String();


    expect(new Schedule.Activity()).toBeInstanceOf(Schedule.Activity);
    expect(new Schedule.Activity(valid_start_time, valid_end_time, valid_title, valid_content)).toBeInstanceOf(Schedule.Activity);

    expect(() => new Schedule.Activity(invalid_start_time)).toThrow(InvalidDataType);
    expect(() => new Schedule.Activity(valid_start_time, invalid_end_time)).toThrow(InvalidDataType);
    expect(() => new Schedule.Activity(valid_start_time, valid_end_time, invalid_title)).toThrow(InvalidDataType);
    expect(() => new Schedule.Activity(valid_start_time, valid_end_time, valid_title, invalid_content)).toThrow(InvalidDataType);
});