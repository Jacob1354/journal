import { TextField, NumberField, FractionField, SliderField, AbstractMoodField, InvalidDenom } from "./mood_field";
import {AbstractClassInstanciated, AbstractFunctionNotOverriden, InvalidDataType, OutOfBoundInteger} from "../clean_code/clean_code_enforcement";


/*
 * AbstractMoodField tests
*/
class TestField extends AbstractMoodField {}

test("Instanciating AbstractMoodField", () => {
    expect(() => new AbstractMoodField("")).toThrow(AbstractClassInstanciated);
});

test("AbstractMoodFieldChild without set_data overriding", () => {
    let test_field = new TestField("Test");
    expect(() => test_field.set_data("")).toThrow(AbstractFunctionNotOverriden);
});


/*
 * Children classes tests
*/
test("TextField get_data and set_data", () => {
    const data = "this is a test";
    let text_field = new TextField("test");
    text_field.set_data(data);
    expect(text_field.get_data()).toBe(data);

    // @ts-expect-error
    expect(() => new TextField("test", 100)).toThrow(InvalidDataType);
})

test("TextField.parse_input", () => {
    const input_1 = "10";
    const input_2 = 10;
    const field = new TextField("field");

    expect(field.parse_input(input_1)).toBe("10");
    expect(field.parse_input(input_2)).toBe("10");
});

test("NumberField get_data and set_data", () => {
    const data = 10;
    let number_field = new NumberField("test");
    number_field.set_data(data);
    expect(number_field.get_data()).toBe(data);

    expect(() => new NumberField(1.5, 100)).toThrow(InvalidDataType);
})

test("NumberField.parse_input", () => {
    const input_1 = "10";
    const input_2 = 10;
    const field = new NumberField("field");

    expect(field.parse_input(input_1)).toBe(10);
    expect(field.parse_input(input_2)).toBe(10);
});

test("SliderField get_data and set_data", () => {
    const valid_data = 5;
    const invalid_data_not_integer = .5;
    const out_of_bound_1 = 101;
    const out_of_bound_2 = -1;
    let slider_field = new SliderField("test");

    slider_field.set_data(valid_data);
    expect(slider_field.get_data()).toBe(valid_data);

    expect(() => slider_field.set_data(invalid_data_not_integer)).toThrow(InvalidDataType);
    expect(() => slider_field.set_data(out_of_bound_1)).toThrow(OutOfBoundInteger);
    expect(() => slider_field.set_data(out_of_bound_2)).toThrow(OutOfBoundInteger);
    // @ts-expect-error
    expect(() => new SliderField("hello", "string")).toThrow(InvalidDataType);
})

test("SliderField.parse_input", () => {
    const input_1 = "10";
    const input_2 = 10;
    const field = new SliderField("field");

    expect(field.parse_input(input_1)).toBe(10);
    expect(field.parse_input(input_2)).toBe(10);
});

test("FractionField get_denominator and set_denominator", () => {
    const valid_denom = 1;
    const invalid_denom_1 = -10;
    const invalid_denom_2 = 2.5;
    let fraction_field = new FractionField("test");

    fraction_field.set_denominator(valid_denom);
    expect(fraction_field.get_denominator()).toBe(valid_denom);

    expect(() => fraction_field.set_denominator(invalid_denom_1)).toThrow(InvalidDenom);
    expect(() => fraction_field.set_denominator(invalid_denom_2)).toThrow(InvalidDenom);

    expect(() => new FractionField("test", 1, 1.6)).toThrow(InvalidDenom);

})

test("FractionField get_data and set_data", () => {
    //Any number is valid because the user might want to express theirself in a precise way
    const valid_data_1 = 1;
    const valid_data_2 = -10;
    const valid_data_3 = 100.5;
    let fraction_field = new FractionField("test");

    fraction_field.set_data(valid_data_1);
    expect(fraction_field.get_data()).toBe(valid_data_1);

    fraction_field.set_data(valid_data_2);
    expect(fraction_field.get_data()).toBe(valid_data_2);

    fraction_field.set_data(valid_data_3);
    expect(fraction_field.get_data()).toBe(valid_data_3);

    // @ts-expect-error
    expect(() => new FractionField("hello", "string")).toThrow(InvalidDataType);
})

test("FractionField.parse_input", () => {
    const input_1 = "10";
    const input_2 = 10;
    const field = new FractionField("field");

    expect(field.parse_input(input_1)).toBe(10);
    expect(field.parse_input(input_2)).toBe(10);
});