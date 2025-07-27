import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { Day } from "../data/day.js";
import { Activity } from "../data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_ENDTIME_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_STARTTIME_CLASS, ACTIVITIY_TIMEINTERVAL_CLASS, ACTIVITIY_TITLE_CLASS, MOOD_FIELD_CLASS, MOOD_FIELDS_WRAPPER_CLASS, MOOD_FIELDS_WRAPPER_ID, SCHEDULED_ACTIVITIES_ID, SCHEDULED_ACTIVITY_CLASS } from "./constants.js";
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
        activities.addEventListener("input", (event) => this._update_from_input(event));
    }

    render_mood_fields() {
        const mood_fields_container = document.getElementById(MOOD_FIELDS_WRAPPER_ID);
        const mood_field_els = create_mood_fields(this.#day.mood_fields);
    
        replace_children_of(mood_fields_container, mood_field_els);
        mood_fields_container.addEventListener("input", (event) => this._update_from_input(event));
    }

    remove_activity(target) {
        const btn = target.closest("button");
        if(btn != undefined && btn.classList.contains(ACTIVITIY_REMOVE_BTN_CLASS)) {
            const activity_index = target.parentElement.getAttribute("index");
            this.#day.schedule.remove_activity(Number(activity_index));
            this.render_schedule();
        }
    }

    _update_from_input(event) {
        if(event.currentTarget.classList.contains(MOOD_FIELDS_WRAPPER_CLASS))
            this._update_from_mood_field_input(event.target);
        else if(event.currentTarget.id == SCHEDULED_ACTIVITIES_ID)
            this._update_from_schedule_input(event.target);
    }

    _update_from_schedule_input(input) {
        const activity_field = input.closest("[index]");
        if(activity_field != undefined) {
            const index = Number(activity_field.getAttribute("index"));
            if(input.classList.contains(ACTIVITIY_TITLE_CLASS))
                this.#day.schedule.update_activity_title(index, input.value);
            else if(input.classList.contains(ACTIVITIY_CONTENT_CLASS))
                this.#day.schedule.update_activity_content(index, input.value);
            else {
                if(input.classList.contains(ACTIVITIY_STARTTIME_CLASS))
                    this.#day.schedule.update_activity_start_time(index, input.value);
                else if(input.classList.contains(ACTIVITIY_ENDTIME_CLASS))  
                    this.#day.schedule.update_activity_end_time(index, input.value);
                this.render_schedule(); //Changing time might change the order
            }
        }
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