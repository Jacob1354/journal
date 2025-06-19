export class Day {
    constructor() {
        this.date = new Date();
        this.schedule = new Schedule();
        this.mood_data = new MoodData();
    }
}

class Schedule {
    constructor() {
        this.activities = new Map();
    }
}

