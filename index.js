require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.API_PORT || 8888;
const pool = new Pool({
	user: process.env.POSTGRES_USER || "postgres",
	password: process.env.POSTGRES_PWD || "admin",
	host: process.env.POSTGRES_HOST || "localhost",
	port: process.env.POSTGRES_PORT || "5432",
	database: process.env.POSTGRES_DB || "mydatabase",
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

app.get("/tasks", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM tasks");
		res.status(200).send(result.rows);
		console.log("Query result:", result.rows);
	} catch (err) {
		console.error("Error executing query", err);
		res.status(500).send("Error executing query");
	}
});

app.get("/tasks/:id", async (req, res) => {
	var id = req.params.id;
	if (id) {
		try {
			const result = await pool.query(`SELECT * FROM tasks WHERE id = ${id}`);
			res.status(200).send(result.rows);
			console.log("Query result:", result.rows);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send("Error executing query");
		}
	} else {
		res.status(400).send("Invalid request");
		console.error("Invalid request");
	}
});

app.delete("/tasks/:id", async (req, res) => {
	var id = req.params.id;
	if (id) {
		try {
			const result = await pool.query(`DELETE FROM tasks WHERE id = ${id}`);
			res.status(204).send(result.rows);
			console.log("Task deleted:", id);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	} else {
		res.status(400).send();
		console.error("Invalid request: Empty Parameters");
	}
});

app.post("/tasks", async (req, res) => {
	var task = req.body;
	if (task && task.title && task.status) {
		try {
			const result = await pool.query(
				"INSERT INTO tasks(title,description,status) VALUES($1,$2,$3) RETURNING *",
				[task.title, task.description, task.status.toLowerCase()]
			);
			console.log("Task created:", result.rows[0]);
			res.status(201).send(result.rows[0]);
		} catch (err) {
			console.error("Error querying the postgres pool: ", err);
			res.status(400).send(err);
		}
	} else {
		res.status(400).send("Invalid request body");
		console.error("Invalid request", req);
	}
});

app.put("/tasks/:id", async (req, res) => {
	var id = req.params.id;
	var task = req.body;
	if (id) {
		var queryString = taskUpdateQueryString(id, task);
		// Turn req.body into an array of values
		var colValues = Object.keys(req.body).map(function (key) {
			return key != "status" ? req.body[key] : req.body[key].toLowerCase();
		});
		//Add todays date to the end of the col values for the updated_at value.
		colValues.push(new Date());

		try {
			const result = await pool.query(queryString, colValues);
			res.status(200).send(result.rows);
			console.log("Task updated:", result.rows[0]);
		} catch (err) {
			console.error("Error executing query", err);
			res.status(500).send(err);
		}
	} else {
		res.status(400).send("Invalid request");
		console.error("Invalid request, empty body or id", task, id);
	}

	function taskUpdateQueryString(id, cols) {
		// Setup static beginning of query
		var query = ["UPDATE tasks"];
		query.push("SET");

		// Create another array storing each set command
		// and assigning a number value for parameterized query
		var set = [];
		Object.keys(cols).forEach(function (key, i) {
			set.push(key + " = ($" + (i + 1) + ")");
		});

		//Always add the updated_at field to the list of updated fields
		set.push("updated_at = ($" + (set.length + 1) + ")");

		query.push(set.join(", "));

		// Add the WHERE statement to look up by id
		query.push("WHERE id = " + id);

		//Return the updated task
		query.push("RETURNING *");

		// Return a complete query string
		return query.join(" ");
	}
});
app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
