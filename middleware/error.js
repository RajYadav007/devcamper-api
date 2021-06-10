const ErrorResponse = require("../utils/ErrorResponse");



const errorHandler =(err,req,res,next)=>{

    let error= {...err};
    error.message=err.message;

console.log(err);
// mongoose bad Objectid

if(err.name==='CastError'){
    const message=`Resource not found `;
    error = new ErrorResponse(message,404);
}

// Mongoose duplicate key
if(error.code===11000)
{
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message,400);
}

// Mongoose validation error
if(err.name==='ValidationError'){
    const message =Object.values(err.errors).map(val=>val.message);
    error = new ErrorResponse(message,400);
}

res.status(error.statusCode||500).json({
    success:false,
    error:error.message||'server Error'
});
};

module.exports = errorHandler;
