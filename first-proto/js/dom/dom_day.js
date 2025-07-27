import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { Day } from "../data/day.js";
import { Activity } from "../data/schedule.js";
import { ACTIVITIY_REMOVE_BTN_CLASS, MOOD_FIELD_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, SCHEDULED_ACTIVITIES_ID, SCHEDULED_ACTIVITY_CLASS } from "./constants.js";
import { replace_children_of } from "./dom_utils.js";
import { create_mood_fields } from "./mood_field.js";
import { create_scheduled_activities } from "./schedule.js";

export class DomDay {
    #day;
    constructor(day = new Day()) {
        validate_type(day, Day);
        this.#day = Day.from(day);
    }

    render_day() {
        this.render_schedule();
        this.render_mood_fields();
    }

    add_activity() {
        this.#day.schedule.add_activity(new Activity());
        this.render_schedule();
    }

    render_schedule() {
        const activities = create_scheduled_activities(this.#day.schedule.get_activities());
        const scheduled_activities = document.getElementById(SCHEDULED_ACTIVITIES_ID);
        scheduled_activities.replaceWith(activities);
        activities.addEventListener("click", (event) => this.remove_activity(event.target));
        activities.addEventListener("input", (event) => this.update_from_input(event));
    }

    render_mood_fields() {
        const mood_fields_container = document.getElementById(MOOD_FIELDS_WRAPPER_ID);
        const mood_field_els = create_mood_fields(this.#day.mood_fields);
    
        replace_children_of(mood_fields_container, mood_field_els);
        mood_fields_container.addEventListener("input", (event) => this.update_from_input(event));
    }

    remove_activity(target) {
        const btn = target.closest("button");
        if(btn != undefined && btn.classList.contains(ACTIVITIY_REMOVE_BTN_CLASS)) {
            const activity_index = target.parentElement.getAttribute("index");
            this.#day.schedule.remove_activity(Number(activity_index));
            this.render_schedule();
        }
    }

    update_from_input(event) {
        if(event.currentTarget.classList.contains(MOOD_FIELDS_WRAPPER_CLASS))
            this._update_from_mood_field_input(event.target);
        else if(event.currentTarget.id == SCHEDULED_ACTIVITIES_ID)
            this._update_from_schedule_input(event.target);
    }

    _update_from_schedule_input(input) {
        
    }

    _update_from_mood_field_input(input) {
        const mood_field = input.closest("[index]");
        if(mood_field != undefined) {
            const index = Number(mood_field.getAttribute("index"));
            this.#day.mood_fields[index].update_from_input(input.value);
        }
    }

    _get_day_copy_for_test() {
        return Day.from(this.#day);
    }
}