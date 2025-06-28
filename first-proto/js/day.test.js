import { Day } from "./day";

test("Day not undefined", () => {
    expect(new Day()).toBeInstanceOf(Day);
});