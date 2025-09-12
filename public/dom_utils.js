import { validate_array_type, validate_type } from "../shared/clean_code/clean_code_enforcement.js";
import { ERROR_CLASS, POP_UP_CLASS } from "./const.js";


/**
 * Removes all the children of an element
 *
 * @export
 * @param {HTMLElement} element 
 */
export function clear_children_of(element) {
    validate_type(element, HTMLElement);
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


/**
 * Repalces all the children of an element by @param {new_children}
 *
 * @export
 * @param {HTMLElement} parent 
 * @param {Array<HTMLElement>} new_children 
 */
export function replace_children_of(parent, new_children) {
    validate_type(parent, HTMLElement);
    validate_array_type(new_children, HTMLElement);
    clear_children_of(parent);
    new_children.forEach(el => {
        parent.appendChild(el);
    });
}


export function move_child_node(el, new_parent) {
    validate_type(el, HTMLElement);
    validate_type(new_parent, HTMLElement);

    el.parentElement.removeChild(el);
    new_parent.appendChild(el);
}


/**
 * Searches for the closest parent node matching @param parent_selector and returns
 * the value of it's attribute named @param attribute
 * 
 * Important note: This search includes the child on which this is called. Thus, to exclude
 * it you'd need to call this on it's parent
 * 
 * @export
 * @throws {ParentNotFound}
 * @throws {UndefinedAttribute}
 * @param {Element} child The node on which the search should begin
 * @param {string} parent_selector 
 * @param {string} attribute 
 * @returns {*} Value of the attribute
 */
export function get_parent_attribute(child, parent_selector, attribute) {
    validate_type(child, Element);
    validate_type(parent_selector, "string");
    validate_type(attribute, "string");

    const activity = child.closest(parent_selector);
    if(activity === null)
        throw new ParentNotFound("No parent node with class 'activity'");
    const index = activity.getAttribute(attribute);
    if(index === null)
        throw new UndefinedAttribute("index attribute isn't defined");
    return index;
}



/**
 * Creates a pop up in the body of the document. 
 * Contains the message passed as msg and has the class passed in param.
 *
 * @export
 * @param {string} msg 
 * @param {string} el_class The class to give to the pop_up. Defaults at "pop_up"
 */
export function msg_pop_up({msg, el_class = null}) {
    const pop_up = document.createElement("div");
    pop_up.classList.add(POP_UP_CLASS);
    if(el_class) pop_up.classList.add(el_class);
    const msg_el = document.createElement("p");
    msg_el.innerText = msg;
    const close_btn = document.createElement("button");
    close_btn.innerText = "X";
    close_btn.addEventListener("click", () => document.body.removeChild(pop_up));
    pop_up.appendChild(msg_el);
    pop_up.appendChild(close_btn);
    pop_up.style.opacity = 0;
    document.body.appendChild(pop_up);
    fade_in(pop_up, 200);
}


/**
 * Fades in an html element with an animation duration of duration
 *
 * @export
 * @param {HTMLElement} el 
 * @param {number} duration in ms 
 */
export function fade_in(el, duration) {
    const delay = 10;
    const incrementation = delay/duration;
    const id = setInterval(() => {
        el.style.opacity = Number(el.style.opacity) + incrementation;
        if(el.style.opacity >= 1)
            clearInterval(id);
        }, 
        delay
    );
}

export class ParentNotFound extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ParentNotFound";
    }
}
export class UndefinedAttribute extends Error {
    constructor(msg) {
        super(msg);
        this.name = "UndefinedAttribute";
    }
}
