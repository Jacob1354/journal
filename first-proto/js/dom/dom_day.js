import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { Day } from "../data/day.js";
import { Activity } from "../data/schedule.js";
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
        const scheduled_activities = document.querySelector("#scheduled_activities");
        scheduled_activities.replaceWith(activities);
    }

    render_mood_fields() {
        const mood_fields_container = document.querySelector("#mood_fields");
        const mood_field_els = create_mood_fields(this.#day.mood_fields);
    
        replace_children_of(mood_fields_container, mood_field_els);
    }
}