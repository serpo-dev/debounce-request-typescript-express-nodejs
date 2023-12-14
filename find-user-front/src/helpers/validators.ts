export function validateEmail(email: string): boolean {
    try {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } catch {
        return false;
    }
}

export function validateNumber(value: number) {
    try {
        const stringValue: string = String(value);
        const parsedNumber: number = parseInt(stringValue, 10);

        if (!isNaN(parsedNumber) && stringValue.length === 6) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}
