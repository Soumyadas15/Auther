export class AuthError extends Error {
    constructor(public type: string, message?: string) {
        super(message);
        this.name = "AuthError";
    }
}