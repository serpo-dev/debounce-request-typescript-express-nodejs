import express from "express";
import { createDebounce } from "./helpers/debounce";
import { userController } from "./controllers/findUser";
import cors from "cors";

const app = express();
const port = 3001;

const TIMEOUT = 5000;

app.use(express.json());
app.use(cors());

const debounce = createDebounce();

app.post("/find_user", debounce(userController.findUser, TIMEOUT));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
