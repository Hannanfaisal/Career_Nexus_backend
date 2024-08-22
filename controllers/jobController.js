const Joi = require("joi");

const { mongodbIdRegex } = require("../utils");
const Job = require("../models/job");


const jobContoller = {

    async create(req, res, next) {

        const createSchema = Joi.object({
            title: Joi.string().required(),
            type: Joi.string().valid("fullTime", "partTime", "freelance", "internship").required(),
            location: Joi.string().valid("onsite", "remote", "hybrid").required(),
            level: Joi.string().valid("fresher", "intermediate", "expert").required(),
            skills: Joi.array().items(Joi.string().required()).required(),
            vacancy: Joi.number().required(),
            experience: Joi.number().optional(),
            description: Joi.string().required(),
            company: Joi.string().regex(mongodbIdRegex).required()
       })

        const validate = createSchema.validate(req.body);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            }
            return next(error)
        }

        let job;
        const { title, location,type, level, skills, vacancy, experience, description, company } = req.body;

        try {

           job = new Job({ title, location, type, level, skills, vacancy, experience, description, company })

           job = await job.save();

        } catch (error) {
            return next(error);

        }
        return res.status(201).json({ success: true, message: 'Job created', job })
    },


    async getAll(req, res, next) {

        let jobs;

        try {

            jobs = await Job.find().populate('company').sort({createdAt:-1});
            if (!jobs) {
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
        return res.status(200).json({ success: true, jobs })
    },


    async getById(req, res, next) {

        const getByIdSchema = Joi.object({
            id: Joi.string().required()
        })

        const validate = getByIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            }
            return next(error)
        }

        let job;
        const { id } = req.params;
        try {

            job = await Job.findOne({ _id: id });
            if (!job) {
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
        return res.status(200).json({ success: true, job })
    },


    async getByCompanyId(req, res, next) {

        const getByCompanyIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdRegex).required()
        })

        const validate = getByCompanyIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            }
            return next(error)
        }

        let jobs;
        const { id } = req.params;
        try {

            jobs = await Job.find({ company: id });
            if (!jobs) {
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
        return res.status(200).json({ success: true, jobs })
    },


    async delete(req, res, next) {

        const deleteSchema = Joi.object({
            id: Joi.string().required()
        })

        const validate = deleteSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            }
            return next(error)
        }

        let job;
        const { id } = req.params;
        try {

            job = await Job.findOneAndDelete({ _id: id });
            if (job) {
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
        return res.status(200).json({ success: true, message: 'Job deleted successfully' })
    },


    async update(req, res, next) {

        const updateSchema = Joi.object({
            title: Joi.string().required(),
            type: Joi.string().valid("onsite", "remote", "hybrid").required(),
            level: Joi.string().valid("fresher", "intermediate", "expert").required(),
            skills: Joi.array().items(Joi.string().required()).required(),
            vacancy: Joi.number().required(),
            experience: Joi.number().optional(),
            description: Joi.string().required(),
            id: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = updateSchema.validate(req.body);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            }
            return next(error)
        }

        let job;
        const { title, type, level, skills, vacancy, experience, description, id } = req.body;

        try {

            job = await Job.findOneAndUpdate({ _id: id }, { title, type, level, skills, vacancy, experience, description, }, { new: true })

            if (!job) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Job not found'
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        return res.status(200).json({ success: true, message: 'Job updated', job })
    }



}


module.exports = jobContoller