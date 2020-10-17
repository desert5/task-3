export class IllegalArgumentException extends Error {
    constructor(name: string, value: string) {
        super("Illegal argument " + name + " passed with value " + value);
    }
}