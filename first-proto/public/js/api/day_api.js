import { Day } from "../../../shared/data/day.js";


export async function fetch_day(day) {
    return new Day();
}


export class InvalidAuth extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidAuth";
    }
}

export class ServerErr extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ServerErr";
    }
}
