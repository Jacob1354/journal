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

export function validate_integer(value) {
    validate_primitive_type(value, "number");
    if(!Number.isInteger(value)) {
        throw new InvalidDataType("This value isn't an integer");
    }
    return true;
}


export class InvalidDataType extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDataType"
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