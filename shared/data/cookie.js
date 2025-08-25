import { validate_type } from "../clean_code/clean_code_enforcement.js";

export class Cookie {
    constructor({name, value, path = null, http_only = true, secure = true, max_age = null}) {
        this.name = name;
        this.value = value;
        if(path)
            validate_type(path, "string");
        this.path = path;
        if(http_only)
            validate_type(http_only, "boolean");
        this.http_only = http_only;
        if(secure)
            validate_type(secure, "boolean");
        this.secure = secure;
        if(max_age)
            validate_type(max_age, "number");
        this.max_age = max_age;
    }

    toString() {
        const name_value = `${this.name}=${this.value};`;
        const path = this.path ? `Path=${this.path};` : ''; 
        const http_only = this.http_only ? `HttpOnly;` : ''; 
        const secure = this.secure ? `Secure;` : ''; 
        const max_age = this.max_age ? `Max-Age=${this.max_age};` : ''; 
        return name_value + path + max_age + http_only + secure;
    }
}