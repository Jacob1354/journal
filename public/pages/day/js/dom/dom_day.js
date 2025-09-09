import { validate_array_type, validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../../../shared/data/day.js";
import { AbstractMoodField } from "../../../../../shared/data/mood_field.js";
import { Activity } from "../../../../../shared/data/schedule.js";
import { ACTIVITY_ADDER_BTN_ID, DAY_NAV_DATE_ID, DAY_NAMES, MONTH_NAMES, EVENT_ADD_ACTIVITY, EVENT_SIGNOUT, EVENT_MOVE_TO_PREVIOUS_DAY, EVENT_MOVE_TO_NEXT_DAY, SIGNOUT_ID, DAY_NAV_LEFT_ARROW_ID, DAY_NAV_RIGHT_ARROW_ID } from "./constants.js";
import { DOMMoodField } from "./mood_field.js";
import { DOMSchedule } from "./schedule.js";

export class DomDay extends EventTarget {
    #get_day;
    #dom_moodfields;
    #dom_schedule;
    constructor(get_day) {
        super();
        validate_type(get_day, 'function');
        validate_type(get_day(), Day);
        this.#get_day = get_day;
        this.#dom_moodfields = new DOMMoodField();
        this.#dom_schedule = new DOMSchedule();
        this._init();
    }

    render() {
        const day = this.#get_day();
        this._render_date(day.date);
        this.render_schedule(day.schedule.get_activities());
        this.render_mood_fields(day.mood_fields);
    }

    render_schedule(activities) {
        validate_array_type(activities, Activity);
        this.#dom_schedule.render(activities);
    }

    render_mood_fields(mood_fields) {
        validate_array_type(mood_fields, AbstractMoodField);
        this.#dom_moodfields.render(mood_fields);
    }

    _init() {
        document.getElementById(ACTIVITY_ADDER_BTN_ID).addEventListener("click", 
            () => this.dispatchEvent(new Event(EVENT_ADD_ACTIVITY, {bubbles: true}))
        );
        document.getElementById(SIGNOUT_ID).addEventListener("click", 
            () => this.dispatchEvent(new Event(EVENT_SIGNOUT, {bubbles: true}))
        );
        document.getElementById(DAY_NAV_LEFT_ARROW_ID).addEventListener("click", 
            () => this.dispatchEvent(new Event(EVENT_MOVE_TO_PREVIOUS_DAY, {bubbles: true}))
        );
        document.getElementById(DAY_NAV_RIGHT_ARROW_ID).addEventListener("click", 
            () => this.dispatchEvent(new Event(EVENT_MOVE_TO_NEXT_DAY, {bubbles: true}))
        );
    }


    _render_date(date) {
        validate_type(date, Date);
        document.getElementById(DAY_NAV_DATE_ID).innerText = 
            DAY_NAMES[date.getDay()] + ", " 
            + date.getDate() + " " 
            + MONTH_NAMES[date.getMonth()] + " " 
            + date.getFullYear();

        document.title = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); 
    }


}