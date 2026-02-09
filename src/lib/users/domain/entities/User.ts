// values objects
import { UserEmail } from "../values-objects/UserEmail";
import { UserId } from "../values-objects/UserId";
import { UserName } from "../values-objects/UserName";
import { UserPassword } from "../values-objects/UserPassword";

// User.ts
export class User {
    id: UserId;
    name: UserName;
    email: UserEmail;
    password: UserPassword;

    public getId(): UserId {
        return this.id;
    }

    public setId(id: UserId): void {
        this.id = id;
    }

    constructor(name: UserName, email: UserEmail, password: UserPassword) {
        this.id = new UserId("");
        this.name = name;
        this.email = email;
        this.password = password;
    }
}