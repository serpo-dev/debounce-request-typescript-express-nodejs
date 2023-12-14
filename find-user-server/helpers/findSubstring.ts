import { UserData } from "../types/interfaces";

export function findUsers(db: UserData[], search: UserData): UserData[] {
    const { email, number } = search;

    const emailRegex = new RegExp(email);
    if (!number) {
        return db.filter(({ email }) => emailRegex.test(email));
    }

    const numberRegex = new RegExp(String(number));
    return db.filter(
        ({ email, number }) =>
            emailRegex.test(email) && numberRegex.test(String(number))
    );
}
