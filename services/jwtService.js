const jwt = require("jsonwebtoken")
const { JWT_SECRET_KEY } = require("../config")

const jwtService = {

    signToken(payload, expiry){
       return jwt.sign(payload, JWT_SECRET_KEY,{expiresIn: expiry})
    },

    verifyToken(token){
       return jwt.verify(token, JWT_SECRET_KEY)
    }

}

module.exports = jwtService;