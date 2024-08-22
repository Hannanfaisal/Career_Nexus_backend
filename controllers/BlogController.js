const Joi = require("joi");
const Blog = require("../models/blog");
const { mongodbIdRegex } = require("../utils");
const { response } = require("express");
const cloudinary = require("cloudinary").v2; 


 cloudinary.config({ 
    cloud_name: 'djr9uztln', 
    api_key: '494218467926964', 
    api_secret: '2qQxooezv-aYiYrJ4S9OFEOt_qA'
});

const BlogContoller = {

   async create(req,res,next){

    const createSchema = Joi.object({
        title: Joi.string().required(),
        photo: Joi.string().required(),
        category: Joi.string().required(),
        shortDescription:Joi.string().required(),
        description: Joi.string().required(),
        user: Joi.string().regex(mongodbIdRegex).required()
    })

    const validate = createSchema.validate(req.body);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let blog;
    const { title, photo, category, shortDescription, description, user } = req.body;
    
    try {

       let response = await cloudinary.uploader.upload(photo);
     
        blog = new Blog({title, photo:response.url, category, shortDescription, description, user}) 

        blog = await blog.save();
        
    } catch (error) {
        return next(error);
        
    }
    return res.status(201).json({success: true, message: 'Blog created', blog })
   },


   async getAll(req,res,next){


    let blogs;
   
    try {

        blogs = await Blog.find();
        if(!blogs){
            const error = {
                success: false,
                status: 404,
                message: 'Records not found'
            }
            return next(error)
        } 

        
    } catch (error) {
        return next(error);
        
    }
    return res.status(200).json({success: true, message: 'Success ', blogs })
   },


   async getById(req,res,next){

    const getByIdSchema = Joi.object({
       id: Joi.string().required()
    })

    const validate = getByIdSchema.validate(req.params);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let blog;
    const { id } = req.params;
    try {

        blog = await Blog.findOne({_id:id});
        if(!blog){
            const error = {
                success: false,
                status: 404,
                message: 'Records not found'
            }
            return next(error)
        } 

        
    } catch (error) {
        return next(error);
        
    }
    return res.status(200).json({success: true, message: 'Success', blog })
   },


   async delete(req,res,next){

    const deleteSchema = Joi.object({
       id: Joi.string().required()
    })

    const validate = deleteSchema.validate(req.params);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let blog;
    const { id } = req.params;
    try {

        blog = await Blog.findOneAndDelete({_id:id});
        if(!blog){
            const error = {
                success: false,
                status: 404,
                message: 'Records not found'
            }
            return next(error)
        } 

        
    } catch (error) {
        return next(error);
        
    }
    return res.status(200).json({success: true, message: 'Blog deleted successfully' })
   },


   async update(req,res,next){

    const updateSchema = Joi.object({
        title: Joi.string().required(),
        photo: Joi.string().required(),
        category: Joi.string().required(),
        shortDescription:Joi.string().required(),
        description: Joi.string().required(),
        id: Joi.string().regex(mongodbIdRegex).required()
    });

    const validate = updateSchema.validate(req.body);
    if(validate.error){
        const error = {
            success: false,
            status: 422,
            message: validate.error.message
        }
        return next(error)
    }

    let blog;
    const { title, photo, category, shortDescription, description, id } = req.body;

    try {

        blog = await Blog.findOneAndUpdate({_id: id}, {title, photo, category, shortDescription, description}, {new: true})

        if(!blog){
            const error = {
                success: false,
                status: 404,
                message: 'Blog not found'
            }
            return next(error)
        }
        
    } catch (error) {
        return next(error)
    }

    return res.status(200).json({success: true, message: 'Blog updated', blog})
   }



}


module.exports = BlogContoller