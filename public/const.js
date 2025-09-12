//POP UP
export const POP_UP_CLASS = "pop_up";
export const ERROR_CLASS = "error";

//OTHER
export const CONTENT_WRAPPER_CLASS = "content_wrapper";
export function validate_form(form) {
    const inputs = form.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++)
        if (inputs[i].value.trim() === "")
            return false;

    return true;
}
