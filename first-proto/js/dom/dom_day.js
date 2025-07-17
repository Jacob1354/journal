import { validate_type } from "../clean_code/clean_code_enforcement";
import { Day } from "../data/day";

class DomDay {
    #day;
    constructor(day) {
        validate_type(day, Day);
        this.#day = new Day(day);
    }
}