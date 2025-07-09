import { validate_array_type, validate_type } from "../clean_code/clean_code_enforcement";
import { AbstractMoodField, FractionField, NumberField, SliderField, TextField } from "../data/mood_field";
import { validate } from "C:/Users/Jacob/AppData/Local/Microsoft/TypeScript/5.8/node_modules/@babel/types/lib/index";


export function load_mood_field(field) {
    validate_type(field, AbstractMoodField);
    if(field instanceof NumberField) {
        return _load_number_field(field);
    } else if(field instanceof TextField) {
        return _load_text_field(field);
    } else if(field instanceof FractionField) {
        return _load_fraction_field(field);
    } else if(field instanceof SliderField) {
        return _load_slider_field(field);
    }
}

export function _load_number_field(field) {
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

export function _load_text_field(field) {
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

export function _load_fraction_field(field) {
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

export function _load_slider_field(field) {
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