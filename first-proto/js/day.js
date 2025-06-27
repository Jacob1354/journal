import * as MoodField from "./mood_field";

export class Day {
    constructor() {
        this.date = new Date();
        this.schedule = new Schedule();
        this.mood_fields = [];
        this.mood_fields.push(new MoodField.NumberField("Hours of sleep"));
        this.mood_fields.push(new MoodField.FractionField("Energy rating"));
        this.mood_fields.push(new MoodField.FractionField("Hapiness rating"));
        this.mood_fields.push(new MoodField.TextField("Comments", "Add any additional info here"));
    }
}

class Schedule {
    #activities;
    constructor() {
        this.#activities = new Map();
    }
    
}





