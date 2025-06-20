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
test("TestField get and set_data", () => {
    const data = "this is a test";
    let text_field = new MoodField.TextField("test");
    text_field.set_data(data);
    expect(text_field.get_data()).toBe(data);

    expect(() => new MoodField.TextField("test", 100).toThrow(CCEnforcement.InvalidDataType));
})

test("NumberField get and set_data", () => {
    const data = 10;
    let number_field = new MoodField.NumberField("test");
    number_field.set_data(data);
    expect(number_field.get_data()).toBe(data);

    expect(() => new MoodField.NumberField(1.5, 100).toThrow(CCEnforcement.InvalidDataType));
})