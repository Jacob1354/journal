import {
    validate_type,
    validate_integer,
    validate_array,
    validate_array_type,
    InvalidDataType,
    OutOfBoundInteger,
    ArrayContaintsInvalidDataType
} from "./clean_code_enforcement.js";

test("validate_type primitives test", () => {
    expect(validate_type("test", "string")).toBe(true);
    expect(() => validate_type(new String(1), "string")).toThrow(InvalidDataType);
    expect(() => validate_type(1, "string")).toThrow(InvalidDataType);
});

test("validate_type classes test", () => {
    expect(validate_type(new Map(), Map)).toBe(true);
    expect(() => validate_type(new String(1), Number)).toThrow(InvalidDataType);
    expect(() => validate_type(1, Number)).toThrow(InvalidDataType);
});

test("validate_integer test", () => {
    expect(validate_integer(10)).toBe(true);
    expect(() => validate_integer(new String(1))).toThrow(InvalidDataType);
    expect(() => validate_integer(1.5)).toThrow(InvalidDataType);
})
test("validate_integer out of bounds", () => {
    expect(validate_integer(10, 0, 100)).toBe(true);
    expect(() => validate_integer(-10, 0, 100)).toThrow(OutOfBoundInteger);
    expect(() => validate_integer(1000, -10, 0)).toThrow(OutOfBoundInteger);
})

test("validate_array", () => {
    const arr = [];
    const not_arr = 1;
    
    expect(() => validate_array(arr)).not.toThrow(InvalidDataType);
    expect(() => validate_array(not_arr)).toThrow(InvalidDataType);
});

test("validate_array_type", () => {
    const valid_str_arr = ["a", "b", "c", "d", "e"]; 
    const invalid_str_arr = ["a", "b", 1, new String(), "e"];

    expect(() => validate_array_type(valid_str_arr, "string")).not.toThrow(ArrayContaintsInvalidDataType);
    expect(() => validate_array_type(invalid_str_arr, "string")).toThrow(ArrayContaintsInvalidDataType);
});

