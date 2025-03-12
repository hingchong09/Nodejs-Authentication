const jwt = require('jsonwebtoken');


const authMiddleware  = (req,res,next) => {
    const authheader = req.headers['authorization'];
    console.log(authheader);
    const token = authheader && authheader.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorised user'
        })
    }

    // decode this token
    try {
        const decodedTokenInfo = jwt.verify(token , process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);
        req.userInfo = decodedTokenInfo;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Access denied, no token provided!'
        })
    }

   
}

module.exports = authMiddleware;