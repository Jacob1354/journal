import { Cookie } from "./cookie.js";

test("Cookie.toString", ()=> {
    let cookie = new Cookie({
        name: "name",
        value: "value"
    })
    expect(String(cookie)).toBe("name=value;HttpOnly;Secure;");

    cookie = new Cookie({
        name: "name",
        value: "value",
        path:"/",
        max_age: 10,
        secure: false,
        http_only: false
    })
    expect(String(cookie)).toBe("name=value;Path=/;Max-Age=10;");
})