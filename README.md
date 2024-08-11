# Kent & Essex Mutual Insurance Coding Exercise
## Project Setup
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
        description VARCHAR(255),
        status status,
        created_date DATE NOT NULL DEFAULT CURRENT_DATE,
        updated_at DATE NOT NULL DEFAULT CURRENT_DATE
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
      
