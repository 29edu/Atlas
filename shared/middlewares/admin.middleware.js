
const adminMiddleware = (req, res, next) => {

    console.log("Checking for admin role...");

    if(req.user && req.user.role !=="admin") {
        
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins Only"
        })
    }

    next();

}

export {adminMiddleware};