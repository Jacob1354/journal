import { validate_array_type, validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";


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

export function error_pop_up(msg) {
    console.log(msg);
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
