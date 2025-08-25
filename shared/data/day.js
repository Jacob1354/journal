import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { NumberField, FractionField, TextField } from "./mood_field.js";
import { Schedule } from "./schedule.js";

export class Day {
    constructor(date = new Date()) {
        validate_type(date, Date);
        this.date = new Date(date);
        this.schedule = new Schedule();
        this.mood_fields = [];
        this.mood_fields.push(new NumberField("Hours of sleep"));
        this.mood_fields.push(new FractionField("Energy rating"));
        this.mood_fields.push(new FractionField("Hapiness rating"));
        this.mood_fields.push(new TextField("Comments", "Add any additional info here"));
    }

    static from(other){
        validate_type(other, Day);
        const copy = new Day();
        copy.date = other.date;
        copy.schedule = Schedule.from(other.schedule);
        copy.mood_fields = [...other.mood_fields];
        return copy;
    }
}





