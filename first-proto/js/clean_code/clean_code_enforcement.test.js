import * as CCEnforcement from "./clean_code_enforcement";

test("validate_type primitives test", () => {
    expect(CCEnforcement.validate_type("test", "string")).toBe(true);
    expect(() => CCEnforcement.validate_type(new String(1), "string")).toThrow(CCEnforcement.InvalidDataType);
    expect(() => CCEnforcement.validate_type(1, "string")).toThrow(CCEnforcement.InvalidDataType);
});

test("validate_type classes test", () => {
    expect(CCEnforcement.validate_type(new Map(), Map)).toBe(true);
    expect(() => CCEnforcement.validate_type(new String(1), Number)).toThrow(CCEnforcement.InvalidDataType);
    expect(() => CCEnforcement.validate_type(1, Number)).toThrow(CCEnforcement.InvalidDataType);
});

test("validate_integer test", () => {
    expect(CCEnforcement.validate_integer(10)).toBe(true);
    expect(() => CCEnforcement.validate_integer(new String(1))).toThrow(CCEnforcement.InvalidDataType);
    expect(() => CCEnforcement.validate_integer(1.5)).toThrow(CCEnforcement.InvalidDataType);
})
test("validate_integer out of bounds", () => {
    expect(CCEnforcement.validate_integer(10, 0, 100)).toBe(true);
    expect(() => CCEnforcement.validate_integer(-10, 0, 100)).toThrow(CCEnforcement.OutOfBoundInteger);
    expect(() => CCEnforcement.validate_integer(1000, -10, 0)).toThrow(CCEnforcement.OutOfBoundInteger);
})

test("validate_array", () => {
    const arr = [];
    const not_arr = 1;
    
    expect(() => CCEnforcement.validate_array(arr)).not.toThrow(CCEnforcement.InvalidDataType);
    expect(() => CCEnforcement.validate_array(not_arr)).toThrow(CCEnforcement.InvalidDataType);
});

test("validate_array_type", () => {
    const valid_str_arr = ["a", "b", "c", "d", "e"]; 
    const invalid_str_arr = ["a", "b", 1, new String(), "e"];

    expect(() => CCEnforcement.validate_array_type(valid_str_arr, "string")).not.toThrow(CCEnforcement.ArrayContaintsInvalidDataType);

    expect(() => CCEnforcement.validate_array_type(invalid_str_arr, "string")).toThrow(CCEnforcement.ArrayContaintsInvalidDataType);
});

