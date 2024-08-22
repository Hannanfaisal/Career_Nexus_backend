const express = require("express");
const BlogContoller = require("../controllers/BlogController");
const feedbackContoller = require("../controllers/feedbackController");
const auth = require("../middlewares/auth");
const applicationController = require("../controllers/applicationController");
const userController = require("../controllers/userController");
const jobContoller = require("../controllers/jobController");
const CompanyContoller = require("../controllers/companyController");


const userRouter = express.Router();


userRouter.put('/profile', userController.update);


userRouter.get('/job/all', jobContoller.getAll);

userRouter.post('/blog',BlogContoller.create);
userRouter.get('/blog/all',auth , BlogContoller.getAll);
userRouter.get('/blog/:id', BlogContoller.getById);
userRouter.delete('/blog/:id', BlogContoller.delete);
userRouter.put('/blog', BlogContoller.update);


userRouter.post('/feedback', feedbackContoller.create);
userRouter.get('/feedback/all', feedbackContoller.getAll);
// userRouter.get('/feedback/:id', BlogContoller.getById);
// userRouter.delete('/feedback/:id', BlogContoller.delete);


userRouter.post('/application', applicationController.create);
userRouter.get('/application/all/:id', applicationController.getAllById);
userRouter.get('/application/:id', applicationController.getById);



userRouter.delete('/application/:id', applicationController.delete);


userRouter.get('/company/all', CompanyContoller.getAll)






module.exports = userRouter