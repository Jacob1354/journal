import { Day } from "./day";
import { NumberField } from "./mood_field";
import { Activity, HoursAndMinutes } from "./schedule";

test("Day.constructor", () => {
    let day = new Day();
    expect(day.date.getDay).toBe(new Date().getDay);
    expect(day.date.getMonth).toBe(new Date().getMonth);
    expect(day.mood_fields.length).toBe(4);
    expect(day.schedule.get_activities.length).toBe(0);
    const custom_date = new Date();
    custom_date.setDate(24);
    custom_date.setFullYear(2000)
    day = new Day(custom_date);
    expect(day.date).toEqual(custom_date);
});

test("Day.from", () => {
    const day = new Day();
    const mf_1 = new NumberField("nb_mf1", 0);
    const start_time1 = new HoursAndMinutes(10, 0);
    const end_time1 = new HoursAndMinutes(12, 0);
    const a1 = new Activity(start_time1, end_time1, "A1", "a1");
    day.mood_fields = [mf_1];
    day.schedule.add_activity(a1);

    const copy = Day.from(day);

    expect(copy.date).toBe(day.date);
    expect(copy.mood_fields.length).toBe(1);
    expect(copy.mood_fields[0].get_field_name()).toBe("nb_mf1");
    expect(copy.schedule.get_activities().length).toBe(1);
    expect(copy.schedule.get_activities()[0].title).toBe("A1");
});