import { validate_array_type, validate_type } from "../clean_code/clean_code_enforcement.js";
import { AbstractMoodField, FractionField, NumberField, SliderField, TextField } from "../data/mood_field.js";
import { MOOD_FIELD_CLASS, MOOD_FIELD_FRACTION_CLASS, MOOD_FIELD_NB_CLASS, MOOD_FIELD_SLIDER_CLASS, MOOD_FIELD_TEXT_CLASS, MOOD_FIELD_TEXT_NAME } from "./constants.js";
import { clear_children_of, replace_children_of } from "./dom_utils.js";

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
    nb_field.classList.add(MOOD_FIELD_NB_CLASS);
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
    text_field.classList.add(MOOD_FIELD_TEXT_CLASS);
    const input = document.createElement("textarea");
    input.name = MOOD_FIELD_TEXT_NAME;
    input.value = field.get_data();
    text_field.appendChild(input);
    mood_field_wrapper.appendChild(text_field);

    return mood_field_wrapper;
}

export function _create_fraction_field(field) {
    validate_type(field, FractionField);

    const mood_field_wrapper = create_mood_field_wrapper_with_title(field);
    const fraction_field = document.createElement("div");
    fraction_field.classList.add(MOOD_FIELD_FRACTION_CLASS);
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
    nb_field.classList.add(MOOD_FIELD_SLIDER_CLASS);
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
    wrapper.classList.add(MOOD_FIELD_CLASS);
    const field_name = document.createElement("h2");
    field_name.innerText = field.get_field_name();
    wrapper.appendChild(field_name);
    
    return wrapper;
}