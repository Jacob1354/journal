import { AbstractClassInstanciated, AbstractFunctionNotOverriden, validate_type, validate_integer, InvalidDataType} from "../clean_code/clean_code_enforcement.js";

export class AbstractMoodField {
    #field_name;
    _data;

    constructor(field_name) {
        if(new.target === AbstractMoodField) {
            throw new AbstractClassInstanciated(
                "Cannot initiate AbstactMoodField since it's an abstract class"
            );
        }
        validate_type(field_name, "string");
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
        throw new AbstractFunctionNotOverriden(
            "No set_data method defined for this " + String(this.constructor)
        );
    }

    parse_input(value){}

    update_from_input(value) {
        this.set_data(this.parse_input(value));
    }
}

export class TextField extends AbstractMoodField {
    constructor(field_name, data="Write here") {
        super(field_name);
        this.set_data(data);
    }

    set_data(new_data) {
        validate_type(new_data, "string");
        this._data = new_data;
    }
    
    parse_input(value) {
        return String(value);
    }
}

export class NumberField extends AbstractMoodField {
        constructor(field_name, data=0) {
        super(field_name);
        this.set_data(data);
    }

    set_data(new_data) {
        validate_integer(new_data);
        this._data = new_data;
    }

    parse_input(value) {
        return Number(value);
    }
}

export class SliderField extends AbstractMoodField {
    constructor(field_name, data=0) {
        super(field_name);
        this.set_data(data);
    }
    
    set_data(new_data) {
        validate_integer(new_data, 0, 100);
        this._data = new_data;
    }
    
    parse_input(value) {
        return Number(value);
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
        validate_type(new_data, "number");
        this._data = new_data;
    }
    
    get_denominator() {
        return this.#denom;
    }

    set_denominator(new_denom) {
        try {
            validate_integer(new_denom);
        } catch (err) {
            if(err instanceof InvalidDataType)
                throw new InvalidDenom("Denom must be an integer");
            else
                throw err;
        }
        if(new_denom < 1)
            throw new InvalidDenom("Denom must be bigger or equal to zero");
        this.#denom = new_denom;
    }
    
    parse_input(value) {
        return Number(value);
    }
}

export class InvalidDenom extends Error {
    constructor(msg) {
        super(msg);
        this.name = "InvalidDenom";
    }
}





