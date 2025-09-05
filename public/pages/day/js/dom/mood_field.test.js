/**
 * @jest-environment jsdom
 */

import { validate_type } from "../../../../../shared/clean_code/clean_code_enforcement";
import { FractionField, NumberField, SliderField, TextField } from "../../../../../shared/data/mood_field";
import { MOOD_FIELD_CLASS, MOOD_FIELD_FRACTION_CLASS, MOOD_FIELD_INPUT_CLASS, MOOD_FIELD_NB_CLASS, MOOD_FIELD_SLIDER_CLASS, MOOD_FIELD_TEXT_CLASS, MOOD_FIELD_TEXT_NAME, MOOD_FIELDS_WRAPPER_ID } from "./constants";
import { DOMMoodField } from "./mood_field";

let nb_field, fraction_field, slider_field, text_field, mood_fields, dom_mood_field;

beforeAll(() => {
    nb_field = new NumberField("nb_field");
    fraction_field = new FractionField("fraction_field");
    slider_field = new SliderField("slider_field");
    text_field = new TextField("text_field");
    mood_fields = [nb_field, fraction_field, slider_field, text_field, nb_field];
    dom_mood_field = new DOMMoodField({update: (event) => {}});
})

test("create_mood_fields", () => {
    const fields = dom_mood_field._create_mood_fields(mood_fields);

    expect(fields.length).toBe(5);
    expect(fields[0].getAttribute("index")).toBe("0");
    expect(fields[4].getAttribute("index")).toBe("4");
});


test("create_mood_field", () => {
    const nb_field_el = dom_mood_field._create_mood_field(nb_field, 0);
    const text_field_el = dom_mood_field._create_mood_field(text_field, 1);
    const fraction_field_el = dom_mood_field._create_mood_field(fraction_field, 2);
    const slider_field_el = dom_mood_field._create_mood_field(slider_field, 3);

    expect(nb_field_el.getElementsByClassName(MOOD_FIELD_NB_CLASS).length).toBe(1);
    expect(text_field_el.getElementsByClassName(MOOD_FIELD_TEXT_CLASS).length).toBe(1);
    expect(fraction_field_el.getElementsByClassName(MOOD_FIELD_FRACTION_CLASS).length).toBe(1);
    expect(slider_field_el.getElementsByClassName(MOOD_FIELD_SLIDER_CLASS).length).toBe(1);
}); 

//Field type must be one of the following : mood_field_[nb/text/fraction/slider]
function test_field_basics(field_el, field_data, field_type) {
    validate_type(field_type, "string");

    expect(field_el.classList.contains(MOOD_FIELD_CLASS)).toBe(true);
    expect(field_el.children[0].nodeName).toBe("H2");
    expect(field_el.children[0].innerText).toBe(field_data.get_field_name());
    expect(field_el.children[1].nodeName).toBe("DIV");
    expect(field_el.children[1].classList.contains("mood_field_" + field_type)).toBe(true);
    expect(field_el.querySelector("." + MOOD_FIELD_INPUT_CLASS)).toBeDefined;
}

test("_create_number_field", () => {
    const nb_field_el = dom_mood_field._create_number_field(nb_field);

    test_field_basics(nb_field_el, nb_field, "nb");
    expect(nb_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(nb_field_el.children[1].children[0].type).toBe("number");
    expect(nb_field_el.children[1].children[0].value).toBe(String(nb_field.get_data()));
}); 

test("_create_text_field", () => {
    const text_field_el = dom_mood_field._create_text_field(text_field);
    test_field_basics(text_field_el, text_field, "text");

    expect(text_field_el.children[1].children[0].nodeName).toBe("TEXTAREA");
    expect(text_field_el.children[1].children[0].name).toBe(MOOD_FIELD_TEXT_NAME);
    expect(text_field_el.children[1].children[0].value).toBe(text_field.get_data());
}); 

test("_create_fraction_field", () => {
    const fraction_field_el = dom_mood_field._create_fraction_field(fraction_field);
    test_field_basics(fraction_field_el, fraction_field, "fraction");

    expect(fraction_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(fraction_field_el.children[1].children[0].type).toBe("number");
    expect(fraction_field_el.children[1].children[0].value).toBe(String(nb_field.get_data()));
    expect(fraction_field_el.children[1].children[1].nodeName).toBe("P");
    expect(fraction_field_el.children[1].children[1].innerText).toBe("/" + String(fraction_field.get_denominator()));
}); 

test("create_slider_field", () => {
    const slider_field_el = dom_mood_field._create_slider_field(slider_field);

    test_field_basics(slider_field_el, slider_field, "slider");
    expect(slider_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(slider_field_el.children[1].children[0].type).toBe("range");
    expect(slider_field_el.children[1].children[0].value).toBe(String(slider_field.get_data()));
}); 