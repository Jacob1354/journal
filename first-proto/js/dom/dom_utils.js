import { validate_array_type, validate_type } from "../clean_code/clean_code_enforcement.js";

export function clear_element_children(element) {
    validate_type(element, HTMLElement);
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


export function place_elements_until_field1_max_then_field2(field_1_max_height, field_1, field_2, elements) {
    validate_type(field_1_max_height, "number");
    validate_type(field_1, HTMLElement);
    validate_type(field_2, HTMLElement);
    validate_array_type(elements, HTMLElement);

    let field_1_height = field_1.getBoundingClientRect().height;
    let place_in_field_1 = true;
    
    elements.forEach(el => {
        if(place_in_field_1){
            field_1.appendChild(el);
            field_1_height = field_1.getBoundingClientRect().height;
            if(field_1_height > field_1_max_height) { 
                move_child_node(field_1.lastChild, field_2);
                place_in_field_1 = false;
            }
        } else {
            field_2.appendChild(el);
        }
    });
}

export function move_child_node(el, new_parent) {
    validate_type(el, HTMLElement);
    validate_type(new_parent, HTMLElement);

    el.parentElement.removeChild(el);
    new_parent.appendChild(el);
}