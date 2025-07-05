import { validate_type } from "../clean_code/clean_code_enforcement.js";

export function clear_element_children(element) {
    validate_type(element, HTMLElement);
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}