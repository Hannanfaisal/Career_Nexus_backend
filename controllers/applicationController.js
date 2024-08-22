
const Joi = require("joi");
const Application = require("../models/application");
const { mongodbIdRegex } = require("../utils");

const applicationController = {

    
    async create(req, res, next) {
        const createSchema = Joi.object({
            applicantId: Joi.string().regex(mongodbIdRegex).required(),
            jobId: Joi.string().regex(mongodbIdRegex).required(),
            companyId: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = createSchema.validate(req.body);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let application;
        const { applicantId, jobId, companyId } = req.body;

        try {

            let existingApplication = await Application.findOne({applicantId, jobId})

            if(existingApplication){
                const error = {
                    success: false,
                    status: 409,
                    message: 'Already applied'
                };
                return next(error)    
            }

            application = new Application({ applicantId, jobId, companyId});
            application = await application.save();
        } catch (error) {
            return next(error);
        }

        return res.status(201).json({ success: true, message: 'Application created', application });
    },

    
    // async getAll(req, res, next) {
    //     let applications;

    //     try {
    //         applications = await Application.find().populate('applicantId jobId');
    //         if (!applications) {
    //             const error = {
    //                 success: false,
    //                 status: 404,
    //                 message: 'Records not found'
    //             };
    //             return next(error);
    //         }
    //     } catch (error) {
    //         return next(error);
    //     }

    //     return res.status(200).json({ success: true, applications });
    // },


    async getAllById(req, res, next) {
        

        const getAllByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = getAllByIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let applications;
        const {id} = req.params;
        try {
            applications = await Application.find({applicantId: id }).populate('applicantId jobId companyId');
            if (applications.length <= 0) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Records not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, applications });
    },

    async getAllByJobId(req, res, next) {
        

        const getAllByJobIdSchema = Joi.object({
            jobId: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = getAllByJobIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let applications;
        const {jobId} = req.params;
        try {
            applications = await Application.find({jobId}).populate('applicantId jobId');
            if (applications.length <= 0) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Records not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, applications });
    },



    
    async getById(req, res, next) {
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = getByIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let application;
        const { id } = req.params;
        try {
            application = await Application.findById(id).populate('applicantId jobId');
            if (!application) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Application not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, application });
    },

    
    async getByJobId(req, res, next) {
        const getByJobIdSchema = Joi.object({
            jobId: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = getByJobIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let applications;
        const { jobId } = req.params;
        try {
            applications = await Application.find({ jobId }).populate('applicantId jobId');
            if(!applications) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Applications not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, applications });
    },

    async getAllByCompanyId(req, res, next) {
        const getAllByCompanyIdSchema = Joi.object({
            companyId: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = getAllByCompanyIdSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let applications;
        const { companyId } = req.params;
        try {
            applications = await Application.find({ companyId }).populate('applicantId jobId').sort({createdAt: -1});
            if(!applications) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Applications not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, applications });
    },



    async update(req, res, next) {
        const updateSchema = Joi.object({
            id: Joi.string().regex(mongodbIdRegex).required(),
            status: Joi.string().valid("pending", "approved", "rejected").optional(),
            interview: Joi.boolean().optional()
        });

        const validate = updateSchema.validate(req.body);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let application;
        const { id, status, interview } = req.body;

        try {
            application = await Application.findByIdAndUpdate(id, { status, interview }, { new: true }).populate('applicantId jobId');
            if (!application) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Application not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, message: 'Application updated', application });
    },

    
    async delete(req, res, next) {
        const deleteSchema = Joi.object({
            id: Joi.string().regex(mongodbIdRegex).required()
        });

        const validate = deleteSchema.validate(req.params);
        if (validate.error) {
            const error = {
                success: false,
                status: 422,
                message: validate.error.message
            };
            return next(error);
        }

        let application;
        const { id } = req.params;
        try {
            application = await Application.findByIdAndDelete(id);
            if (!application) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'Application not found'
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, message: 'Application deleted successfully' });
    }
}


module.exports = applicationController;