export class UserName {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    public ensureValidName(){
        if (!this.value || this.value.trim() === '') {
            throw new Error('User name cannot be empty');
        }
    }
}