import { Request, Response } from "express";

export function createDebounce() {
    let timeout: NodeJS.Timeout | undefined;

    return function debounce(
        controller: (req: Request, res: Response) => void,
        wait: number
    ) {
        return function (req: Request, res: Response) {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                controller(req, res);
            }, wait);
        };
    };
}
