import { Day } from "../../../shared/data/day.js";
import { error_pop_up } from "../dom/dom_utils.js";

//TODO handle case where the promise is never settled
export async function fetch_day(date = new Date()) {
    const day_path = "/day/" + date.getDate() +"-"+ date.getMonth() +"-"+ date.getFullYear();
    let response;
    try {
        response = await fetch(day_path);
    } catch(err) {
        error_pop_up("An error occured, sorry :/");
    }
    if(response.status == 200)
        return Day.from_json_obj(await response.json());
    else if(response.status == 401)
        throw new InvalidAuth("You must be logged to access this data");
    else if(response.status == 500)
        throw new ServerErr("Couldn't retrieve data due to a serer error");
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
