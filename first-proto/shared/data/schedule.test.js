import { Activity, HoursAndMinutes, InvalidTimeFormat, Schedule } from "./schedule.js";
import { ArrayContaintsInvalidDataType, InvalidDataType } from "../clean_code/clean_code_enforcement.js"

const start_time1 = new HoursAndMinutes(15, 0);
const end_time1 = new HoursAndMinutes(16, 30);
const start_time2 = new HoursAndMinutes(20, 0);
const end_time2 = new HoursAndMinutes(23, 0);
const start_time3 = new HoursAndMinutes(11, 0);
const end_time3 = new HoursAndMinutes(17, 0);

let a1 = new Activity(start_time1, end_time1, "A1", "a1");
let a2 = new Activity(start_time2, end_time2, "A2", "a2");
let a3 = new Activity(start_time3, end_time3, "A3", "a3");
let activities_arr_of_3_ordered = [a3, a1, a2];
let activities_arr_of_3_unordered = [a1, a2, a3];

beforeEach(() => {
    a1 = new Activity(start_time1, end_time1, "A1", "a1");
    a2 = new Activity(start_time2, end_time2, "A2", "a2");
    a3 = new Activity(start_time3, end_time3, "A3", "a3");
    activities_arr_of_3_ordered = [a3, a1, a2];
    activities_arr_of_3_unordered = [a1, a2, a3];
});


test("Schedule construction", () => {
    const result_arr = activities_arr_of_3_ordered;
    const invalid_array = [new Activity(), "test", 1, 4, new Activity()];
    const valid_schedule = new Schedule(activities_arr_of_3_unordered);

    expect(new Schedule()).toBeInstanceOf(Schedule);
    expect(valid_schedule).toBeInstanceOf(Schedule);
    expect(() => new Schedule(invalid_array)).toThrow(ArrayContaintsInvalidDataType);
    expect(valid_schedule.get_activities()[0].equal_to(result_arr[0])).toBeTruthy();
    expect(valid_schedule.get_activities()[1].equal_to(result_arr[1])).toBeTruthy();
    expect(valid_schedule.get_activities()[2].equal_to(result_arr[2])).toBeTruthy();
});

test("Schedule - Adding an activity", () => {
    let schedule = new Schedule();
    
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

    schedule.add_activity(a3);
    expect(schedule.get_activities().length).toBe(3);
    expect(schedule.get_activities()[0].start_time).toBe(start_time3);
    expect(schedule.get_activities()[0].end_time).toBe(end_time3);
    expect(schedule.get_activities()[0].title).toBe("A3");
    expect(schedule.get_activities()[0].content).toBe("a3");
});

test("Schedule.add_activities", () => {
    const activities1 = [a1, a2]; 
    const activities2 = [a3]; 
    const schedule = new Schedule(); 
    
    schedule.add_activities(activities1);
    expect(schedule.get_activities().length).toBe(2);
    expect(schedule.get_activities()[0].start_time).toBe(start_time1);
    expect(schedule.get_activities()[0].end_time).toBe(end_time1);
    expect(schedule.get_activities()[0].title).toBe("A1");
    expect(schedule.get_activities()[0].content).toBe("a1");
    
    expect(schedule.get_activities()[1].start_time).toBe(start_time2);
    expect(schedule.get_activities()[1].end_time).toBe(end_time2);
    expect(schedule.get_activities()[1].title).toBe("A2");
    expect(schedule.get_activities()[1].content).toBe("a2");

    schedule.add_activities(activities2);
    expect(schedule.get_activities().length).toBe(3);
    expect(schedule.get_activities()[0].start_time).toBe(start_time3);
    expect(schedule.get_activities()[0].end_time).toBe(end_time3);
    expect(schedule.get_activities()[0].title).toBe("A3");
    expect(schedule.get_activities()[0].content).toBe("a3");
});

test("Schedule.update_activity_title", () => {
    const new_title = "this is a new title";
    const schedule = new Schedule(activities_arr_of_3_ordered); //[a3, a1, a2]

    schedule.update_activity_title(1, new_title);
    expect(schedule.get_activities()[1].title).toBe(new_title);
    
});
test("Schedule.update_activity_content", () => {
    const new_content = "this is the new content";
    const schedule = new Schedule(activities_arr_of_3_ordered); //[a3, a1, a2]
    
    schedule.update_activity_content(1, new_content);
    expect(schedule.get_activities()[1].content).toBe(new_content);
});
test("Schedule.update_activity_start_time", () => {
    const schedule = new Schedule(activities_arr_of_3_ordered); //[a3, a1, a2]
    const new_start_time = new HoursAndMinutes(23, 59);
    a3.start_time = new_start_time;
    schedule.update_activity_start_time(0, String(new_start_time));

    expect(schedule.get_activities()[2]).toMatchObject(a3);
    expect(schedule.get_activities()[2].start_time).toMatchObject(new_start_time);
    
});
test("Schedule.update_activity_end_time", () => {
    const schedule = new Schedule([a1]);
    const new_end_time = new HoursAndMinutes(20, 10);

    schedule.update_activity_end_time(0, String(new_end_time));
    expect(schedule.get_activities()[0].end_time).toMatchObject(new_end_time);
    
});

test("Schedule.remove_activity(index)", () => {
    const og_arr = activities_arr_of_3_ordered;
    const schedule = new Schedule(og_arr);

    schedule.remove_activity(1);
    expect(schedule.get_activities().length).toBe(og_arr.length-1);
    expect(schedule.get_activities()[0].title).toBe(og_arr[0].title);
    expect(schedule.get_activities()[1].title).toBe(og_arr[2].title);
});

test("Schedule._sort_activities()", () => {
    const activities = [a1, a3, a2, a1, a3];
    const sorted_activities = [a3, a3, a1, a1, a2];
    const schedule = new Schedule(activities);

    expect(schedule.get_activities()[0].equal_to(sorted_activities[0])).toBeTruthy();
    expect(schedule.get_activities()[1].equal_to(sorted_activities[1])).toBeTruthy();
    expect(schedule.get_activities()[2].equal_to(sorted_activities[2])).toBeTruthy();
    expect(schedule.get_activities()[3].equal_to(sorted_activities[3])).toBeTruthy();
    expect(schedule.get_activities()[4].equal_to(sorted_activities[4])).toBeTruthy();
    
    schedule._sort_activities();

    expect(schedule.get_activities()[0].equal_to(sorted_activities[0])).toBeTruthy();
    expect(schedule.get_activities()[1].equal_to(sorted_activities[1])).toBeTruthy();
    expect(schedule.get_activities()[2].equal_to(sorted_activities[2])).toBeTruthy();
    expect(schedule.get_activities()[3].equal_to(sorted_activities[3])).toBeTruthy();
    expect(schedule.get_activities()[4].equal_to(sorted_activities[4])).toBeTruthy();
}); 

test("Activity construction", () => {
    const valid_start_time = new HoursAndMinutes(10, 10);
    const valid_end_time = new HoursAndMinutes(20, 25);
    const valid_title = "title";
    const valid_content = "content";

    const invalid_start_time = 10;
    const invalid_end_time = "2005-15-23 10:25";
    const invalid_title = 10;
    const invalid_content = new String();

    let valid_activity = new Activity();
    expect(valid_activity).toBeInstanceOf(Activity);
    expect(valid_activity.content).toBeDefined;
    expect(valid_activity.title).toBeDefined;
    expect(valid_activity.start_time).toBeDefined;
    expect(valid_activity.end_time).toBeDefined;

    valid_activity = new Activity(valid_start_time, valid_end_time, valid_title, valid_content);
    expect(valid_activity).toBeInstanceOf(Activity);
    expect(valid_activity.content).toBeDefined;
    expect(valid_activity.title).toBeDefined;
    expect(valid_activity.start_time).toBeDefined;
    expect(valid_activity.end_time).toBeDefined;

    // @ts-expect-error
    expect(() => new Activity(invalid_start_time)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Activity(valid_start_time, invalid_end_time)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Activity(valid_start_time, valid_end_time, invalid_title)).toThrow(InvalidDataType);
    // @ts-expect-error
    expect(() => new Activity(valid_start_time, valid_end_time, valid_title, invalid_content)).toThrow(InvalidDataType);
});


test("HoursAndMinutes.from_string", () => {
    const valid_time_strings = ["00:00", "19:00", "23:59"];
    const invalid_time_strings = ["a", "5:1", "04:1", "4:19", "30:10", "24:00", "20:60"];

    valid_time_strings.forEach(element => {
        expect(HoursAndMinutes.from_string(element)).toBeDefined();
    });
    
    invalid_time_strings.forEach(element => {
        expect(() => HoursAndMinutes.from_string(element)).toThrow(InvalidTimeFormat);
    });
});

test("HoursAndMinutes toString", () => {
    const hm = new HoursAndMinutes(10, 5);
    expect(hm.toString()).toBe("10:05");
}) 

test("HoursAndMinutes bigger_than", () => {
    const h_smaller = new HoursAndMinutes(10, 0);
    const h_bigger = new HoursAndMinutes(23, 0);
    const h_bigger_bigger = new HoursAndMinutes(23, 30);
    expect(h_bigger.bigger_than(h_smaller)).toBe(true);
    expect(h_smaller.bigger_than(h_bigger)).toBe(false);
    expect(h_smaller.bigger_than(h_smaller)).toBe(false);
    
    expect(h_bigger_bigger.bigger_than(h_bigger)).toBe(true);
    expect(h_bigger.bigger_than(h_bigger_bigger)).toBe(false);
});

test("HoursAndMinutes equal_to", () => {
    const start_time1_copy = new HoursAndMinutes(start_time1.hours, start_time1.minutes);

    expect(start_time1.equal_to(start_time1)).toBe(true);
    expect(start_time1.equal_to(start_time1_copy)).toBe(true);
    expect(start_time1.equal_to(start_time2)).toBe(false);
});
