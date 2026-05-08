# auth.model.js

## What is it?

    This file defines the shape of a User in the database.
    It tells MongoDB: "Every user document must look like this."

    In Mongoose, you first define a Schema (the shape),
    then create a Model from it (the tool for reading/writing).

## The Schema Fields

    firstName
        - Required, string
        - Min 3 characters, Max 20 characters
        - If someone sends "Ed" as a first name → Mongoose rejects it automatically

    lastName
        - Same constraints as firstName

    email
        - Required, unique (no two users can share an email)
        - Always stored in lowercase (lowercase: true)
        - Must match email format using regex: /^\S+@\S+\.\S+$/
        - "not@valid" passes but "notvalid" fails

    password
        - Required, min 6 characters
        - Stored as a bcrypt hash, NEVER the plain password
        - The hashing happens in auth.controller.js before calling User.create()

## timestamps: true

    Mongoose automatically adds two fields to every document:
        createdAt  - when the user registered
        updatedAt  - when the user record was last changed

    You don't have to add these manually. Mongoose handles it.

## The Model

    const User = mongoose.model("User", userSchema);

    "User" is the collection name MongoDB uses (stored as "users" in DB).
    You use this model to:
        User.create({ ... })       - create a new user
        User.findOne({ email })    - find one user by email
        User.findById(id)          - find user by MongoDB _id

## Why is password hashed?

    If the database is ever stolen or leaked,
    plain passwords let attackers log into every user's account everywhere
    (because people reuse passwords).

    Bcrypt turns "mypassword123" into "$2b$10$X7Yz..."
    This hash cannot be reversed. To verify it you compare:
        bcrypt.compare(inputPassword, storedHash)
