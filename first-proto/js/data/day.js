import { load_activity } from "../dom/schedule.js";
import * as MoodField from "./mood_field.js";
import * as Schedule from "./schedule.js";

export class Day {
    constructor() {
        this.date = new Date();
        this.schedule = new Schedule.Schedule();
        this.mood_fields = [];
        this.mood_fields.push(new MoodField.NumberField("Hours of sleep"));
        this.mood_fields.push(new MoodField.FractionField("Energy rating"));
        this.mood_fields.push(new MoodField.FractionField("Hapiness rating"));
        this.mood_fields.push(new MoodField.TextField("Comments", "Add any additional info here"));
    }
}





