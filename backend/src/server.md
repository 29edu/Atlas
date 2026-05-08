# server.js

## What is it?

    server.js is the entry point of the Atlas backend.
    It creates the Express app, connects to MongoDB, registers all routes,
    and starts listening for HTTP requests.

## What happens when you run it

    1. Express app is created
    2. cors() middleware is added → allows frontend (different port) to call the API
    3. express.json() is added → parses JSON request bodies automatically
    4. await connectDB() → waits for MongoDB to connect before proceeding
    5. Routes are registered
    6. app.listen(5082) → server is ready to accept requests

## Why await connectDB()?

    If you start accepting requests before MongoDB is connected,
    the first few requests that hit the database will throw errors.
    Awaiting ensures the server is fully ready before opening to traffic.

    This works because server.js is a module with top-level await (ES modules).

## Routes

    app.use("/", authRoutes)    → /login, /signup
    app.use("/", productRoutes) → product-related endpoints

    Both are mounted at "/" which means their own route files define the paths.
    authRoutes defines /login and /signup internally.

## PORT

    The server runs on port 5082.
    Frontend is configured to call http://localhost:5082.

## cors()

    Without cors(), a browser will block requests from the frontend (port 5173)
    to the backend (port 5082) because they are on different ports (different origins).
    cors() tells the browser: "It's okay, I allow cross-origin requests."

## express.json()

    Without this, req.body is undefined.
    This middleware reads the raw request body and parses it as JSON,
    making it available as a JavaScript object at req.body.
