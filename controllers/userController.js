const Joi = require("joi");
const User = require("../models/user");
const { mongodbIdRegex } = require("../utils");

const userController = {

    async update(req, res, next) {

        const updateSchema = Joi.object({

            phone: Joi.string().optional(),
            photo: Joi.string().uri().optional(),
            address: Joi.string().optional(),
            link: Joi.array().items(Joi.string().optional()).optional(),
            description: Joi.string().optional(),
            experience: Joi.array().items(
                Joi.object({
                    title: Joi.string().required(),
                    company: Joi.string().required(),
                    location: Joi.string().required(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().optional(),
                    _id: Joi.string().optional()
                })
            ).optional(),
            education: Joi.array().items(
                Joi.object({
                    title: Joi.string().required(),
                    institute: Joi.string().required(),
                    startDate: Joi.date().required(),
                    endDate: Joi.date().optional()
                })
            ).optional(),
            skills: Joi.array().items(Joi.string().optional()).optional(),
            languages: Joi.array().items(Joi.string().optional()).optional().unique(),
            id: Joi.string().regex(mongodbIdRegex).required()
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

        const { id, phone, photo, address, link, description, experience,education, skills, languages } = req.body;

        let user;
        try {
            user = await User.findOneAndUpdate(
                { _id: id },
                { phone, photo, address, link, description, experience,education, skills, languages },
                { new: true } 
            );

            if (!user) {
                const error = {
                    success: false,
                    status: 404,
                    message: 'User not found'
                };
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        return res.status(200).json({ success: true, message: 'User updated', user });
    }
};

module.exports = userController;
