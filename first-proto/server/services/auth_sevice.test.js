import { jest } from '@jest/globals';

const mockF = jest.fn(() => 2);
const mockAuthDAO = jest.fn(() => ({ f: mockF }));
jest.unstable_mockModule("../dao/auth_dao", () => ({
    AuthDAO: mockAuthDAO
}));


const { User } = await import("../data/auth");
const { AuthService, UnavailableUsername, InvalidUser } = await import("./auth_sevice");
const { AuthDAO } = await import("../dao/auth_dao");


const user_props = ["username", "password", "name"];
const invalid_sign_up_values = ["", null, undefined];

let auth_service = new AuthService();
const valid_username = "username";
const valid_password = "password";
const valid_name = "name";
const valid_user = new User({
    username: valid_username,
    password: valid_password,
    name: valid_name
});


beforeEach(() => {
    auth_service = new AuthService();
})

test("sign_up_user: success", () => {
    expect(() => auth_service.signup_user(valid_user)).not.toThrow(Error);
});

test("sign_up_user: throws UnavailableUsername", () => {
    expect(() => auth_service.signup_user(valid_user)).not.toThrow(Error);
    expect(() => auth_service.signup_user(valid_user)).toThrow(UnavailableUsername);
});

test.each([
    ["username", ""],
    ["username", null],
    ["username", undefined],
    ["password", ""],
    ["password", null],
    ["password", undefined],
    ["name", ""],
    ["name", null],
    ["name", undefined],
])("sign_up_user: throws InvalidUser (%s)", (property, value) => {
    const user = new User({
        username: valid_username,
        password: valid_password,
        name: valid_name
    });
    user[property] = value;
    expect(() => auth_service.signup_user(user)).toThrow(InvalidUser);
});
