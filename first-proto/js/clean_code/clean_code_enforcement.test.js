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

