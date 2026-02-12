// values objects
import { UserEmail } from "../values-objects/UserEmail";
import { UserId } from "../values-objects/UserId";
import { UserName } from "../values-objects/UserName";
import { UserPassword } from "../values-objects/UserPassword";

// User.ts
export class User {
    private _id: UserId;
    name: UserName;
    email: UserEmail;
    password: UserPassword;

    get get_id(): UserId {
        return this._id;
    }

    set id(id: UserId) {
        this._id = id;
    }

    constructor(id: UserId, name: UserName, email: UserEmail, password: UserPassword) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public toPrimitives() {
        return {
            id: this._id.value,
            name: this.name.value,
            email: this.email.value
        };
    }
}