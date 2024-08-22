
const errorHandler = (err,req,res,next) => {

    const success = err.success || false;
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error'

    return res.status(status).json({success, status, message})

}

module.exports = errorHandler