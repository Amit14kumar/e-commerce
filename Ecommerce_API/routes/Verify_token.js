const jwt = require("jsonwebtoken");

const jwtSecret = "amit14kumar";

// Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    console.log("Auth Header: ", authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token: ", token);
        jwt.verify(token,jwtSecret, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

// Verify Token and Authorization
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

// Verify Token and Admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Admin access required!");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
