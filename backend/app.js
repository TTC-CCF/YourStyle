import express from "express";
import UserRouter from "./routers/UserRouter.js";
import PostRouter from "./routers/PostRouter.js";
import dotenv from "dotenv";

dotenv.config({ path: "./secret/.env" });

let app = express();

app.use(express.json());

app.get("/healthcheck", (req, res) => {
    res.send("OK");
});

app.use(`/api/${process.env.API_VERSION}/user`, UserRouter);
app.use(`/api/${process.env.API_VERSION}/post`, PostRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});