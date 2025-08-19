import { jest } from '@jest/globals';
import Database from 'better-sqlite3';
const { User } = await import("../data/auth_data");
import { UnavailableUsername } from '../dao/auth_dao';

const valid_username = "username";
const valid_password = "pwd";
const valid_name = "name";
const new_username = "jacob_username";
const new_password = "jacob_pwd";
const new_name = "jacob";
const new_user = new User({
    username: new_username,
    password: new_password,
    name: new_name
});
const preexisting_username = "serge_username";
const preexisting_password = "serge_pwd";
const preexisting_name = "serge";
const preexisting_user = new User({
    username: preexisting_username,
    password: preexisting_password,
    name: preexisting_name
});
const preexisting_user_session = "this is the session";
const invalid_user_session = "this is not the session";


const mock_get_user = jest.fn((username) => username === preexisting_user.username ? preexisting_user : false);
const mock_get_user_from_session = jest.fn((session) => session == preexisting_user_session ? preexisting_user : null);
const mock_add_user = jest.fn((user) => true);
const mock_add_session = jest.fn((user, session) => true);
const mockAuthDAO = jest.fn(() => ({ 
    get_user_from_session: mock_get_user_from_session,
    add_user: mock_add_user,
    get_user: mock_get_user,
    add_session: mock_add_session
}));
jest.unstable_mockModule("../dao/auth_dao", () => ({
    AuthDAO: mockAuthDAO
}));

const mockRandomBytes = jest.fn((bytes) => preexisting_user_session);
jest.unstable_mockModule('crypto', () => ({
    randomBytes: mockRandomBytes
}));

const { AuthService, InvalidUser, UserNotFound, InvalidPassword, InvalidSession } = await import("./auth_sevice");
const { AuthDAO } = await import("../dao/auth_dao");
const { randomBytes } =  await import('crypto');

const db = new Database(":memory:");
let auth_service = new AuthService(db);


beforeEach(() => {
    auth_service = new AuthService(db);
})


test("sign_up_user: success", () => {
    expect(() => auth_service.signup_user(new_user)).not.toThrow(Error);
});
test("sign_up_user: throws UnavailableUsername", () => {
    expect(() => auth_service.signup_user(preexisting_user)).toThrow(UnavailableUsername);
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


test("sign_in_user: success", () => {
    let session;
    expect(() => session = auth_service.signin_user(preexisting_user)).not.toThrow(Error);
    expect(session).toBe(preexisting_user_session);
});
test("sign_in_user: user_not_found", () => {
    expect(() => auth_service.signin_user(new_user)).toThrow(UserNotFound);
});
test("sign_in_user: invalid_password", () => {
    const preexisting_user_with_invalid_pwd = new User({
        username: preexisting_user.username,
        password: "not this password " + preexisting_user.password,
        name: preexisting_user.name
    })
    expect(() => auth_service.signin_user(preexisting_user_with_invalid_pwd)).toThrow(InvalidPassword);
});


test("authenticate_session: success", () => {
    let user;
    expect(() => user = auth_service.authenticate_session(preexisting_user_session)).not.toThrow(Error);
    expect(user).toEqual(preexisting_user);
});
test("authenticate_session: InvalidSession", () => {
    expect(() => auth_service.authenticate_session(invalid_user_session)).toThrow(InvalidSession);
});