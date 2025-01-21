const express = require("express");
const authRouter = express.Router();
const User = require("../models/user")
const { validateSignUpData } = require('../utils/validate')
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: '/home/i-exceed.com/madhav.rajendra/home/logs/demo_upload' })
const logger = require('../../log/log')

authRouter.post("/signup", upload.single('profile_image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const { firstName, lastName, emailId, password, age, gender, aboutUs, skills, photoUrl } = JSON.parse(req.body?.payload);
        //validate the data
        // validateSignUpData(req)
        //Encrypt the password
        const passwordHas = await bcrypt.hash(password, 10)
        // Creating new instance of the User module
        const user = new User({
            firstName, lastName, emailId, password: passwordHas, age, gender, aboutUs, skills, photoUrl: filePath
        });
        await user.save();
        res.send("User added sucessfully")

    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }

})
authRouter.get("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");

        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
            })
            res.send("Loggied in sucessfully")
            logger.info("Loggied in sucessfully")
        } else {
            throw new Error("Invalid credentials")
        }

    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    }).send("Logged out")
})

module.exports = authRouter;