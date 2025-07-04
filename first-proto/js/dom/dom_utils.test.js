/**
 * @jest-environment jsdom
 */

import * as DOMUtils from "./dom_utils";


test("clear_element", () => {
    const origin = document.createElement("div");
    const p = document.createElement("p");
    const a = document.createElement("a");
    origin.appendChild(p);
    origin.appendChild(a);

    DOMUtils.clear_element_children(origin);

    expect(origin.childElementCount).toBe(0);

})