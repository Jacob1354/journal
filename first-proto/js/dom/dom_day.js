import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { Day } from "../data/day.js";
import { Activity } from "../data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_ENDTIME_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_STARTTIME_CLASS, ACTIVITIY_TIMEINTERVAL_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELD_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, ACTIVITIES_ID, ACTIVITY_CLASS, ERR_MSG_UNABLE_TO_DELETE_ACTIVITY } from "./constants.js";
import { error_pop_up, get_parent_attribute, ParentNotFound, replace_children_of, UndefinedAttribute } from "./dom_utils.js";
import { DOMMoodField } from "./mood_field.js";
import { DOMSchedule } from "./schedule.js";

export class DomDay {
    #day;
    #dom_moodfields;
    #dom_schedule;
    constructor(day = new Day()) {
        validate_type(day, Day);
        this.#day = Day.from(day);
        this.#dom_moodfields = new DOMMoodField(day.date, day.mood_fields);
        this.#dom_schedule = new DOMSchedule({
            update_title : (event) => this._update_activity_title(event),
            update_content : (event) => this._update_activity_content(event),
            update_start_time : (event) => this._update_activity_start_time(event),
            update_end_time : (event) => this._update_activity_end_time(event),
            remove_activity : (event) => this._remove_activity(event)
        });
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
        const mood_fields_container = document.getElementById(MOOD_FIELDS_WRAPPER_ID);
        const mood_field_els = this.#dom_moodfields.create_mood_fields();
    
        replace_children_of(mood_fields_container, mood_field_els);
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

    _get_day_copy_for_test() {
        return Day.from(this.#day);
    }
}