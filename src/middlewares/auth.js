
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        //Read the token from req cookies
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("token is invalid")
        }
        //Validate the token
        const decodedObj = await jwt.verify(token, "DEV@12345")
        const { _id } = decodedObj;

        //Find the use
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch (err) {
        res.status(400).send("something went wrong: " + err.message)
    }


}

module.exports = {
    userAuth

}