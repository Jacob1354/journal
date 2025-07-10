import { validate_array_type, validate_type } from "../clean_code/clean_code_enforcement.js";
import { AbstractMoodField, FractionField, NumberField, SliderField, TextField } from "../data/mood_field.js";
import { clear_element_children, place_elements_until_field1_max_then_field2 } from "./dom_utils.js";

export function render_mood_fields(mood_fields) {
    validate_array_type(mood_fields, AbstractMoodField);
    const schedule_height = document.querySelector("#schedule").getBoundingClientRect().height;
    const mood_fields_1 = document.querySelector("#mood_fields_1");
    const mood_fields_2 = document.querySelector("#mood_fields_2");
    const mood_field_els = create_mood_fields(mood_fields);

    clear_element_children(mood_fields_1);
    clear_element_children(mood_fields_2);
    place_elements_until_field1_max_then_field2(
        mood_fields_1, 
        mood_fields_2, 
        schedule_height,
        mood_field_els
    );
}

export function create_mood_fields(fields) {
    validate_array_type(fields, AbstractMoodField);
    const field_els = [];

    fields.forEach(field => {
        field_els.push(create_mood_field(field));
    });

    return field_els;
}

export function create_mood_field(field) {
    validate_type(field, AbstractMoodField);
    if(field instanceof NumberField) {
        return _create_number_field(field);
    } else if(field instanceof TextField) {
        return _create_text_field(field);
    } else if(field instanceof FractionField) {
        return _create_fraction_field(field);
    } else if(field instanceof SliderField) {
        return _create_slider_field(field);
    }
}

export function _create_number_field(field) {
    validate_type(field, NumberField);

    const mood_field_wrapper = create_mood_field_wrapper_with_title(field);
    const nb_field = document.createElement("div");
    nb_field.classList.add("mood_field_nb");
    const input = document.createElement("input");
    input.type = "number";
    input.value = field.get_data();
    nb_field.appendChild(input);
    mood_field_wrapper.appendChild(nb_field);

    return mood_field_wrapper;
}

export function _create_text_field(field) {
    validate_type(field, TextField);

    const mood_field_wrapper = create_mood_field_wrapper_with_title(field);
    const text_field = document.createElement("div");
    text_field.classList.add("mood_field_text");
    const input = document.createElement("textarea");
    input.name = "mood_field_text";
    input.value = field.get_data();
    text_field.appendChild(input);
    mood_field_wrapper.appendChild(text_field);

    return mood_field_wrapper;
}

export function _create_fraction_field(field) {
    validate_type(field, FractionField);

    const mood_field_wrapper = create_mood_field_wrapper_with_title(field);
    const fraction_field = document.createElement("div");
    fraction_field.classList.add("mood_field_fraction");
    const input = document.createElement("input");
    input.type = "number";
    input.value = field.get_data();
    const denominator = document.createElement("p");
    denominator.innerText = "/" + String(field.get_denominator());
    fraction_field.appendChild(input);
    fraction_field.appendChild(denominator);
    mood_field_wrapper.appendChild(fraction_field);

    return mood_field_wrapper;
}

export function _create_slider_field(field) {
    validate_type(field, SliderField);

    const mood_field_wrapper = create_mood_field_wrapper_with_title(field);
    const nb_field = document.createElement("div");
    nb_field.classList.add("mood_field_slider");
    const input = document.createElement("input");
    input.type = "range";
    input.value = field.get_data();
    nb_field.appendChild(input);
    mood_field_wrapper.appendChild(nb_field);

    return mood_field_wrapper;
}

function create_mood_field_wrapper_with_title(field) {
    validate_type(field, AbstractMoodField);

    const wrapper = document.createElement("div");
    wrapper.classList.add("mood_field");
    const field_name = document.createElement("h2");
    field_name.innerText = field.get_field_name();
    wrapper.appendChild(field_name);
    
    return wrapper;
}