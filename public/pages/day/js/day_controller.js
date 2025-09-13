import { validate_type } from "../../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../../shared/data/day.js";
import { Activity } from "../../../../shared/data/schedule.js";
import { get_day, InvalidAuth, post_signout } from "./api/day_api.js";
import { DayAutoSaver } from "./day_autosaver.js";
import { ACTIVITY_CLASS, EVENT_ADD_ACTIVITY, EVENT_MOVE_TO_NEXT_DAY, EVENT_MOVE_TO_PREVIOUS_DAY, EVENT_REMOVE_ACTIVITY, EVENT_SIGNOUT, EVENT_UPDATE_ACTIVITY_CONTENT, EVENT_UPDATE_ACTIVITY_ENDTIME, EVENT_UPDATE_ACTIVITY_STARTTIME, EVENT_UPDATE_ACTIVITY_TITLE, EVENT_UPDATE_MOODFIELD, MOOD_FIELD_CLASS } from "./dom/constants.js";
import { DomDay } from "./dom/dom_day.js";
import { msg_pop_up, get_parent_attribute } from "../../../dom_utils.js";
import { ERROR_CLASS } from "../../../const.js";


export class DayController {
    #dom_day;
    #day;
    #auto_saver;
    constructor() {
        this._init();
    }

    async _init() {
        try {
            this.#day = await get_day();
        } catch(err) {
            msg_pop_up({msg: "Oops... Something went wrong, please try again", el_class: ERROR_CLASS});
        }
        this.#dom_day = new DomDay(() => this.get_day());
        this.#dom_day.render();
        this.#auto_saver = new DayAutoSaver({
            get_day: () => this.get_day(),
            update_timestamp: (new_timestamp) => this.#day.update_timestamp = new_timestamp,
            update_day: async () => await this.update_day(this.#day.date)
        });
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

    
    /**
     * Signs the user out and move back to '/signin'.
     * Saves the day before signing out
     *
     * @async
     */
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
        try {
            await this.load_new_day(new Date(
                this.#day.date.getTime() + 1000 * 60 * 60 * 24 //Adding 24h to move to the next day
            ));
        } catch(err) {
            msg_pop_up({msg: "Oops... Something went wrong, please try again", el_class: ERROR_CLASS});
        };
    }
    
    async move_to_previous_day() {
        try {
            await this.load_new_day(new Date(
                this.#day.date.getTime() - 1000 * 60 * 60 * 24 //Removing 24h to move to the next day
            ));
        } catch(err) {
            msg_pop_up({msg: "Oops... Something went wrong, please try again", el_class: ERROR_CLASS});
        };
    }

    
    /**
     * Saves the day and change to a new one matching new_date
     * 
     * @async
     * @param {Date} new_date 
     */
    async load_new_day(new_date) {
        this.#auto_saver.stop();
        await this.update_day(new_date);
        this.#auto_saver.start();
    }

    
    /**
     * Updates the day to make sure it is up to date with the db
     *
     * @async
     * @param {Date} date 
     */
    async update_day(date) {
        try {
            this.#day = await get_day(date);
        } catch(err) {
            if(err instanceof InvalidAuth) {
                msg_pop_up({
                    msg: "Seems like your session timed out, please log in again", 
                    el_class: ERROR_CLASS,
                    redirection: {msg: "Click here to go to sign in page", url: "/signin"}
                });
            }
            else
                throw err;
        }
        this.#dom_day.render();
    }
    
    _update_activity_title(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_title(index, input_field.value);
        } catch (error) {
            msg_pop_up({msg: error, el_class: ERROR_CLASS});
        }
    }
    
    _update_activity_content(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_content(index, input_field.value);
        } catch (error) {
            msg_pop_up({msg: error, el_class: ERROR_CLASS});
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
            msg_pop_up({msg: error, el_class: ERROR_CLASS});
        }
    }
    
    _update_activity_end_time(event) {
        validate_type(event, Event);
        const input_field = event.target;
        try {
            const index = get_parent_attribute(input_field, "." + ACTIVITY_CLASS, "index");
            this.#day.schedule.update_activity_end_time(index, input_field.value);
        } catch (error) {
            msg_pop_up({msg: error, el_class: ERROR_CLASS});
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
            error_pop_up({msg: "Sorry, we we'rent able to remove this activity", el_class: ERROR_CLASS});
        }
    }

    _update_mood_field(event) {
        const mood_field_el = event.target.closest("." + MOOD_FIELD_CLASS);
        const index = mood_field_el.getAttribute("index");
        const new_val = event.target.value;
        const mood_field = this.#day.mood_fields[index];
        mood_field.set_data(mood_field.parse_input(new_val));
    }
}
