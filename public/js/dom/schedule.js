import { validate_array_type, validate_integer, validate_type } from "../../../shared/clean_code/clean_code_enforcement.js";
import { Activity } from "../../../shared/data/schedule.js";
import { ACTIVITIY_CONTENT_CLASS, ACTIVITIY_CONTENT_WRAPPER_CLASS, ACTIVITIY_ENDTIME_CLASS, ACTIVITIY_REMOVE_BTN_CLASS, ACTIVITIY_STARTTIME_CLASS, ACTIVITIY_TIMEINTERVAL_CLASS, ACTIVITIY_TITLE_CLASS, ACTIVITIES_ID, ACTIVITY_CLASS } from "./constants.js";

export const removeBtnHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>`
                        

export class DOMSchedule {
    #update_title;
    #update_content;
    #update_start_time;
    #update_end_time;
    #remove_activity;
    
    constructor( {
        update_title,
        update_content,
        update_start_time,
        update_end_time,
        remove_activity
    }
    ) {
        this.#update_title = update_title;
        this.#update_content = update_content;
        this.#update_start_time = update_start_time;
        this.#update_end_time = update_end_time;
        this.#remove_activity = remove_activity;
    }

    render(activities) {
        validate_array_type(activities, Activity);
        const activities_el = this._create_scheduled_activities(activities);
        const activities_container = document.getElementById(ACTIVITIES_ID);
        activities_container.replaceWith(activities_el);
    }

    _create_scheduled_activities(activities) {
        const activities_container = document.createElement("div");
        activities_container.id = ACTIVITIES_ID;
        activities.forEach((activity, i) => {
            activities_container.appendChild(this._create_activity(activity, i));
        });
        return activities_container;
    }
    
    _create_activity(activity, index) {
        validate_type(activity, Activity);
        validate_integer(index, 0);
        const activity_el = document.createElement("div");
        activity_el.classList.add(ACTIVITY_CLASS);
        activity_el.setAttribute("index", index);
    
        activity_el.appendChild(this._create_activity_title(activity));
        activity_el.appendChild(this._create_activity_time_interval(activity));
        activity_el.appendChild(this._create_activity_remove_btn());
        activity_el.appendChild(this._create_activity_content(activity));

        return activity_el;
    }
    
    
    _create_activity_title(activity) {
        const title = document.createElement("h3");
        title.innerText = activity.title;
        title.classList.add(ACTIVITIY_TITLE_CLASS);
        title.addEventListener("input", this.#update_title);
    
        return title;
    }
    
    _create_activity_time_interval(activity) {
        const interval = document.createElement("div");
        interval.classList.add(ACTIVITIY_TIMEINTERVAL_CLASS);
    
        const start_time = document.createElement("input");
        start_time.classList.add(ACTIVITIY_STARTTIME_CLASS);
        start_time.type = "time";
        start_time.value = String(activity.start_time);
        start_time.addEventListener("input", this.#update_start_time);
    
        const to = document.createElement("p");
        to.innerText = "to";
    
        const end_time = document.createElement("input");
        end_time.classList.add(ACTIVITIY_ENDTIME_CLASS);
        end_time.type = "time";
        end_time.value = String(activity.end_time);
        end_time.addEventListener("input", this.#update_end_time);
        
        interval.appendChild(start_time);
        interval.appendChild(to);
        interval.appendChild(end_time);
    
        return interval;
    }
    
    _create_activity_remove_btn() {
        const btn = document.createElement("button");
        btn.classList.add(ACTIVITIY_REMOVE_BTN_CLASS);
        btn.innerHTML = removeBtnHTML;
        btn.addEventListener("click", this.#remove_activity);
        return btn;
    }
    
    _create_activity_content(activity) {
        const wrapper = document.createElement("div");
        wrapper.classList.add(ACTIVITIY_CONTENT_WRAPPER_CLASS);
        
        const content = document.createElement("input");
        content.classList.add(ACTIVITIY_CONTENT_CLASS);
        content.type = "text";
        content.value = activity.content;
        content.addEventListener("input", this.#update_content);
    
        wrapper.appendChild(content);
        return wrapper;
    }
}


