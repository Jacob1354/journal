import { validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../../../shared/data/day.js";
import { Activity } from "../../../../../shared/data/schedule.js";
import { post_day } from "../api/day_api.js";
import { DayAutoSaver } from "../day_autosaver.js";
import { MOOD_FIELD_CLASS, ACTIVITY_CLASS, ACTIVITY_ADDER_BTN_ID, DAY_NAV_DATE_ID, DAY_NAMES, MONTH_NAMES } from "./constants.js";
import { error_pop_up, get_parent_attribute } from "./dom_utils.js";
import { DOMMoodField } from "./mood_field.js";
import { DOMSchedule } from "./schedule.js";

export class DomDay {
    #day;
    #dom_moodfields;
    #dom_schedule;
    #auto_saver;
    constructor(day = new Day()) {
        validate_type(day, Day);
        this.#day = Day.from(day);
        this.#dom_moodfields = new DOMMoodField( { 
            update : (event) => this._update_mood_field(event) 
        } );
        this.#dom_schedule = new DOMSchedule({
            update_title : (event) => this._update_activity_title(event),
            update_content : (event) => this._update_activity_content(event),
            update_start_time : (event) => this._update_activity_start_time(event),
            update_end_time : (event) => this._update_activity_end_time(event),
            remove_activity : (event) => this._remove_activity(event)
        });
        this.#auto_saver = new DayAutoSaver(() => this._get_day());
        document.getElementById(ACTIVITY_ADDER_BTN_ID).addEventListener("click", () => this.add_activity());
        this._render_date();
    }

    _render_date() {
        const date = this.#day.date;
        document.getElementById(DAY_NAV_DATE_ID).innerText = 
            DAY_NAMES[date.getDay()] + ", " 
            + date.getDate() + " " 
            + MONTH_NAMES[date.getMonth()] + " " 
            + date.getFullYear();

        document.title = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); 
    }

    render_day() {
        this.render_schedule();
        this.render_mood_fields();
    }

    render_schedule() {
        this.#dom_schedule.render(this.#day.schedule.get_activities());
    }

    add_activity() {
        this.#day.schedule.add_activity(new Activity());
        this.render_schedule();
    }

    render_mood_fields() {
        this.#dom_moodfields.render(this.#day.mood_fields);
    }

    get_date() {
        return new Date(this.#day.date);
    }

    async close() {
        this.#auto_saver.close();
    }

    
    _update_activity_title(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_title(index, input_field.value);
        } catch (error) {
            error_pop_up(error);
        }
    }
    
    _update_activity_content(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_content(index, input_field.value);
        } catch (error) {
            error_pop_up(error);
        }
    }
    
    _update_activity_start_time(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_start_time(index, input_field.value);
            this.#dom_schedule.render(this.#day.schedule.get_activities());
        } catch (error) {
            error_pop_up(error);
        }
    }
    
    _update_activity_end_time(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_end_time(index, input_field.value);
        } catch (error) {
            error_pop_up(error);
        }
    }
    
    _remove_activity(event) {
        validate_type(event, Event);
        const btn = event.target;
        try {
            const index = get_parent_attribute(btn, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.remove_activity(index);
            this.#dom_schedule.render(this.#day.schedule.get_activities());
        } catch (error) {
            error_pop_up("Sorry, we we'rent able to remove this activity");
        }
    }

    _update_mood_field(event) {
        const mood_field_el = event.target.closest("." + MOOD_FIELD_CLASS);
        const index = mood_field_el.getAttribute("index");
        const new_val = event.target.value;
        const mood_field = this.#day.mood_fields[index];
        mood_field.set_data(mood_field.parse_input(new_val));
    }
    

    _get_day() {
        return Day.from(this.#day);
    }

}