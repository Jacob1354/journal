import { validate_type } from "./clean_code/clean_code_enforcement.js";
import { Day } from "./data/day.js";
import { render_mood_fields } from "./dom/mood_field.js";
import { render_scheduled_activities } from "./dom/schedule.js";

function render_day(day = new Day()) {
    validate_type(day, Day);
    render_scheduled_activities(day.schedule.get_activities());
    render_mood_fields(day.mood_fields);
}

render_day();