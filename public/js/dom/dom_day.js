import { validate_type } from "../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../shared/data/day.js";
import { Activity } from "../../../shared/data/schedule.js";
import { post_day } from "../api/day_api.js";
import { MOOD_FIELD_CLASS, ACTIVITY_CLASS, ACTIVITY_ADDER_BTN_ID } from "./constants.js";
import { error_pop_up, get_parent_attribute } from "./dom_utils.js";
import { DOMMoodField } from "./mood_field.js";
import { DOMSchedule } from "./schedule.js";

export class DomDay {
    #day;
    #dom_moodfields;
    #dom_schedule;
    #SAVE_INTERVAL = 30000;
    #timer_id;
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
        this.start();
        this._init_listeners();
    }


    _init_listeners() {
        document.onvisibilitychange = () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        };
        document.getElementById(ACTIVITY_ADDER_BTN_ID).addEventListener("click", () => this.add_activity());
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

    
    stop() {
        clearInterval(this.#timer_id);
        navigator.sendBeacon(
            "/day/" + this.#day.date.getDate() + "-" + this.#day.date.getMonth() + "-" + this.#day.date.getFullYear(),
            new Blob([JSON.stringify(this.#day.prepare_json_obj())], {type: "application/json"})
        );
    }

    start() {
        this.#timer_id = setInterval(() => {this._save();},  this.#SAVE_INTERVAL);
    }
    
    //TODO properly handle the response/error
    async _save() {
        post_day(this.#day)
            .then((res) => {
                console.log("status :" + res.status);
            })
            .catch((err) => {
                console.log("Couldn't save day : " + err);
            })
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
    

    _get_day_copy_for_test() {
        return Day.from(this.#day);
    }

}