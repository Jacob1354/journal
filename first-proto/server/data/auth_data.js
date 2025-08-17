import { validate_type } from "../../shared/clean_code/clean_code_enforcement";

export class User {
    constructor({username, password, name = null}) {
        validate_type(username, "string");
        validate_type(password, "string");
        if(name != null)
            validate_type(name, "string");
        this.username = username;
        this.password = password;
        this.name = name;
    }
}
