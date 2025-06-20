import * as MoodField from "./mood_field";
import * as CCEnforcement from "./clean_code_enforcement";

class TestField extends MoodField.AbstractMoodField {}

test("Instanciating AbstractMoodField", () => {
    expect(() => MoodField.AbstractMoodField("").toThrow(CCEnforcement.AbstractClassInstanciated));
});

test("AbstractMoodFieldChild without set_data overriding", () => {
    let test_field = new TestField("Test");
    expect(() => test_field.set_data("").toThrow(CCEnforcement.AbstractFunctionNotOverriden));
});

