# db.js

## What is it?

    db.js creates the connection between the backend and MongoDB.
    It exports one function: connectDB().
    Call this once when the server starts, and all Mongoose models work everywhere.

## How it works

    mongoose.connect('mongodb://localhost:27017/atlas')

    localhost:27017  - MongoDB is running locally on port 27017 (default)
    atlas            - The name of the database (will be created if it doesn't exist)

    Mongoose keeps this connection open for the lifetime of the server.
    Every User.create(), Order.find(), etc. uses this same connection.

## Why async/await?

    Connecting to MongoDB takes time (network call, even locally).
    async/await lets you wait for the connection before starting the server.

    In server.js:
        await connectDB();      // wait for DB to connect
        app.listen(PORT, ...);  // then start accepting requests

    If you skip the await and start listening immediately,
    the first few requests might fail because MongoDB isn't ready yet.

## Error Handling

    If MongoDB is not running or the connection fails:
        - console.error prints the error
        - The server continues running (but all DB operations will fail)

    In production you would want to exit the process here:
        process.exit(1)
    So that a process manager (like PM2) can restart it.
