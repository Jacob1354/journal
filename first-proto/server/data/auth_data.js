import { validate_type } from "../../shared/clean_code/clean_code_enforcement";

export class User {
    constructor({username, password = null, hash = null, name = null}) {
        validate_type(username, "string");
        if(password != null)
            validate_type(password, "string");
        if(hash != null)
            validate_type(hash, "string");
        if(name != null)
            validate_type(name, "string");
        this.username = username;
        this.password = password;
        this.name = name;
        this.hash = hash;
    }
}
