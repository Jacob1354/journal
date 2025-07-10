/**
 * @jest-environment jsdom
 */

import { clear_element_children, move_child_node, place_elements_until_field1_max_then_field2 } from "./dom_utils";


test("clear_element", () => {
    const origin = document.createElement("div");
    const p = document.createElement("p");
    const a = document.createElement("a");
    origin.appendChild(p);
    origin.appendChild(a);

    clear_element_children(origin);

    expect(origin.childElementCount).toBe(0);

})


function mock_getBoundingClientRect(el = new HTMLElement) {
    el.getBoundingClientRect = () => {
        let height = 0;
        for(const child of el.children) {
            height += child.getBoundingClientRect().height;
        };
        return {
        width: 10,
        height: height,
        top: 0,
        left: 0,
        bottom: height,
        right: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
        };
    }
}

test("place_elements_until_field1_max_then_field2", () => {
    const elements = Array.from({ length: 10 }, () => {
        const el = document.createElement("div");
        el.getBoundingClientRect = () => ({
            width: 10,
            height: 100, //Only important part is height
            top: 0,
            left: 0,
            bottom: 100,
            right: 10,
            x: 0,
            y: 0,
            toJSON: () => {},
        });
        document.body.appendChild(el);
        return el;
    });

    const field_1 = document.createElement("div");
    mock_getBoundingClientRect(field_1);
    const field_2 = document.createElement("div");
    mock_getBoundingClientRect(field_2);
    const max_height = 400;

    place_elements_until_field1_max_then_field2(max_height, field_1, field_2, elements);

    expect(field_1.children.length).toBe(4);
    expect(field_2.children.length).toBe(6);
    
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