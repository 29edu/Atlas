import jwt from 'jsonwebtoken'
import express from 'express'

const jwtAuth = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // check header
        if(!authHeader || !authHeader.startsWith("Bearer: ")) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        // extract token
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user to request
        req.user = decoded;

        // move to controller
        next();
    } catch (error) {
        console.log("Error in jwt token", error)
        
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default jwtAuth;