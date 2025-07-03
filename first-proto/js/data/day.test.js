import { Day } from "./day";

test("Day not undefined", () => {
    const valid_day = new Day();
    expect(valid_day).toBeInstanceOf(Day);
    expect(valid_day.date).toBeDefined();
    expect(valid_day.mood_fields).toBeDefined();
    expect(valid_day.schedule).toBeDefined();
});