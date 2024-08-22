const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");
const subscriptionRoutes = express.Router();

subscriptionRoutes.get('/subscribe', subscriptionController.subscribe);

module.exports = subscriptionRoutes;