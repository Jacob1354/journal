import { validate_type } from "../../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../../shared/data/day.js";
import { Activity } from "../../../../shared/data/schedule.js";
import { get_day, post_signout } from "./api/day_api.js";
import { DayAutoSaver } from "./day_autosaver.js";
import { ACTIVITY_CLASS, EVENT_ADD_ACTIVITY, EVENT_MOVE_TO_NEXT_DAY, EVENT_MOVE_TO_PREVIOUS_DAY, EVENT_REMOVE_ACTIVITY, EVENT_SIGNOUT, EVENT_UPDATE_ACTIVITY_CONTENT, EVENT_UPDATE_ACTIVITY_ENDTIME, EVENT_UPDATE_ACTIVITY_STARTTIME, EVENT_UPDATE_ACTIVITY_TITLE, EVENT_UPDATE_MOODFIELD, MOOD_FIELD_CLASS } from "./dom/constants.js";
import { DomDay } from "./dom/dom_day.js";
import { error_pop_up, get_parent_attribute } from "./dom/dom_utils.js";


export class DayController {
    #dom_day;
    #day;
    #auto_saver;
    constructor() {
        this._init();
    }

    async _init() {
        this.#day = await get_day();
        this.#dom_day = new DomDay(() => this.get_day());
        this.#dom_day.render();
        this.#auto_saver = new DayAutoSaver(() => this.get_day());
        document.addEventListener(EVENT_UPDATE_MOODFIELD, (e) => this._update_mood_field(e));
        document.addEventListener(EVENT_ADD_ACTIVITY, (e) => this._add_activity(e));
        document.addEventListener(EVENT_UPDATE_ACTIVITY_TITLE, (e) => this._update_activity_title(e));
        document.addEventListener(EVENT_UPDATE_ACTIVITY_CONTENT, (e) => this._update_activity_content(e));
        document.addEventListener(EVENT_UPDATE_ACTIVITY_STARTTIME, (e) => this._update_activity_start_time(e));
        document.addEventListener(EVENT_UPDATE_ACTIVITY_ENDTIME, (e) => this._update_activity_end_time(e));
        document.addEventListener(EVENT_REMOVE_ACTIVITY, (e) => this._remove_activity(e));
        document.addEventListener(EVENT_MOVE_TO_NEXT_DAY, () => this.move_to_next_day());
        document.addEventListener(EVENT_MOVE_TO_PREVIOUS_DAY, () => this.move_to_previous_day());
        document.addEventListener(EVENT_SIGNOUT, () => this.signout());
    }

    async signout() {
        //TODO avoid depending on close() working
        try {
            await this.#auto_saver.close();
        } catch(err) {
            console.log(err);
        } try {
            post_signout();
        } catch(err) {
            console.log(err);
        }
        window.location.href = "/signin";
    }

    get_day() {
        return Day.from(this.#day);
    }

    _add_activity() {
        this.#day.schedule.add_activity(new Activity());
        this.#dom_day.render_schedule();
    }

    async move_to_next_day() {
        await this.load_new_day(new Date(
            this.#day.date.getTime() + 1000 * 60 * 60 * 24 //Adding 24h to move to the next day
        ));
    }
    
    async move_to_previous_day() {
        await this.load_new_day(new Date(
            this.#day.date.getTime() - 1000 * 60 * 60 * 24 //Removing 24h to move to the next day
        ));
    }

    async load_new_day(new_date) {
        this.#day = await get_day(new_date);
        this.#dom_day.render();
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
            this.#dom_day.render_schedule(this.#day.schedule.get_activities());
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
            this.#dom_day.render_schedule(this.#day.schedule.get_activities());
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
        console.log("Mood field updated");
    }
}
