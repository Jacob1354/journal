import * as MoodField from "./mood_field";
import * as CCEnforcement from "./clean_code_enforcement";


/*
 * AbstractMoodField tests
*/
class TestField extends MoodField.AbstractMoodField {}

test("Instanciating AbstractMoodField", () => {
    expect(() => MoodField.AbstractMoodField("").toThrow(CCEnforcement.AbstractClassInstanciated));
});

test("AbstractMoodFieldChild without set_data overriding", () => {
    let test_field = new TestField("Test");
    expect(() => test_field.set_data("").toThrow(CCEnforcement.AbstractFunctionNotOverriden));
});


/*
 * Children classes tests
*/
test("TestField get_data and set_data", () => {
    const data = "this is a test";
    let text_field = new MoodField.TextField("test");
    text_field.set_data(data);
    expect(text_field.get_data()).toBe(data);

    expect(() => new MoodField.TextField("test", 100).toThrow(CCEnforcement.InvalidDataType));
})

test("NumberField get_data and set_data", () => {
    const data = 10;
    let number_field = new MoodField.NumberField("test");
    number_field.set_data(data);
    expect(number_field.get_data()).toBe(data);

    expect(() => new MoodField.NumberField(1.5, 100).toThrow(CCEnforcement.InvalidDataType));
})

test("SliderField get_data and set_data", () => {
    const valid_data = .5;
    const too_small_data = -1;
    const too_big_data = 100;
    let slider_field = new MoodField.SliderField("test");

    slider_field.set_data(valid_data);
    expect(slider_field.get_data()).toBe(valid_data);

    slider_field.set_data(too_small_data);
    expect(slider_field.get_data()).toBe(0);

    slider_field.set_data(too_big_data);
    expect(slider_field.get_data()).toBe(1);

    expect(() => new MoodField.SliderField("hello", "string").toThrow(CCEnforcement.InvalidDataType));
})

test("SliderField get_denominator and set_denominator", () => {
    const valid_denom = 1;
    const invalid_denom_1 = -10;
    const invalid_denom_2 = 2.5;
    let fraction_field = new MoodField.FractionField("test");

    fraction_field.set_denominator(valid_denom);
    expect(fraction_field.get_denominator()).toBe(valid_denom);

    expect(() => fraction_field.set_denominator(invalid_denom_1)).toThrow(MoodField.InvalidDenom);
    expect(() => fraction_field.set_denominator(invalid_denom_2)).toThrow(MoodField.InvalidDenom);

    expect(() => new MoodField.FractionField("test", 1, 1.6).toThrow(MoodField.InvalidDenom));

})

test("SliderField get_data and set_data", () => {
    //Any number is valid because the user might want to express theirself in a precise way
    const valid_data_1 = 1;
    const valid_data_2 = -10;
    const valid_data_3 = 100.5;
    let fraction_field = new MoodField.FractionField("test");

    fraction_field.set_data(valid_data_1);
    expect(fraction_field.get_data()).toBe(valid_data_1);

    fraction_field.set_data(valid_data_2);
    expect(fraction_field.get_data()).toBe(valid_data_2);

    fraction_field.set_data(valid_data_3);
    expect(fraction_field.get_data()).toBe(valid_data_3);

    expect(() => new MoodField.FractionField("hello", "string").toThrow(CCEnforcement.InvalidDataType));
})