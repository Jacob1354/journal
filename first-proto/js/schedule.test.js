import { InvalidDataType } from "./clean_code_enforcement";
import * as Schedule from "./schedule"

test("Schedule construction", () => {
    const valid_array = [new Schedule.Activity(), new Schedule.Activity()];
    const invalid_array = [new Schedule.Activity(), "test", 1, 4, new Schedule.Activity()];

    expect(new Schedule.Schedule()).toBeInstanceOf(Schedule.Schedule);
    expect(new Schedule.Schedule(valid_array)).toBeInstanceOf(Schedule.Schedule);
    expect(() => new Schedule.Schedule(invalid_array)).toThrow(InvalidDataType);
});