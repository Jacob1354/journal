import { validate_array_type, validate_integer, validate_type } from "../clean_code/clean_code_enforcement.js";
import { AbstractMoodField, FractionField, NumberField, SliderField, TextField } from "../data/mood_field.js";
import { Schedule } from "../data/schedule.js";
import { MOOD_FIELD_CLASS, MOOD_FIELD_FRACTION_CLASS, MOOD_FIELD_NB_CLASS, MOOD_FIELD_SLIDER_CLASS, MOOD_FIELD_TEXT_CLASS, MOOD_FIELD_TEXT_NAME } from "./constants.js";
import { clear_children_of, replace_children_of } from "./dom_utils.js";

export class DOMMoodField {
    #date;
    #mood_fields;

    constructor(date, mood_fields) {
        validate_type(date, Date);
        validate_array_type(mood_fields, AbstractMoodField);
        this.#date = date;
        this.#mood_fields = mood_fields;
    }

    create_mood_fields() {
        const field_els = [];

        this.#mood_fields.forEach((field, i) => {
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
        input.type = "number";
        input.value = field.get_data();
        nb_field.appendChild(input);
        mood_field_wrapper.appendChild(nb_field);

        return mood_field_wrapper;
    }

    _create_text_field(field) {
        validate_type(field, TextField);

        const mood_field_wrapper = this._create_mood_field_wrapper_with_title(field);
        const text_field = document.createElement("div");
        text_field.classList.add(MOOD_FIELD_TEXT_CLASS);
        const input = document.createElement("textarea");
        input.name = MOOD_FIELD_TEXT_NAME;
        input.value = field.get_data();
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
        input.type = "number";
        input.value = field.get_data();
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
        input.type = "range";
        input.value = field.get_data();
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

