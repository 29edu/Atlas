# auth.controller.js

## What is it?

    The controller handles what happens when a user hits an auth endpoint.
    It sits between the route (which defines the URL) and the database.

    Route receives the request → Controller processes it → Sends back a response.

## Two Functions

### signUp

    What it does:
        - Validates that firstName, lastName, email, password are all present
        - Checks if a user with that email already exists
        - Hashes the password using bcrypt
        - Creates the user in MongoDB
        - Generates a JWT token
        - Returns the user info + token to the frontend

    Why hash the password?
        If you store "mypassword123" and the database leaks,
        attackers get everyone's passwords. Bcrypt turns it into
        an unreadable hash that cannot be reversed.

        saltRound = 10 means bcrypt runs 2^10 = 1024 hashing rounds.
        More rounds = harder to crack, but slower to hash.
        10 is the standard balance.

    Response on success (200):
        {
            success: true,
            message: "User Created Successfully",
            data: {
                user: { id, firstName, lastName, email },
                token: "eyJhbG..."
            }
        }

    Errors handled:
        400 - Missing fields
        409 - User already exists (Conflict)
        400 - Mongoose ValidationError (e.g. email format wrong)
        500 - Unexpected server error

### login

    What it does:
        - Finds user by email
        - Compares the submitted password with the stored hash using bcrypt.compare()
        - If match → generates JWT token → sends user info + token

    Why bcrypt.compare() and not === ?
        The stored password is a hash, not the plain text.
        "mypassword123" !== "$2b$10$xyz..."
        bcrypt.compare() knows how to re-hash the input and check if they match.

    Errors handled:
        400 - Email not found
        401 - Password wrong (Unauthorized)
        500 - Server error

## generateToken()

    Creates a JWT (JSON Web Token) signed with JWT_SECRET.
    The token contains: { id: userId, email: email }
    Expires in 1 hour.

    This token is sent to the frontend. The frontend stores it (usually localStorage).
    On future requests, the frontend sends it in the Authorization header.
    authMiddleware.js reads and verifies this token on protected routes.

## Why is the token sent to the frontend?

    HTTP is stateless. After login, the server forgets who you are.
    The token proves to the server on every future request:
        "I am user abc123 with email user@gmail.com, I logged in 10 minutes ago."
