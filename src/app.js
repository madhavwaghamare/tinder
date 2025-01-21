
const express = require("express");
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 7000;

app.use(express.json());//middlewere - to covert data to json format
app.use(cookieParser()); // to read the cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);



connectDB().then(() => {
    console.log("connected")
    app.listen(PORT, () => {
        console.log("application is running on port", PORT)
    })
}).catch(err => {
    console.log("err")
})

