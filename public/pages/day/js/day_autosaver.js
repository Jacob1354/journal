import { validate_type } from "../../../../shared/clean_code/clean_code_enforcement.js";
import { ClientNotUpToDate } from "../../../../shared/const.js";
import { Day } from "../../../../shared/data/day.js";
import { InvalidAuth, post_day } from "./api/day_api.js";

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

    start() {
        this.#timer_id = setInterval(() => {this._save();},  this.#SAVE_INTERVAL);
    }

    async stop() {
        clearInterval(this.#timer_id);
        navigator.sendBeacon(
            "/day/" + this.#get_day().date.getDate() + "-" + this.#get_day().date.getMonth() + "-" + this.#get_day().date.getFullYear(),
            new Blob([JSON.stringify(this.#get_day().prepare_json_obj())], {type: "application/json"})
        );
    }

    async close() {
        clearInterval(this.#timer_id);
        await post_day(this.#get_day());
        document.onvisibilitychange = () => {};
    }

    
    async _save() {
        post_day(this.#get_day())
            .then((res) => {
                this.#update_timestamp(res.new_timestamp);
            })
            .catch((err) => {
                if(err instanceof InvalidAuth) {
                    //TODO figure out how to implement
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
                this.#update_day();
                this.start();
            }
        };
    }
}