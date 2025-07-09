/**
 * @jest-environment jsdom
 */

import { FractionField, NumberField, SliderField, TextField } from "../data/mood_field";
import { _load_fraction_field, _load_number_field, _load_slider_field, _load_text_field, load_mood_field } from "./mood_field";
import { validate } from "C:/Users/Jacob/AppData/Local/Microsoft/TypeScript/5.8/node_modules/@babel/types/lib/index";

let nb_field, fraction_field, slider_field, text_field;

beforeAll(() => {
    nb_field = new NumberField("nb_field");
    fraction_field = new FractionField("fraction_field");
    slider_field = new SliderField("slider_field");
    text_field = new TextField("text_field");
})


test("load_mood_field", () => {
    const nb_field_el = load_mood_field(nb_field);
    const text_field_el = load_mood_field(text_field);
    const fraction_field_el = load_mood_field(fraction_field);
    const slider_field_el = load_mood_field(slider_field);

    expect(nb_field_el.querySelectorAll(".mood_field_nb").length).toBe(1);
    expect(text_field_el.querySelectorAll(".mood_field_text").length).toBe(1);
    expect(fraction_field_el.querySelectorAll(".mood_field_fraction").length).toBe(1);
    expect(slider_field_el.querySelectorAll(".mood_field_slider").length).toBe(1);
}); 

//Field type must be one of the following : mood_field_[nb/text/fraction/slider]
function test_field_basics(field_el, field_data, field_type) {
    validate(field_type, "string");

    expect(field_el.classList.contains("mood_field")).toBe(true);
    expect(field_el.children[0].nodeName).toBe("H2");
    expect(field_el.children[0].innerText).toBe(field_data.get_field_name());
    expect(field_el.children[1].nodeName).toBe("DIV");
    expect(field_el.children[1].classList.contains("mood_field_" + field_type)).toBe(true);
}

test("_load_number_field", () => {
    const nb_field_el = _load_number_field(nb_field);

    test_field_basics(nb_field_el, nb_field, "nb");
    expect(nb_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(nb_field_el.children[1].children[0].type).toBe("number");
    expect(nb_field_el.children[1].children[0].value).toBe(String(nb_field.get_data()));
}); 

test("_load_text_field", () => {
    const text_field_el = _load_text_field(text_field);
    test_field_basics(text_field_el, text_field, "text");

    expect(text_field_el.children[1].children[0].nodeName).toBe("TEXTAREA");
    expect(text_field_el.children[1].children[0].name).toBe("mood_field_text");
    expect(text_field_el.children[1].children[0].value).toBe(text_field.get_data());
}); 

test("_load_fraction_field", () => {
    const fraction_field_el = _load_fraction_field(fraction_field);
    test_field_basics(fraction_field_el, fraction_field, "fraction");

    expect(fraction_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(fraction_field_el.children[1].children[0].type).toBe("number");
    expect(fraction_field_el.children[1].children[0].value).toBe(String(nb_field.get_data()));
    expect(fraction_field_el.children[1].children[1].nodeName).toBe("P");
    expect(fraction_field_el.children[1].children[1].innerText).toBe("/" + String(fraction_field.get_denominator()));
}); 

test("load_slider_field", () => {
    const slider_field_el = _load_slider_field(slider_field);

    test_field_basics(slider_field_el, slider_field, "slider");
    expect(slider_field_el.children[1].children[0].nodeName).toBe("INPUT");
    expect(slider_field_el.children[1].children[0].type).toBe("range");
    expect(slider_field_el.children[1].children[0].value).toBe(String(slider_field.get_data()));
}); 