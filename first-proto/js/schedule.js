import { validate_type } from "./clean_code_enforcement";


export class Schedule {
    #activities;
    constructor(activities = []) {
        activities.forEach((activity) => {validate_type(activity, Activity)})
        this.#activities = activities;
        this.#activities.sort((a1, a2) => a1.get_start)
    }

    add_activity(new_activity) {
        validate_type(new_activity, Activity);
        this.#activities.push(new Activity(new_activity));
    }

    get_activities() {
        return [...this.#activities];
    }

}


export class Activity {
    start_time;
    end_time;
    title;
    content;
    constructor_bycopy(activity) {
        this.start_time = activity.start_time;
        this.end_time = activity.end_time;
        this.title = activity.title;
        this.content = activity.content;
    }
    constructor(
        start_time = new HoursAndMinutes(10 ,0), 
        end_time = new HoursAndMinutes(12, 0), 
        title = "My activity", 
        content = "description") {
            if(start_time instanceof Activity) {
                this.constructor_bycopy(start_time);
            }
            else {
                            validate_type(start_time, HoursAndMinutes);
            validate_type(end_time, HoursAndMinutes);
            validate_type(title, "string");
            validate_type(content, "string");

            this.start_time = start_time;
            this.end_time = end_time;
            this.title = title;
            this.content = content;
            }
    }
}

export class HoursAndMinutes {
    constructor(hours = 0, minutes = 0) {
        this.hours = hours;
        this.minutes = minutes;
    }
}