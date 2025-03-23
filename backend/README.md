# Node.js PostgreSQL Server

This project is a simple Node.js server that connects to a PostgreSQL database. It uses Express for handling HTTP requests and pg for database interactions.

## Project Structure

```
node-postgres-server
├── src
│   ├── controllers
│   │   └── userController.js
│   ├── models
│   │   └── userModel.js
│   ├── routes
│   │   └── userRoutes.js
│   ├── config
│   │   └── dbConfig.js
│   ├── app.js
│   └── server.js
├── package.json
├── .env
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd node-postgres-server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your PostgreSQL connection string:
   ```
   DATABASE_URL=your_database_url
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The server will be running on `http://localhost:3000`.

## API Endpoints

- `POST /users` - Create a new user
- `GET /users` - Retrieve all users
- `GET /users/:id` - Retrieve a user by ID
- `PUT /users/:id` - Update a user by ID
- `DELETE /users/:id` - Delete a user by ID

## Contributing

Feel free to submit issues or pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.