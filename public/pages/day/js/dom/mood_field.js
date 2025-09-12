import { validate_array_type, validate_integer, validate_type } from "../../../../../shared/clean_code/clean_code_enforcement.js";
import { AbstractMoodField, FractionField, NumberField, SliderField, TextField } from "../../../../../shared/data/mood_field.js";
import { EVENT_UPDATE_MOODFIELD, MOOD_FIELD_CLASS, MOOD_FIELD_FRACTION_CLASS, MOOD_FIELD_INPUT_CLASS, MOOD_FIELD_NB_CLASS, MOOD_FIELD_SLIDER_CLASS, MOOD_FIELD_TEXT_CLASS, MOOD_FIELD_TEXT_NAME, MOOD_FIELDS_WRAPPER_ID } from "./constants.js";
import { replace_children_of } from "./dom_utils.js";

export class DOMMoodField {

    constructor() {
    }

    render(mood_fields) {
        validate_array_type(mood_fields, AbstractMoodField);
        const mood_fields_container = document.getElementById(MOOD_FIELDS_WRAPPER_ID);
        const mood_field_els = this._create_mood_fields(mood_fields);
        
        replace_children_of(mood_fields_container, mood_field_els);
    }
    
    _create_mood_fields(mood_fields) {
        validate_array_type(mood_fields, AbstractMoodField);
        const field_els = [];

        mood_fields.forEach((field, i) => {
            field_els.push(this._create_mood_field(field, i));
        });

        return field_els;
    }

    _create_mood_field(field, index) {
        validate_type(field, AbstractMoodField);
        validate_integer(index, 0);
        let dom_field;
        if(field instanceof NumberField) {
            dom_field = this._create_number_field(field);
        } else if(field instanceof TextField) {
            dom_field = this._create_text_field(field);
        } else if(field instanceof FractionField) {
            dom_field = this._create_fraction_field(field);
        } else if(field instanceof SliderField) {
            dom_field = this._create_slider_field(field);
        }
        dom_field.setAttribute("index", index);
        return dom_field;
    }
    
    _create_number_field(field) {
        validate_type(field, NumberField);
        
        const mood_field_wrapper = this._create_mood_field_wrapper_with_title(field);
        const nb_field = document.createElement("div");
        nb_field.classList.add(MOOD_FIELD_NB_CLASS);
        const input = document.createElement("input");
        input.classList.add(MOOD_FIELD_INPUT_CLASS);
        input.type = "number";
        input.value = field.get_data();
        input.addEventListener("input", () => input.dispatchEvent(
            new CustomEvent(EVENT_UPDATE_MOODFIELD, {bubbles: true})
        ));
        nb_field.appendChild(input);
        mood_field_wrapper.appendChild(nb_field);
        
        return mood_field_wrapper;
    }
    
    _create_text_field(field) {
        validate_type(field, TextField);
        
        const mood_field_wrapper = this._create_mood_field_wrapper_with_title(field);
        const text_field = document.createElement("div");
        text_field.classList.add(MOOD_FIELD_TEXT_CLASS);
        const input = document.createElement("input");
        input.classList.add(MOOD_FIELD_INPUT_CLASS);
        input.name = MOOD_FIELD_TEXT_NAME;
        input.value = field.get_data();
        input.addEventListener("input", () => input.dispatchEvent(
            new CustomEvent(EVENT_UPDATE_MOODFIELD, {bubbles: true})
        ));
        text_field.appendChild(input);
        mood_field_wrapper.appendChild(text_field);
        
        return mood_field_wrapper;
    }
    
    _create_fraction_field(field) {
        validate_type(field, FractionField);
        
        const mood_field_wrapper = this._create_mood_field_wrapper_with_title(field);
        const fraction_field = document.createElement("div");
        fraction_field.classList.add(MOOD_FIELD_FRACTION_CLASS);
        const input = document.createElement("input");
        input.classList.add(MOOD_FIELD_INPUT_CLASS);
        input.type = "number";

        input.value = field.get_data();
        input.addEventListener("input", () => input.dispatchEvent(
            new CustomEvent(EVENT_UPDATE_MOODFIELD, {bubbles: true})
        ));
        const denominator = document.createElement("p");
        denominator.innerText = "/" + String(field.get_denominator());
        fraction_field.appendChild(input);
        fraction_field.appendChild(denominator);
        mood_field_wrapper.appendChild(fraction_field);
        
        return mood_field_wrapper;
    }
    
    _create_slider_field(field) {
        validate_type(field, SliderField);
        
        const mood_field_wrapper = this._create_mood_field_wrapper_with_title(field);
        const nb_field = document.createElement("div");
        nb_field.classList.add(MOOD_FIELD_SLIDER_CLASS);
        const input = document.createElement("input");
        input.classList.add(MOOD_FIELD_INPUT_CLASS);
        input.type = "range";
        input.value = field.get_data();
        input.addEventListener("input", () => input.dispatchEvent(
            new CustomEvent(EVENT_UPDATE_MOODFIELD, {bubbles: true})
        ));
        nb_field.appendChild(input);
        mood_field_wrapper.appendChild(nb_field);

        return mood_field_wrapper;
    }

    _create_mood_field_wrapper_with_title(field) {
        validate_type(field, AbstractMoodField);

        const wrapper = document.createElement("div");
        wrapper.classList.add(MOOD_FIELD_CLASS);
        const field_name = document.createElement("h2");
        field_name.innerText = field.get_field_name();
        wrapper.appendChild(field_name);
        
        return wrapper;
    }

}

