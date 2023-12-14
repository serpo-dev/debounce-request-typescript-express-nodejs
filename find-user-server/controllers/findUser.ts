import { readFileSync } from "fs";
import { Request, Response } from "express";
import { findUsers } from "../helpers/findSubstring";
import { errors } from "../errors";
import { UserData } from "../types/interfaces";
import { validateEmail, validateNumber } from "../helpers/validators";

class UserController {
    static DB_PATH = "./services/db.json";

    findUser(req: Request, res: Response) {
        let db: UserData[];

        try {
            const json = readFileSync(UserController.DB_PATH, "utf-8");
            db = JSON.parse(json);
        } catch {
            const { status, message } = errors["internal_error"];
            return res.status(status).json({ message });
        }

        const { email, number } = req.body;

        if (!email) {
            const { status, message } = errors["no_email"];
            return res.status(status).json({ message });
        } else if (!validateEmail(email)) {
            const { status, message } = errors["email_validation_failure"];
            return res.status(status).json({ message });
        } else if (number && !validateNumber(number)) {
            const { status, message } = errors["number_validation_failure"];
            return res.status(status).json({ message });
        }

        try {
            const foundResults = findUsers(db, { email, number });
            return res.status(200).json(foundResults);
        } catch {
            const { status, message } = errors["internal_error"];
            return res.status(status).json({ message });
        }
    }
}

export const userController = new UserController();
