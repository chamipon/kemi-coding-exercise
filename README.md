# Kent & Essex Mutual Insurance Coding Exercise
## Project Setup
This project is implemented using PostgreSQL, Node.js and Express. Tests are written using Mocha and Chai.js
### Docker Setup
1. Clone this git repository `git clone https://github.com/chamipon/kemi-coding-exercise.git`
2. Navigate to the root of the project, and run `docker compose up --build`
3. When this command is done running, the api will be available on port 8888
### Manual Setup
#### PostgreSQL Database Setup
1. Download and install [PostgreSQL](https://www.postgresql.org/download/)
2. Connect to the PostgreSQL Databse Server
   - `psql -U prostgres` - This command connects to the PostgreSQL server using the user called 'postgres'
   - Enter the password for the `postgres` user. Note that the password is the one that you provided when you installed PostgreSQL in the first step.
   - After entering the correct password, you terminal should look like `postgres=#`
3. Create a database
   - `CREATE DATABASE kemi;` - This creates a new database called 'kemi'
     - The semicolon is important. This command should output `CREATE DATABASE`
   - `\c kemi` - Switch to the newly created database
   - Create the `tasks` table
      ```
      CREATE TYPE status AS ENUM ('pending','in progress','completed');
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status status,
        created_date DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      ```
   - Verify the creation of the table - `\d+ tasks`
#### Node.js Project Setup
1. Download & install [Node.js](https://nodejs.org/en/download/package-manager)
2. Clone this git repository `git clone https://github.com/chamipon/kemi-coding-exercise.git`
3. Navigate into the `kemi-coding-exercise` folder and run `npm i` to download the dependencies
4. Create a file called '.env' in the `kemi-coding-exercide` folder. In this file, copy in the environment variables listed below, and change them to whatever you used when setting up the database.
   ```
   POSTGRES_DB=kemi #The name of the PostgreSQL databse
   POSTGRES_PORT=5432 #The port the database is running on
   POSTGRES_HOST=localhost #The host the database is running on
   POSTGRES_USER=postgres #The user we are connecting to the database with
   POSTGRES_PWD=admin #The password for the user we are connecting with

   API_PORT=8000 #The port the API will be accessible from
   ```
5. Run `npm start` to start the server. You should see a message in the console similar to `Now listening on port 8000`.

## Documentation
### Database Schema
The database schema for this project is very simple, with only a single table.

| Name | Type |
| --- | --- |
| `id (Primary key)` | SERIAL |
| `Title` | VARCHAR(255) |
| `Description` | TEXT |
| `Status` | ENUM('pending','in progress','completed') |
| `Created_At` | DATE |
| `Updated_At` | TIMESTAMP |
### API Endpoints
#### POST /tasks
Sending a POST request to the /tasks endpoint will create a new task. 

**Request:** Should contain a `title`, `description` and `status`. The `id`, `created_date` and `updated_at` values will be automatically set.

**Reponse:** The response will contain the newly created task object.

201 - Successfully created task

400 - Invalid request

500 - Error executing query

<details>
<summary>Sample Request Body</summary>

```
{
    "title":"Task Title",
    "description": "Task Description",
    "status": "Pending"
}
```
</details>
<details>
<summary>Sample Response</summary>

```
   {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "status": "pending",
    "created_date": "2024-08-11T04:00:00.000Z",
    "updated_at": "2024-08-11T18:55:41.832Z"
   }  
```
</details>

#### GET /tasks
Sending a GET request to the /tasks endpoint will return a list of all tasks.

**Request:** This requires no request body.

**Reponse:** The response will contain all of the tasks in the database.

200 - Successful query

500 - Error executing query

<details>
<summary>Sample Response</summary>

```
   [
    {
        "id": 6,
        "title": "Title",
        "description": "Task Description",
        "status": "pending",
        "created_date": "2024-08-11T04:00:00.000Z",
        "updated_at": "2024-08-11T19:09:04.734Z"
    },
    {
        "id": 7,
        "title": "Title",
        "description": null,
        "status": "pending",
        "created_date": "2024-08-11T04:00:00.000Z",
        "updated_at": "2024-08-11T19:09:15.421Z"
    },
    {
        "id": 1,
        "title": "test",
        "description": "Task Description!",
        "status": "in progress",
        "created_date": "2024-08-11T04:00:00.000Z",
        "updated_at": "2024-08-11T19:11:06.519Z"
    }
   ]   
```
</details>

#### GET /tasks/:id
Sending a GET request to the /tasks/:id endpoint will return the task with the supplied id.

**Request:** This requires no request body.

**Reponse:** The response will contain the task with the matching id, if there is one.

200 - Successful query

404 - No task found with supplied ID

500 - Error executing query

<details>
<summary>Sample Response</summary>
   
```
    {
        "id": 6,
        "title": "Title",
        "description": "Task Description",
        "status": "pending",
        "created_date": "2024-08-11T04:00:00.000Z",
        "updated_at": "2024-08-11T19:09:04.734Z"
    }  
```
</details>

#### PUT /tasks/:id
Sending a PUT request to the /tasks/:id endpoint will update the task with the respective id.

**Request:** The request body should contain whatever fields need to be updated, with their new values. The `updated_at` field is updated with a current timestamp.

**Reponse:** The response will contain the updated task.

200 - Successful query

404 - No task found with supplied ID

500 - Error executing query

<details>
<summary>Sample Request Body</summary>

```
{
    "title":"Updated Title",
}
```
</details>

<details>
<summary>Sample Response</summary>
   
   ```
    {
        "id": 6,
        "title": "Updated Title",
        "description": "Task Description",
        "status": "pending",
        "created_date": "2024-08-11T04:00:00.000Z",
        "updated_at": "2024-08-11T19:09:04.734Z"
    }  
   ```
</details>

#### DELETE /tasks/:id
Sending a Delete request to the /tasks/:id endpoint will delete the task with the respective id.

**Request:** This requires no request body.

**Reponse:** The response will contain the updated task.

204 - Successfully deleted task

400 - Invalid request

404 - No task found with supplied ID

500 - Error executing query

### Running Tests
The tests are implemented with [Mocha](https://mochajs.org/) and [Chai.js](https://www.chaijs.com/). The tests are found in the `/test/task.js` file. 

To run the tests, run `npm test` in the root of the project while the server is running.
