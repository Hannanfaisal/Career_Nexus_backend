const mongoose = require("mongoose");
const { CONNECTION_STRING } = require("../config");


const dbConnection = async() =>{

    try {
       const conn = await mongoose.connect(CONNECTION_STRING)
       console.log(`Connected to host: ${conn.connection.host}`)
       
    } catch (error) {
       console.log(`Error is: ${error}`) 
    }
}

module.exports = dbConnection