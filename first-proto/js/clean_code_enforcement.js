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