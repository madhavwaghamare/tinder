const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type",
                status

            })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent",
            data
        })

    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        //validate the status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status is not allowed"
            })
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(400).json({ message: "connection not found" });
        }
        //to logged In user
        //loggedId => intersted
        //status == intersted
        //request Id should be valid

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request " + status,
            data
        })

    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }
})
module.exports = requestRouter;