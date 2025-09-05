import { validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";
import { Day } from "../../../../../shared/data/day.js";

export const FETCH_TIMEOUT = 5000;


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
        .then((res) => {
            if(res.status == 401)
                throw new InvalidAuth("Couldn't save day");
            else if(res.status < 200 || res.status > 299)
                throw new CouldntSaveData("Couldn't save day");
            return Promise.resolve({status: res.status});
        })
        .catch((err) => {
            if(err instanceof InvalidAuth || err instanceof CouldntSaveData)
                throw err;
            else
                throw new CouldntSaveData("Couldn't save day");
        })
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