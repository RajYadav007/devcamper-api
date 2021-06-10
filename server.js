const path =require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan =require('morgan');
const connectDB= require('./config/db');
const colors = require('colors');
const fileupload= require('express-fileupload');
const cookieParser =require('cookie-parser');
const errorHandler = require('./middleware/error');
const mongoSanitize= require('express-mongo-sanitize');
const helmet= require('helmet');
const xss= require('xss-clean');
const rateLimit= require('express-rate-limit');
const hpp= require('hpp');
const cors= require('cors');
//Load env variables

dotenv.config({path: './config/config.env'});

// connect to database
connectDB();

//Routes files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app=express();

// Body parser
app.use(express.json());
// cookie parser
app.use(cookieParser());

// dev logging middleware
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent xss headers
app.use(xss());

//rate-lmiting
const limiter=rateLimit({
windowsMs:10*60*1000,//10 minutes
max:100
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//Enable cors
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname,'public')));
// MOunts routes

app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);
app.use(errorHandler);


const PORT = process.env.PORT||5000;

const server= app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// handle unhanndeled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`ERror: ${err.message}`.red);
    server.close(()=>{
        process.exit(1);

    })
});