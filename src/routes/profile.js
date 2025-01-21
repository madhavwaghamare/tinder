const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { isFloat } = require("validator");
const { validateProfileData } = require("../utils/validate");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: '/home/i-exceed.com/madhav.rajendra/home/logs/demo_upload' })

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = await req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }
})

profileRouter.patch("/profile/edit", upload.single('profile_image'), userAuth, async (req, res) => {
    try {
        if (!validateProfileData(req)) {
            throw new Error("Invalid Edit request")
        } else {
            const loggedInUser = req.user;
            if (loggedInUser.photoUrl) {
                await fs.unlinkSync(loggedInUser.photoUrl);
            }
            let payload = JSON.parse(req.body.payload);
            payload.photoUrl = req.file.path
            Object.keys(payload).forEach((key) => (loggedInUser[key] = payload[key]))
            await loggedInUser.save();
            res.json({
                message: `${loggedInUser.firstName} Profile is updated sucessfully`,
                data: loggedInUser
            })
        }
    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }

})

module.exports = profileRouter;