import * as CCEnforcement from "./clean_code_enforcement";


export class AbstractMoodField {
    #field_name;
    _data;

    constructor(field_name) {
        if(new.target instanceof AbstractMoodField) {
            throw new CCEnforcement.AbstractClassInstanciated(
                "Cannot initiate AbstactMoodField since it's an abstract class"
            );
        }
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
}

export class FractionField extends AbstractMoodField {
    constructor(field_name, denominator = 10) {
        super(field_name);
        denominator = denominator;
    }
}





