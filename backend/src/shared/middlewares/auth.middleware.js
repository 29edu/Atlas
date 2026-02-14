import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

const authMiddleware = (req, res, next) => {

    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        // check if token exist or not
        if(!authHeader || !authHeader.startsWith("Bearer: ")) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        // extract token (remove "Bearer " prefi)
        const token = authHeader.split(" ")[1];

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user to request
        req.user =  {
            id: decoded.id,
            email: decoded.email,
        }

        // move to controller
        next();
    } catch (error) {
        console.log("Error in jwt token", error)

        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            })
        }
        
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export default authMiddleware;