import { useCallback, useState } from "react";
import { UserData } from "./types/interfaces";
import { validateEmail, validateNumber } from "./helpers/validators";

function App() {
    const [email, setEmail] = useState<string>("");
    const [number, setNumber] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [foundList, setFoundList] = useState<UserData[]>([]);
    const [controller, setController] = useState<AbortController | null>(null);

    function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value: string = e.target.value;
        let newVal = "";

        let toggle = false;
        for (const k of value) {
            try {
                if (isNaN(parseInt(k))) continue;
                newVal += k;
                if (toggle) newVal += "-";
                toggle = !toggle;
            } catch {
                continue;
            }
        }

        if (newVal.length > 8) {
            newVal = newVal.slice(0, 8);
        }

        return setNumber(newVal);
    }

    const handleSubmit = useCallback(
        async (e: React.ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (controller !== null) controller.abort();

            const newController = new AbortController();
            setController(newController);

            if (number) {
                const stringifiedNumber = parseInt(number.split("-").join(""));
                if (
                    !validateNumber(stringifiedNumber) ||
                    Number.isNaN(stringifiedNumber)
                ) {
                    return setError("The given value is not a number.");
                }
            }
            if (!validateEmail(email)) {
                return setError("The given value is not an email.");
            }

            setError(null);
            setLoading(true);
            await fetch("http://localhost:3001/find_user", {
                signal: newController.signal,
                method: "POST",
                body: JSON.stringify({ email, number }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setFoundList(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch((error) => {
                    if (error.name !== "AbortError") {
                        setError(error.message);
                        setLoading(false);
                    }
                });
        },
        [controller, email, number]
    );

    return (
        <>
            <div className="paper">
                <div className="box">
                    {error && <div className="error">{error}</div>}

                    <form
                        onSubmit={handleSubmit}
                        method="POST"
                        action="http://localhost:3001/find_user"
                    >
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="number">Number</label>
                        <input
                            name="number"
                            id="number"
                            value={number}
                            onChange={handleNumberInput}
                        />
                        <button type="submit">Submit</button>
                    </form>

                    {loading && <div className="loading">Loading...</div>}

                    <h2>Found List:</h2>

                    {foundList.length === 0
                        ? "No results"
                        : `Found ${foundList.length} result${
                              foundList.length === 1 ? "" : "s"
                          }:`}

                    {foundList.map(({ email, number }) => (
                        <div className="result_box">
                            <b>Email: </b>
                            {email}
                            <br />
                            <b>Number: </b>
                            {number}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default App;
