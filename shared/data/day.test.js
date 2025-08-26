import { Day } from "./day";
import { FractionField, NumberField, SliderField, TextField } from "./mood_field";
import { Activity, HoursAndMinutes } from "./schedule";
import { FIELD_TYPE_FRACTION, FIELD_TYPE_NUMBER, FIELD_TYPE_TEXT, FIELD_TYPE_SLIDER } from "../const.js"

const day_for_json = new Day();
const activity_for_json = new Activity(new HoursAndMinutes(10, 20), new HoursAndMinutes(12, 40), "title", "content");
day_for_json.schedule.add_activity(activity_for_json);
const nb_field_for_json = new NumberField("nb_field", 10);
const text_field_for_json = new TextField("text_field", "text");
const fraction_field_for_json = new FractionField("fraction_field", 9, 10);
const slider_field_for_json = new SliderField("slider_field", 10);
day_for_json.mood_fields = [nb_field_for_json, text_field_for_json, fraction_field_for_json, slider_field_for_json];
const day_json_obj = {
    date: day_for_json.date,
    schedule: [
        {
            start_time: {hours: 10, minutes: 20}, 
            end_time: {hours: 12, minutes: 40}, 
            title: "title", 
            content: "content"
        }
    ],
    mood_fields: [
        {type: FIELD_TYPE_NUMBER, title: "nb_field", data: 10},
        {type: FIELD_TYPE_TEXT, title: "text_field", data: "text"},
        {type: FIELD_TYPE_FRACTION, title: "fraction_field", data: 9, denom: 10},
        {type: FIELD_TYPE_SLIDER, title: "slider_field", data: 10},
    ]
};


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

test("Day.prepare_json_obj", () => {
    expect(day_for_json.prepare_json_obj()).toEqual(day_json_obj);
})

test("static Day.from_json_obj", () => {
    expect(Day.from_json_obj(day_json_obj)).toEqual(day_for_json);
});
