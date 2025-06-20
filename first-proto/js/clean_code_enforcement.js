/*
 * Type enforcement
*/
export function validate_type(value, type) {
    if(typeof value !== type) {
        throw new InvalidDataType("This variable isn't a " + type);
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