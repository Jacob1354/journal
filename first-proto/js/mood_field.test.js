import * as MoodField from "./mood_field";

class TestField extends MoodField.AbstractMoodField {}

test("Instanciating AbstractMoodField", () => {
    expect(() => MoodField.AbstractMoodField("").toThrow(MoodField.AbstractClassInstanciated));
});

test("AbstractMoodFieldChild without set_data overriding", () => {
    let test_field = new TestField("Test");
    expect(() => test_field.set_data("").toThrow(MoodField.AbstractFunctionNotOverriden));
});