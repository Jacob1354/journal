import { validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";
import { ClientNotUpToDate } from "../../../../../shared/const.js";
import { Day } from "../../../../../shared/data/day.js";

export const FETCH_TIMEOUT = 5000;
export const SIGNOUT_TIMEOUT = 1500;


/**
 * Fetches a GET request to domain/day/:day-:month-:year and returns the received day
 * The fetch timesout after @var {FETCH_TIMEOUT}
 *
 * @export
 * @async
 * @param {Date} date Defaults to current day
 * @throws {InvalidAuth}
 * @throws {ServerErr}
 * @returns {Day} the day matching the user and the date
 */
export async function get_day(date = new Date()) {
    const day_path = "/day/" + date.getDate() +"-"+ date.getMonth() +"-"+ date.getFullYear();
    let response = await fetch(day_path, {signal: AbortSignal.timeout(FETCH_TIMEOUT)});
    if(response.status == 200)
        return Day.from_json_obj(await response.json());
    else if(response.status == 401)
        throw new InvalidAuth("You must be logged to access this data");
    else if(response.status == 500)
        throw new ServerErr("Couldn't retrieve data due to a serer error");
}

/**
 * Fetches a POST request to domain/day/:day-:month-:year to save a day
 * The fetch timesout after @var {FETCH_TIMEOUT}
 *
 * @export
 * @async
 * @throws {InvalidAuth}
 * @throws {ClientNotUpToDate} If the timestamp of the day passed as a param doesn't match the one in the db
 * @throws {CouldntSaveData}
 * @param {Day} day The day to save
 * @returns {new_timetamp} The new update_timestamp for a Day instance 
 */
export async function post_day(day) {
    validate_type(day, Day);
    const url = "/day/" + day.date.getDate() + "-" + day.date.getMonth() + "-" + day.date.getFullYear();
    const info = {
        body: JSON.stringify(day.prepare_json_obj()),   
        method: "POST",
        headers: {
                "Content-type": "application/json"
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT)
    }
    return fetch(url, info)
        .then(async(res) => {
            if(res.status == 401)
                throw new InvalidAuth("Invalid auth");
            else if(res.status == 428)
                throw new ClientNotUpToDate("Not up to date");
            else if(res.status < 200 || res.status > 299)
                throw new CouldntSaveData("Couldn't save day");
            return Promise.resolve({status: res.status, new_timestamp: (await res.json()).new_timestamp});
        })
        .catch((err) => {
            if(err instanceof InvalidAuth || err instanceof CouldntSaveData || err instanceof ClientNotUpToDate)
                throw err;
            else
                throw new CouldntSaveData("Couldn't save day");
        })
}

/**
 * Fetches a POST request to /signout. The response should set the session cookie to ""
 *
 * @export
 * @async 
 */
export async function post_signout() {
    return fetch('/signout', {
        method: "POST",
        keepalive: true,
        signal: AbortSignal.timeout(SIGNOUT_TIMEOUT)
    }).catch((err) => console.log(err));
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


export class CouldntSaveData extends Error {
    constructor(msg) {
        super(msg);
        this.name = "CouldntSaveData";
    }
}