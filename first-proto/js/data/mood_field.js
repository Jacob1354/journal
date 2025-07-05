import * as CCEnforcement from "../clean_code/clean_code_enforcement.js";

export class AbstractMoodField {
    #field_name;
    _data;

    constructor(field_name) {
        if(new.target === AbstractMoodField) {
            throw new CCEnforcement.AbstractClassInstanciated(
                "Cannot initiate AbstactMoodField since it's an abstract class"
            );
        }
        CCEnforcement.validate_type(field_name, "string");
        this.#field_name = field_name;
    }

    rename_field(new_field_name) {
        this.#field_name = new_field_name;
    }
    get_field_name() {
        return this.#field_name;
    }

    get_data() {
        return this._data;
    }
    set_data(new_data) {
        throw new CCEnforcement.AbstractFunctionNotOverriden(
            "No set_data method defined for this " + String(this.constructor)
        );
    }
}

export class TextField extends AbstractMoodField {
    constructor(field_name, data="Write here") {
        super(field_name);
        this.set_data(data);
    }

    set_data(new_data) {
        CCEnforcement.validate_type(new_data, "string");
        this._data = new_data;
    }
}

export class NumberField extends AbstractMoodField {
        constructor(field_name, data=0) {
        super(field_name);
        this.set_data(data);
    }

    set_data(new_data) {
        CCEnforcement.validate_integer(new_data);
        this._data = new_data;
    }
}

export class SliderField extends AbstractMoodField {
    constructor(field_name, data=0) {
        super(field_name);
        this.set_data(data);
    }

    set_data(new_data) {
        CCEnforcement.validate_type(new_data, "number");
        if(new_data < 0)
            this._data = 0;
        else if (new_data > 1)
            this._data = 1;
        else
            this._data = new_data; 
    }
}

export class FractionField extends AbstractMoodField {
    #denom;
    constructor(field_name, data = 0, denominator = 10) {
        super(field_name);
        this.set_denominator(denominator);
        this.set_data(data);
    }
    
    set_data(new_data) {
        //Number instead of integer, because the precision is up the user for maximal expressiveness
        CCEnforcement.validate_type(new_data, "number");
        this._data = new_data;
    }

    get_denominator() {
        return this.#denom;
    }

    set_denominator(new_denom) {
        try {
            CCEnforcement.validate_integer(new_denom);
        } catch (err) {
            if(err instanceof CCEnforcement.InvalidDataType)
                throw new InvalidDenom("Denom must be an integer");
            else
                throw err;
        }
        if(new_denom < 1)
            throw new InvalidDenom("Denom must be bigger or equal to zero");
        this.#denom = new_denom;
    }
}

export class InvalidDenom extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDenom";
    }
}





