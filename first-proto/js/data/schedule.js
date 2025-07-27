import { validate_array_type, validate_integer, validate_type } from "../clean_code/clean_code_enforcement.js";


export class Schedule {
    #activities;
    constructor(activities = []) {
        this.#activities = [];
        this.add_activities(activities);
    }

    static from(other) {
        const copy = new Schedule();
        copy.add_activities(other.get_activities());
        return copy;
    }

    get_activities() {
        return [...this.#activities];
    }

    add_activity(new_activity) {
        validate_type(new_activity, Activity);
        this.#activities.push(new Activity(new_activity));        
        this.#activities.sort((a1, a2) => a1.start_time.bigger_than(a2.start_time)? 1 : -1);
    }

    add_activities(activities = []) {
        validate_array_type(activities, Activity);
        activities.forEach(activity => 
            this.#activities.push(new Activity(activity))
        );
        this.#activities.sort((a1, a2) => a1.start_time.bigger_than(a2.start_time)? 1 : -1);
    }

    remove_activity(index) {
        validate_integer(index, 0, this.#activities.length);
        this.#activities.splice(index, 1);
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
        validate_integer(hours, 0, 24);
        validate_integer(minutes, 0, 60);

        this.hours = hours;
        this.minutes = minutes;
    }

    static from_string(s = "") {
        validate_type(s, "string");
        const format = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/ //HH:MM
        if(!format.test(s))
            throw new InvalidTimeFormat("HoursAndMinutes.from_string(string) must match \"HH:MM\"");

        return new HoursAndMinutes(Number(s.slice(0, 2)), Number(s.slice(3)));
    }

    toString() {
        return `${this.hours.toString().padStart(2, "0")}:${this.minutes.toString().padStart(2, "0")}`;
    }

    bigger_than(other) {
        validate_type(other, HoursAndMinutes);
        let bigger = false;

        if(this.hours - other.hours > 0)
            bigger = true;
        else if(this.hours == other.hours && this.hours > other.hours)
            bigger = true;

        return bigger;
    }

    equal_to(other) {
        validate_type(other, HoursAndMinutes);
        return this.hours == other.hours && this.minutes == other.minutes; 
    }
}

export class InvalidTimeFormat extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidTimeFormat";
    }
}