const express = require("express");

const app = express();
const PORT = process.env.PORT || 8888;

app.get("/", function (req, res) {
	res.sendFile("index.html", { root: __dirname });
});
app.get("/tasks", function (req, res) {});
app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
