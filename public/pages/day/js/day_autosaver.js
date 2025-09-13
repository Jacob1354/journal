import { validate_type } from "../../../../shared/clean_code/clean_code_enforcement.js";
import { ClientNotUpToDate } from "../../../../shared/const.js";
import { Day } from "../../../../shared/data/day.js";
import { ERROR_CLASS } from "../../../const.js";
import { msg_pop_up } from "../../../dom_utils.js";
import { InvalidAuth, post_day } from "./api/day_api.js";


/**
 * Handles the automatic saving of a day object on a regular interval.
 *
 * @export
 * @class DayAutoSaver
 * @typedef {DayAutoSaver}
 */
export class DayAutoSaver {
    #SAVE_INTERVAL;
    #timer_id;
    #get_day;
    #update_timestamp;
    #update_day;

    constructor({get_day, update_timestamp, update_day, save_interval = 5000}) {
        validate_type(get_day, "function");
        validate_type(update_timestamp, "function");
        validate_type(update_day, "function");
        validate_type(get_day(), Day);
        this.#get_day = get_day;
        this.#update_timestamp = update_timestamp;
        this.#update_day = update_day;
        this.#SAVE_INTERVAL = save_interval;
        this._init_listeners();
        this.start();
    }

    
    /** 
     * Starts/restarts the timer 
     * This is automatically called when the visibilityState goes to visibile
     * 
    */
    start() {
        this.#timer_id = setInterval(() => {this._save();},  this.#SAVE_INTERVAL);
    }

     /**
      * Stops the timer and saves the day using @function sendBeacon
      * This is automatically called when the visibilityState goes to hidden
      */
    async stop() {
        clearInterval(this.#timer_id);
        navigator.sendBeacon(
            "/day/" + this.#get_day().date.getDate() + "-" + this.#get_day().date.getMonth() + "-" + this.#get_day().date.getFullYear(),
            new Blob([JSON.stringify(this.#get_day().prepare_json_obj())], {type: "application/json"})
        );
    }
    
    async _save() {
        post_day(this.#get_day())
            .then((res) => {
                this.#update_timestamp(res.new_timestamp);
            })
            .catch((err) => {
                if(err instanceof InvalidAuth) {
                    msg_pop_up({
                        msg: "Seems like your session timed out, please log in again", 
                        el_class: ERROR_CLASS,
                        redirection: {msg: "Click here to go to sign in page", url: "/signin"}
                    });
                } else if(err instanceof ClientNotUpToDate) {
                    this.#update_day();
                }
            });
    }

    _init_listeners() {
        document.onvisibilitychange = async () => {
            if (document.hidden) {
                await this.stop();
            } else {
                await this.#update_day();
                this.start();
            }
        };
    }
}