import { Day } from "./day";
import { NumberField } from "./mood_field";
import { Activity, HoursAndMinutes } from "./schedule";

test("Day.constructor", () => {
    const valid_day = new Day();
    expect(valid_day).toBeInstanceOf(Day);
    expect(valid_day.date).toBeDefined();
    expect(valid_day.mood_fields).toBeDefined();
    expect(valid_day.schedule).toBeDefined();
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