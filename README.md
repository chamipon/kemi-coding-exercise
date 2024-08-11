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
      
