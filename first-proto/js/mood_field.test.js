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
 * Child class tests
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