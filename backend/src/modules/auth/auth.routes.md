# auth.routes.js

## What is it?

    Routes define which URL + method maps to which controller function.
    This file sets up the two authentication endpoints.

## Endpoints

    POST /login    → login() in auth.controller.js
    POST /signup   → signUp() in auth.controller.js

## timeLog Middleware

    const timeLog = (req, res, next) => {
        console.log("Time: ", new Date().toLocaleString());
        next();
    }
    router.use(timeLog);

    This runs before every route in this router.
    It logs the time of every auth request for debugging.
    next() is required — without it the request hangs and never reaches the controller.

## How routes connect to the app

    In server.js:
        app.use("/", authRoutes);

    So the full URLs become:
        POST http://localhost:5082/login
        POST http://localhost:5082/signup

## How a Request Flows

    1. Client sends POST /signup with body { firstName, lastName, email, password }
    2. Express matches this to the /signup route
    3. timeLog fires and logs the time
    4. next() is called → signUp() in auth.controller.js runs
    5. Controller validates, hashes, saves, responds
