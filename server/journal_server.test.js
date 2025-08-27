import { jest } from "@jest/globals";
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

const {InvalidSession} = await import("./dao/auth_dao");
const {JournalServer} = await import("./journal_server");

const journal_srv = new JournalServer();

beforeAll(() => {
    jest.spyOn(AuthService.prototype, 'authenticate_session').mockImplementation(
        (session) => {
            if(session === valid_session)
                return user;
            else
                throw new InvalidSession();
        } 
    );
});

beforeEach(() => {
    received.status = null;
});

test("JournalServer.authenticate_session: success", () => {
    const res = MockResponse();
    expect(journal_srv.authenticate_session(valid_session, res)).toEqual(user);
});

test.each([undefined, invalid_session])
    ("JournalServer.authenticate_session: InvalidSession (session = %i)", 
        (session) => {
            const res = MockResponse();
            journal_srv.authenticate_session(session, res);
            expect(received).toEqual({status: 401});
        }
    );

test("JournalServer.authenticate_session: InternalServerError", () => {
    jest.spyOn(AuthService.prototype, 'authenticate_session').mockImplementation(
        (session) => {throw new Error("InternalServerError")} 
    );
    const res = MockResponse();
    journal_srv.authenticate_session(valid_session, res);
    expect(received).toEqual({status: 500});
});