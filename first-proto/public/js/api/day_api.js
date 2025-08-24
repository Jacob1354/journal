import { Day } from "first-proto/shared/data/day";
import { validate_type } from "../../../shared/clean_code/clean_code_enforcement";


export function get_date_from_url(url) {
    validate_type(url, "string");
    const date_regex = /\/day\/\d+-\d+-\d+/g;
    const date_matches = url.match(date_regex); //Format: [day, month, year]
    if (!date_matches || date_matches.length != 1)
        throw new InvalidDateURL(date_matches ? //null if no matches were found
    "Too many matches : " + date_matches
    : "No matches found");
    const date_array = date_matches[0].match(/\d+/g);
    const date = new Date();
    date.setFullYear(Number(date_array[2]));
    date.setMonth(Number(date_array[1]) - 1); //-1 because jan is 0 for a weird reason
    date.setDate(Number(date_array[0]));
    return date;
}

export async function fetch_day(day) {
    return new Day();
}


export class InvalidDateURL extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDateURL";
    }
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
