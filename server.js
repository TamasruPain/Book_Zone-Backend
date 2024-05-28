
import express, { query } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { BookRouter } from "./routes/BookRoute.js";
import { QueryRouter } from "./routes/QueryRoute.js";
import { StudentRouter } from "./routes/StudentRoute.js";
import { OwnerAdminRouter } from "./routes/OwnerAdminRoute.js";
import { UserAdminRouter } from "./routes/UserAdminRoute.js";
import {roleRouter } from "./routes/roleRoute.js"

dotenv.config()


//connecting Expressjs with app
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());



//===========================================================================================

// // Routes
app.use('/student', StudentRouter)
app.use('/owner', OwnerAdminRouter)
app.use('/user', UserAdminRouter)
app.use('/book', BookRouter)
app.use('/query', QueryRouter)
app.use('/role',roleRouter)

// .....................................................

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ json: true });
});


// .....................................................


// Error Handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

//connecting the port...............................................................

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});


//mongodb connection.................................................................
const mongoDBURL = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed connection with MongoDB:", error);
    });

//...................................................................................