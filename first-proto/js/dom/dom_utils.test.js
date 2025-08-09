/**
 * @jest-environment jsdom
 */

import { clear_children_of, get_parent_with_selector, move_child_node, replace_children_of } from "./dom_utils";


test("clear_element", () => {
    const origin = document.createElement("div");
    const p = document.createElement("p");
    const a = document.createElement("a");
    origin.appendChild(p);
    origin.appendChild(a);

    clear_children_of(origin);

    expect(origin.childElementCount).toBe(0);

})


test("replace_children_of", () => {
    const parent = document.createElement("div");
    const old_child_1 = document.createElement("div");
    old_child_1.id = "old_child_1";
    const old_child_2 = document.createElement("div");
    old_child_2.id = "old_child_2";
    const new_child_1 = document.createElement("div");
    new_child_1.id = "new_child_1";
    const new_child_2 = document.createElement("div");
    new_child_2.id = "new_child_2";
    const new_children = [new_child_1, new_child_2];

    parent.appendChild(old_child_1);
    parent.appendChild(old_child_2);

    replace_children_of(parent, new_children);
    expect(parent.querySelector('#old_child_1')).toBe(null);
    expect(parent.querySelector('#old_child_2')).toBe(null);
    expect(parent.querySelector('#new_child_1')).not.toBe(null);
    expect(parent.querySelector('#new_child_2')).not.toBe(null);
});

test("move_child_node", () => {
    const field_1 = document.createElement("div");
    const field_2 = document.createElement("div");
    const child = document.createElement("div");

    field_1.appendChild(child);
    move_child_node(child, field_2);
    expect(field_1.firstChild).toBe(null);
    expect(field_2.firstChild).toBe(child);
});

test("error_pop_up", () => {
    throw new Error("Not implemented, yet");
});