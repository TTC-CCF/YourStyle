import express from "express";

let app = express();

app.get("/healthcheck", (req, res) => {
    res.send("OK");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});