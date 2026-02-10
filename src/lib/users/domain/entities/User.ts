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

    get id(): UserId {
        return this._id;
    }

    set id(id: UserId) {
        this._id = id;
    }

    constructor(name: UserName, email: UserEmail, password: UserPassword) {
        this._id = new UserId(this.generateRandomId());
        this.name = name;
        this.email = email;
        this.password = password;
    }

    private generateRandomId(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}