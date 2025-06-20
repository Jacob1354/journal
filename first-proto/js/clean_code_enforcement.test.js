import * as CCEnforcement from "./clean_code_enforcement";

test("validate_type test", () => {
    expect(CCEnforcement.validate_type("test", "string")).toBe(true);
    expect(() => CCEnforcement.validate_type(new String(1), "string")).toThrow(CCEnforcement.InvalidDataType);
    expect(() => CCEnforcement.validate_type(1, "string")).toThrow(CCEnforcement.InvalidDataType);
});