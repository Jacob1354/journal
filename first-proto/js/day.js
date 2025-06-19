export class Day {
    constructor() {
        this.date = new Date();
        this.schedule = new Schedule();
        this.mood_fields = [];
        this.mood_fields.push(new NumberField("Hours of sleep"));
        this.mood_fields.push(new RatingField("Energy rating", 10));
        this.mood_fields.push(new RatingField("Hapiness rating", 10));
        this.mood_fields.push(new TextField("Comments", "Add any additional info here"));
    }
}

class Schedule {
    constructor() {
        this.activities = new Map();
    }
}


class AbstractMoodField {
    constructor(field_name) {
        if(new.target === MoodField) {
            throw new Error("Cannot initiate AbstactMoodField since it's an abstract class");
        }
        this.field_name = field_name;
    }
}
