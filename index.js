require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.API_PORT || 8888;
const pool = new Pool({
	user: process.env.POSTGRES_USER || "postgres",
	password: process.env.POSTGRES_PWD || "admin",
	host: process.env.POSTGRES_HOST || "localhost",
	port: process.env.POSTGRES_PORT || "5432",
	database: process.env.POSTGRES_DB || "mydatabase",
});

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
