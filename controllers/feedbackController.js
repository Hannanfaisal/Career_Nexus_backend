const Joi = require("joi");

const { mongodbIdRegex } = require("../utils");

const Feedback = require("../models/feedback");


const feedbackContoller = {

    async create(req, res, next) {

        const createSchema = Joi.object({
            rating: Joi.number().max(5).required(),
            description: Joi.string().required(),
            user: Joi.string().regex(mongodbIdRegex).required()
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

        let feedback;
        const { rating, description, user } = req.body;

        try {

           feedback = new Feedback({ rating, description, user })

           feedback = await feedback.save();

        } catch (error) {
            return next(error);

        }
        return res.status(201).json({ success: true, message: 'feedback posted', feedback })
    },


    async getAll(req, res, next) {

        let feedbacks;

        try {

            feedbacks = await Feedback.find();
            if (!feedbacks) {
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
        return res.status(200).json({ success: true, feedbacks })
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

        let feedback;
        const { id } = req.params;
        try {

            feedback = await Feedback.findOne({ _id: id });
            if (!feedback) {
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
        return res.status(200).json({ success: true, feedback })
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

        let feedback;
        const { id } = req.params;
        try {

            feedback = await Feedback.findOneAndDelete({ _id: id });
            if (feedback) {
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
        return res.status(200).json({ success: true, message: 'feedback deleted successfully' })
    },


    async update(req, res, next) {

        const updateSchema = Joi.object({
            rating: Joi.number().required(),
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

        let feedback;
        const { rating, description, id } = req.body;

        try {

            feedback = await Feedback.findOneAndUpdate({ _id: id }, { rating, description }, { new: true })

            if (!feedback) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'feedback not found'
                }
                return next(error)
            }

        } catch (error) {
            return next(error)
        }

        return res.status(200).json({ success: true, message: 'feedback updated', feedback })
    }



}


module.exports = feedbackContoller