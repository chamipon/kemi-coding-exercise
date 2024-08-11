require("dotenv").config();

//During the test the env variable is set to test
process.env.NODE_ENV = "test";
let PORT = process.env.API_PORT;
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = "localhost:" + PORT;
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Tasks", () => {
	/*
	 * Test the /GET route
	 */
	describe("/GET task", () => {
		it("it should GET all the tasks", (done) => {
			chai.request(server)
				.get("/tasks")
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					done();
				});
		});
	});
	describe("/POST task", () => {
		it("it should not POST without a title", (done) => {
			let task = {
				description: "Task description",
				status: "Pending",
			};
			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
		it("it should not POST with an incorrect status", (done) => {
			let task = {
				title: "task title",
				description: "Task description",
				status: "incorrect status",
			};
			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});
		it("it should POST a task ", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};
			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a("object");
					res.body.should.have.property("title");
					res.body.should.have.property("description");
					res.body.should.have.property("status");
					res.body.should.have.property("created_date");
					res.body.should.have.property("updated_at");
					done();
				});
		});
	});
	describe("/GET/:id task", () => {
		it("it should GET a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};

			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					task.id = res.body.id;
					chai.request(server)
						.get("/tasks/" + task.id)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a("object");
							res.body.should.have.property("id").eql(task.id);
							done();
						});
				});
		});
		it("it should not GET a task with unused ID", (done) => {
			chai.request(server)
				.get("/tasks/0")
				.end((err, res) => {
					res.should.have.status(404);
					res.text.should.eq("No task found with id 0");
					res.body.should.be.an("object").that.is.empty;
					done();
				});
		});
	});
	describe("/PUT/:id task", () => {
		it("it should PUT a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};
			let newtitle = "NEWTASKTITLE";
			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					task.id = res.body.id;
					chai.request(server)
						.put("/tasks/" + task.id)
						.send({
							title: newtitle,
						})
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a("object");
							res.body.should.have.property("id").eql(task.id);
							res.body.should.have.property("title").eql(newtitle);
							res.body.should.have
								.property("description")
								.eql(task.description);
							res.body.should.have.property("status").eql(task.status);
							done();
						});
				});
		});
		it("it should not PUT a task with unused ID", (done) => {
			chai.request(server)
				.put("/tasks/0")
				.end((err, res) => {
					res.should.have.status(404);
					res.text.should.eq("No task found with id 0");
					res.body.should.be.an("object").that.is.empty;
					done();
				});
		});
	});
	describe("/DELETE/:id task", () => {
		it("it should DELETE a task by the given id", (done) => {
			let task = {
				title: "Task title",
				description: "Task Description",
				status: "pending",
			};

			chai.request(server)
				.post("/tasks")
				.send(task)
				.end((err, res) => {
					task.id = res.body.id;
					chai.request(server)
						.delete("/tasks/" + task.id)
						.end((err, res) => {
							res.should.have.status(204);
							res.body.should.be.an("object").that.is.empty;
							done();
						});
				});
		});
		it("it should not DELETE a task with unused ID", (done) => {
			chai.request(server)
				.delete("/tasks/0")
				.end((err, res) => {
					res.should.have.status(404);
					res.text.should.eq("No task found with id 0");
					res.body.should.be.an("object").that.is.empty;
					done();
				});
		});
	});
});
