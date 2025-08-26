import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { FIELD_TYPE_FRACTION, FIELD_TYPE_NUMBER, FIELD_TYPE_SLIDER, FIELD_TYPE_TEXT } from "../const.js";
import { NumberField, FractionField, TextField, SliderField } from "./mood_field.js";
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

    prepare_json_obj(){
        const parsed_mood_fields = [];
        this.mood_fields.forEach(field => {
            parsed_mood_fields.push(field.prepare_json_obj());
        });
        return {
            date: this.date,
            schedule: this.schedule.prepare_json_obj(),
            mood_fields: parsed_mood_fields
        };
    }

    toJSON() {
        return JSON.stringify(this.prepare_json_obj());
    }

    static from_json_obj(obj) {
        const day = new Day(new Date(obj.date));
        day.schedule = Schedule.from_json_obj(obj.schedule);
        day.mood_fields = [];
        obj.mood_fields.forEach(json_field => {
            let field
            switch(json_field.type) {
                case FIELD_TYPE_FRACTION:
                    field = FractionField.from_json_obj(json_field);
                    break;
                case FIELD_TYPE_NUMBER:
                    field = NumberField.from_json_obj(json_field);
                    break;
                case FIELD_TYPE_TEXT:
                    field = TextField.from_json_obj(json_field);
                    break;
                case FIELD_TYPE_SLIDER:
                    field = SliderField.from_json_obj(json_field);
                    break;
            }
            day.mood_fields.push(field);
        });
        return day;
    }
    static fromJSON(json) {
        return Day.from_json_obj(JSON.parse(json));
    }
}





