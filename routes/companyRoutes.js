const express = require("express");
const jobContoller = require("../controllers/jobController");
const CompanyContoller = require("../controllers/companyController");
const applicationController = require("../controllers/applicationController");
const interviewController = require("../controllers/interviewController");

const companyRouter = express.Router();


companyRouter.put('/profile', CompanyContoller.update)


companyRouter.post('/job', jobContoller.create);
companyRouter.get('/job/all', jobContoller.getAll);
companyRouter.get('/job/:id', jobContoller.getById);
companyRouter.get('/job/all/:id', jobContoller.getByCompanyId);
companyRouter.delete('/job/:id', jobContoller.delete);
companyRouter.put('/job', jobContoller.update);


// companyRouter.get('/application/all/:jobId', applicationController.getAllByJobId);
companyRouter.get('/application/all/:companyId', applicationController.getAllByCompanyId);
companyRouter.put('/application/', applicationController.update);

companyRouter.post('/interview', interviewController.create)

module.exports = companyRouter;