const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {

        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error("Auth Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};
// =====================================================
// ADMIN ONLY
// =====================================================

const adminOnly = (req, res, next) => {

    if (
        !req.user ||
        req.user.role !== "admin"
    ) {

        return res.status(403).json({

            success: false,

            message:
                "Admin access required"

        });

    }

    next();

};

module.exports = {
    auth,
    adminOnly
};