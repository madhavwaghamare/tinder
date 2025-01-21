const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age skills photoUrl";
const User = require("../models/user");


//get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.findOne({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)
        //}).populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Data fetched succesfully",
            data: connectionRequest
        })
    } catch (err) {
        res.send("Error" + err.message)
    }
})

userRouter.get('/user/connection', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser.id.toString()) {
                return row.fromUserId
            }
            return row.fromUserId
        })


    } catch (err) {
        req.statusCode(400).status("Error" + err.message)
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        //User should see all the user cards expect
        //0. his own card
        //1. his connections
        //2. ignored people
        //3. already sent the connection request

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        //Find all connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                fromUserId: loggedInUser._id
            }, {
                toUserId: loggedInUser._id
            }]
        }).select("fromUserId toUserId");

        const hideUserFormFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFormFeed.add(req.fromUserId.toString())
            hideUserFormFeed.add(req.toUserId.toString())
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFormFeed) } },
                { _id: { $nin: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        //console.log(hideUserFormFeed);
        res.json(
            {
                message: "data fetched successfully",
                data: users
            }
        )

    } catch (err) {
        res.statusCode(400).send("Error" + err.message)
    }
})

module.exports = userRouter;