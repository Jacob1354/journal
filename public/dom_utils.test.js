/**
 * @jest-environment jsdom
 */
import { ERROR_POP_UP_CLASS } from "./const";
import { clear_children_of, error_pop_up, get_parent_attribute, move_child_node, ParentNotFound, replace_children_of, UndefinedAttribute } from "./dom_utils";


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

test("get_parent_attribute", () => {
    const PARENT_CLASS = "parent_class";
    const ATTRIBUTE = "attribute";
    const VALUE = "value";
    const SELECTOR = "." + PARENT_CLASS;
    const child = document.createElement("div");
    const valid_parent_with_attribute = document.createElement("div");
    valid_parent_with_attribute.classList.add(PARENT_CLASS);
    valid_parent_with_attribute.setAttribute(ATTRIBUTE, VALUE);

    const valid_parent_without_attribute = document.createElement("div");
    valid_parent_without_attribute.classList.add(PARENT_CLASS);
    
    const invalid_parent = document.createElement("div");

    valid_parent_with_attribute.appendChild(child);
    expect(get_parent_attribute(child, SELECTOR, ATTRIBUTE))
        .toBeDefined;
    
    valid_parent_without_attribute.appendChild(child);
    expect(() => get_parent_attribute(child, SELECTOR, ATTRIBUTE))
        .toThrow(UndefinedAttribute);
    
    invalid_parent.appendChild(child);
    expect(() => get_parent_attribute(child, SELECTOR, ATTRIBUTE))
        .toThrow(ParentNotFound);
});

test("error_pop_up", async () => {
    const msg = "this is a msg";
    error_pop_up(msg);
    const pop_up_el = document.getElementsByClassName(ERROR_POP_UP_CLASS)[0];
    expect(pop_up_el).toBeDefined();
    expect(pop_up_el.children[0].innerText).toBe(msg);
    pop_up_el.children[1].click();
    expect(document.getElementsByClassName(ERROR_POP_UP_CLASS).length).toBe(0);
});