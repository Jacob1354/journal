export class AbstractMoodField {
    #field_name;
    _data;

    constructor(field_name) {
        if(new.target instanceof AbstractMoodField) {
            throw new Error("Cannot initiate AbstactMoodField since it's an abstract class");
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
    set_data(new_data) {}
}

