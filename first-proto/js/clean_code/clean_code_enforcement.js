/*
 * Type enforcement
*/
export function validate_type(value, type) {
    if(typeof type === "string") {
        return validate_primitive_type(value, type);
    } else {
        return validate_class_type(value, type);
    }
}

function validate_primitive_type(value, type) {
    if(typeof value !== type) {
        throw new InvalidDataType("This variable isn't a " + type);
    }
    return true;
}

function validate_class_type(value, type) {
    if(!(value instanceof type)) {
        throw new InvalidDataType("This variable isn't a " + type);
    }
    return true;
}

export function validate_integer(value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    validate_primitive_type(value, "number");
    if(!Number.isInteger(value)) {
        throw new InvalidDataType("This value isn't an integer");
    }
    if(value < min) {
        throw new OutOfBoundInteger(`This integer cannot be smaller than ${min}`);
    }
    if(value > max) {
        throw new OutOfBoundInteger(`This integer cannot be bigger than ${max}`);
    }
    return true;
}

export class InvalidDataType extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDataType"
    }
}

export class OutOfBoundInteger extends Error {
    constructor(msg) {
        super(msg);
        this.name = "OutOfBoundInteger";
    }
}


/*
 * Abstraction enforcement
*/
export class AbstractFunctionNotOverriden extends Error {
    constructor(msg) {
        super(msg);
        this.name = "AbstractFunctionNotOverriden"
    }
}

export class AbstractClassInstanciated extends Error {
    constructor(msg) {
        super(msg);
        this.name = "AbstractClassInstanciated"
    }
}
