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

app.get("/tasks", (req, res) => {
	pool.connect()
		.then(() => {
			pool.query("SELECT * FROM tasks", (err, result) => {
				if (err) {
					console.error("Error executing query", err);
				} else {
					res.status(200).send(result.rows);
					console.log("Query result:", result.rows);
				}
			});
		})
		.catch((err) => {
			console.error("Error connecting to PostgreSQL database", err);
		});
});
app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
