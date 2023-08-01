const config = require("../config/auth");
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const cookie = req.headers.cookie;

    if(cookie === undefined){
        res.redirect("/auth/login");
        return;
    }

    const token = cookie.split('=')[1];
    
    if (!token) {
        res.redirect("/auth/login");
        return;
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, config.jwtSecret);
    
        // Attach the decoded token payload to the request object
        req.userId = decoded.userId;
    
        next();
    } catch (error) {
        res.redirect("/auth/login");
    }
};

const ensureLogOut = (req , res, next)=>{

    const cookie = req.headers.cookie;
    console.log(cookie);

    if(cookie === undefined){
        next();
        return;
    }

    const token = cookie.split('=')[1];
    console.log("token " , token);

    if (!token) {
        next();
        return;
    }

    res.redirect("/");

};

module.exports = {verifyToken , ensureLogOut};