import { validate_array_type, validate_type } from "../clean_code/clean_code_enforcement.js";

export function clear_children_of(element) {
    validate_type(element, HTMLElement);
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

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

/*
 * Uses Element.closest, therefore the search includes itself
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
