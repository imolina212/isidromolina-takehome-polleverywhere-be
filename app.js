const express = require("express");

const cors = require("cors");
const app = express();

const rafflesController = require("./controllers/rafflesController");

app.use(cors());
app.use(express.json());

app.use("/raffles", rafflesController);

app.get("/", (_, response) => {
	response.send("Raffle App service is running");
});

app.get("*", (_, response) => {
	response.send("404 Page not found");
});

module.exports = app;
