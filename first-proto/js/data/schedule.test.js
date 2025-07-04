import { InvalidDataType } from "../clean_code/clean_code_enforcement";
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

    let valid_activity = new Schedule.Activity();
    expect(valid_activity).toBeInstanceOf(Schedule.Activity);
    expect(valid_activity.content).toBeDefined;
    expect(valid_activity.title).toBeDefined;
    expect(valid_activity.start_time).toBeDefined;
    expect(valid_activity.end_time).toBeDefined;

    valid_activity = new Schedule.Activity(valid_start_time, valid_end_time, valid_title, valid_content);
    expect(valid_activity).toBeInstanceOf(Schedule.Activity);
    expect(valid_activity.content).toBeDefined;
    expect(valid_activity.title).toBeDefined;
    expect(valid_activity.start_time).toBeDefined;
    expect(valid_activity.end_time).toBeDefined;

    // @ts-expect-error
    expect(() => new Schedule.Activity(invalid_start_time)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Schedule.Activity(valid_start_time, invalid_end_time)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Schedule.Activity(valid_start_time, valid_end_time, invalid_title)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Schedule.Activity(valid_start_time, valid_end_time, valid_title, invalid_content)).toThrow(InvalidDataType);
});

test("HoursAndMinutes toString", () => {
    const hm = new Schedule.HoursAndMinutes(10, 5);
    expect(hm.toString()).toBe("10:05");
}) 

test("Schedule - Adding an activity", () => {
    let schedule = new Schedule.Schedule();
    const start_time1 = new Schedule.HoursAndMinutes(10, 0);
    const end_time1 = new Schedule.HoursAndMinutes(16, 30);
    const start_time2 = new Schedule.HoursAndMinutes(20, 0);
    const end_time2 = new Schedule.HoursAndMinutes(23, 0);
    
    const a1 = new Schedule.Activity(start_time1, end_time1, "A1", "a1");
    const a2 = new Schedule.Activity(start_time2, end_time2, "A2", "a2");
    
    expect(schedule.get_activities().length).toBe(0);
    
    schedule.add_activity(a1);
    expect(schedule.get_activities().length).toBe(1);
    expect(schedule.get_activities()[0].start_time).toBe(start_time1);
    expect(schedule.get_activities()[0].end_time).toBe(end_time1);
    expect(schedule.get_activities()[0].title).toBe("A1");
    expect(schedule.get_activities()[0].content).toBe("a1");
    
    schedule.add_activity(a2);
    expect(schedule.get_activities().length).toBe(2);
    expect(schedule.get_activities()[1].start_time).toBe(start_time2);
    expect(schedule.get_activities()[1].end_time).toBe(end_time2);
    expect(schedule.get_activities()[1].title).toBe("A2");
    expect(schedule.get_activities()[1].content).toBe("a2");
});