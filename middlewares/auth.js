
const User = require("../models/user");
const jwtService = require("../services/jwtService");


const auth = async (req,res,next) =>{

    try {

        const token = req.cookies.token;
        console.log(token)

        if(!token){
            const error = {
                success: false,
                status: 401,
                message: 'Unauthorized'            
            }
            return next(error);
        }

        const id =  jwtService.verifyToken(token);
        req.user = id;
        
        next();
    
    } catch (error) {
        return next(error);
    }
 
    

}

module.exports = auth;
