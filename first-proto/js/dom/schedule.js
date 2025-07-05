import { validate_type } from "../clean_code/clean_code_enforcement";
import { Activity, HoursAndMinutes } from "../data/schedule";

export const removeBtnHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>`

export function load_schedule(parent, schedule) {

}

export function load_activity(dom_schedule, activity) {
    validate_type(activity, Activity);
    const activity_el = document.createElement("div");

    activity_el.appendChild(_load_activity_title(activity));
    activity_el.appendChild(_load_activity_time_interval(activity));
    activity_el.appendChild(_load_activity_remove_btn());
    activity_el.appendChild(_load_activity_content(activity));
    
    return activity_el;
}


export function _load_activity_title(activity) {
    const title = document.createElement("h3");
    title.innerText = activity.title;

    return title;
}

export function _load_activity_time_interval(activity) {
    const interval = document.createElement("div");
    interval.classList.add("time_interval");

    const start_time = document.createElement("input");
    start_time.classList.add("activity_start_time");
    start_time.type = "time";
    start_time.value = String(activity.start_time);

    const to = document.createElement("p");
    to.innerText = "to";

    const end_time = document.createElement("input");
    end_time.classList.add("activity_end_time");
    end_time.type = "time";
    end_time.value = String(activity.end_time);

    interval.appendChild(start_time);
    interval.appendChild(to);
    interval.appendChild(end_time);

    return interval;
}

export function _load_activity_remove_btn() {
    const btn = document.createElement("button");
    btn.classList.add("activity_remove_btn");
    btn.innerHTML = removeBtnHTML;
    return btn;
}

export function _load_activity_content(activity) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    
    const content = document.createElement("input");
    content.classList.add("activity_content");
    content.type = "text";
    content.value = activity.content;

    wrapper.appendChild(content);
    return wrapper;
}

