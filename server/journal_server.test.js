import { jest } from "@jest/globals";
import { JournalServer } from "./journal_server";
import { User } from "../shared/data/user";
import { AuthService } from "./services/auth_sevice";

const received = {status: null};
const valid_session = "valid_session";
const invalid_session = "invalid_session";
const user = new User({
    username: "jacob"
});


const mockStatus = jest.fn(function (status) {received.status = status; return this});
const mockSend = jest.fn(() => {});
const MockResponse = jest.fn(() => ({
    status: mockStatus,
    send: mockSend
}));

const mockValidateType = jest.fn(() => true);
jest.unstable_mockModule("../shared/clean_code/clean_code_enforcement", () => ({
    validate_type: mockValidateType
}));
const {validate_type} = await import("../shared/clean_code/clean_code_enforcement");

const journal_srv = new JournalServer();

beforeAll(() => {
    jest.spyOn(AuthService.prototype, 'authenticate_session').mockImplementation(
        (session) => session === valid_session ? user : null 
    );
})


test("JournalServer.authenticate_session: success", () => {
    const res = MockResponse();
    expect(journal_srv.authenticate_session(valid_sesion, res)).toEqual(user);
});

test("JournalServer.authenticate_session: InvalidSession", () => {
    const res = MockResponse();
    journal_srv.authenticate_session(undefined, res);
    expect(received).toEqual({status: 401});
    journal_srv.authenticate_session(invalid_session, res);
    expect(received).toEqual({status: 401});
});

test("JournalServer.authenticate_session: InternalServerError", () => {
    const res = MockResponse();s
    journal_srv.authenticate_session(valid_session, res);
    expect(received).toEqual({status: 500});
});