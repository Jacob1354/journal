import { validate_type } from "../clean_code/clean_code_enforcement.js";
import { Day } from "../data/day.js";
import { Activity } from "../data/schedule.js";
import { render_mood_fields } from "./mood_field.js";
import { create_scheduled_activities } from "./schedule.js";

export class DomDay {
    #day;
    constructor(day = new Day()) {
        validate_type(day, Day);
        this.#day = Day.from(day);
    }

    render_day() {
        this.render_schedule();
        render_mood_fields(this.#day.mood_fields);
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
}