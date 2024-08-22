const User = require("../models/user");
const Joi = require("joi")
const bcrypt = require("bcryptjs");
const jwtService = require("../services/jwtService");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");
const { JWT_SECRET_KEY } = require("../config");
const cookieParser = require("cookie-parser");


const authContoller = {

   async register(req,res,next){

    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(10).required(),
        role: Joi.string().valid("user", "company").required()
    })

    const validate = registerSchema.validate(req.body);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let user, existingUser;
    const { name, email, password, role } = req.body;
    try {

        if(role === 'user'){
            existingUser = await User.findOne({email});
        }
        else{
            existingUser = await Company.findOne({email});

        }

        if(existingUser){
            const error = {
                success: false,
                status: 409,
                message: 'User already exists'
            }
            return next(error);
        }

        
        const hashPassword = await bcrypt.hash(password, 10);

        if(role === 'user'){
            user = new User({
                name,
                email,
                password: hashPassword
            });
        }else{
            user = new Company({
                name,
                email,
                password: hashPassword
            });
        }

        user = await user.save();

       
       
        
    } catch (error) {
        return next(error);
        
    }
    return res.status(201).json({success: true, message: 'Success', user })
   },




   async login(req,res,next){

    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(10).required(),
        role: Joi.string().valid('user', 'company').required()
    })

    const validate = loginSchema.validate(req.body);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let user;
    let token;
    const {  email, password, role} = req.body;
    try {

        if(role === 'user'){
            user = await User.findOne({email});
        }
        else{
            user = await Company.findOne({email});
        }

     

        if(!user){
            const error = {
                success: false,
                status: 404,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found`
            }
            return next(error);
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match){
            const error = {
                success: false,
                status: 401,
                message: 'Password does not match'
            }
            return next(error); 
        }

        token = jwtService.signToken({_id:user._id},'30m');

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        })

        
    
    } catch (error) {
        return next(error);
        
    }
    return res.status(200).json({success: true, message: 'Login successfully', user, auth:true, token })
   },

   async logout(req,res,next){

    try {
        res.clearCookie("token");
       
    } catch (error) {
        return next(error)        
    }

    return res.status(200).json({success: true, message: 'Logout successfully', auth: false, user: null})
   },



   


}


module.exports = authContoller