import Database from "better-sqlite3";
import { validate_type } from "../../shared/clean_code/clean_code_enforcement.js";
import { JournalDAO } from "../dao/journal_dao.js";

export class JournalService {
    #journal_dao;
    constructor(db) {
        validate_type(db, Database);
        this.#journal_dao = new JournalDAO(db);
    }
}

export function get_date_from_url(url) {
    validate_type(url, "string");
    const date_regex = /\/day\/\d+-\d+-\d+/g;
    const date_matches = url.match(date_regex); //Format: [day, month, year]
    if (!date_matches || date_matches.length != 1)
        throw new InvalidDate(date_matches ? //null if no matches were found
            "Too many matches : " + date_matches
            : "No matches found");
    const date_array = date_matches[0].match(/\d+/g);
    const date = new Date();
    date.setFullYear(Number(date_array[2]));
    date.setMonth(Number(date_array[1]) - 1); //-1 because jan is 0 for a weird reason
    date.setDate(Number(date_array[0]));
    return date;
}

export class InvalidDate extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDate";
    }
}

