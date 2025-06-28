import { validate_type } from "./clean_code_enforcement";


export class Schedule {
    #activities;
    constructor(activities = []) {
        activities.forEach((activity) => {validate_type(activity, Activity)})
        this.#activities = activities;
    }

    
}


export class Activity {
    #start_time;
    #end_time;
    #title;
    #content;
    constructor(
        start_time = new HoursAndMinutes(10 ,0), 
        end_time = new HoursAndMinutes(12, 0), 
        title = "My activity", 
        content = "description") {
            validate_type(start_time, HoursAndMinutes);
            validate_type(end_time, HoursAndMinutes);
            validate_type(title, "string");
            validate_type(content, "string");
    }
}

export class HoursAndMinutes {
    constructor(hours = 0, minutes = 0) {
        this.hours = hours;
        this.minutes = minutes;
    }
}