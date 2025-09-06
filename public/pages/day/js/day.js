import { DomDay } from "./dom/dom_day.js"
import { get_day } from "./api/day_api.js";
import { init } from "./utils.js";

init();

let dom_day = new DomDay(await get_day());
dom_day.render_day();