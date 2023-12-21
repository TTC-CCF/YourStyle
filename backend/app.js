import express from "express";
import "dotenv/config.js"

let app = express();

app.use(express.json());

import UserRouter from "./routers/UserRouter.js";
import PostRouter from "./routers/PostRouter.js";

app.get("/healthcheck", (req, res) => {
    res.send("OK");
});

app.use(`/api/${process.env.API_VERSION}/user`, UserRouter);
app.use(`/api/${process.env.API_VERSION}/post`, PostRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});