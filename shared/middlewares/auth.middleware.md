# auth.middleware.js

## What is it?

    A middleware is a function that runs between receiving a request and executing the controller.
    authMiddleware checks: "Is this user logged in and who are they?"

    Think of it like a bouncer at a club.
    The bouncer checks your wristband (token) before letting you in.
    If you have no wristband or a fake one → you're denied at the door.
    If it's real → you walk in and the staff (controller) helps you.

## Why is it needed?

    Some routes are protected — only logged-in users can access them.
    Without middleware, anyone could call POST /create-order without being logged in.

    authMiddleware sits in front of protected routes and handles this automatically.
    The controller never needs to check tokens — middleware already did.

## How it works

    Step 1: Check Authorization header
        Every protected request must include:
            Authorization: Bearer eyJhbGci...

        If missing or doesn't start with "Bearer " → return 401 Unauthorized.

    Step 2: Extract the token
        Split "Bearer eyJhbGci..." on the space → take index [1]

    Step 3: Verify the token
        jwt.verify(token, JWT_SECRET) decodes and validates the token.
        If the token is expired or was tampered with → throws an error.

    Step 4: Attach user to req
        req.user = { id: decoded.id, email: decoded.email }
        Every controller that runs after this can read req.user.id to know who made the request.

    Step 5: Call next()
        Passes control to the actual controller.

## Errors it handles

    No Authorization header     → 401 "Token missing"
    Token expired               → 401 "Token expired. Please login again."
    Token invalid or tampered   → 401 "Invalid or expired token"

## How to use it in a route

    import authMiddleware from '../../shared/middlewares/auth.middleware.js';

    router.post("/create-order", authMiddleware, createOrder);

    authMiddleware runs first. If it calls next(), createOrder runs.
    If authMiddleware sends a 401 response, createOrder never runs.

## JWT_SECRET

    Used to sign tokens at login (in auth.controller.js) and verify them here.
    Must be the same secret in both places. If they differ, all tokens fail.
    Read from environment variable: process.env.JWT_SECRET
    Falls back to "mysecretkey" in development — never use a hardcoded secret in production.
