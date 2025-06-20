export class AbstractMoodField {
    #field_name;
    _data;

    constructor(field_name) {
        if(new.target instanceof AbstractMoodField) {
            throw new AbstractClassInstanciated(
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
        throw new AbstractFunctionNotOverriden(
            "No set_data method defined for this " + String(this.constructor)
        );
    }
}

export class TextField extends AbstractMoodField {
}

export class NumberField extends AbstractMoodField {
}

export class SliderField extends AbstractMoodField {
}

export class FractionField extends AbstractMoodField {
    constructor(field_name, denominator = 10) {
        super(field_name);
        denominator = denominator;
    }
}


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




