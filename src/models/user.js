const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,

    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not an valide gender type`
        },
        // validate(value) {
        //     if (!["male", "female", "other"].includes(value))
        //         throw new Error("Gender is not correcr")
        // }

    },
    aboutUs: {
        type: String
    },
    skills: { type: [String], default: [] }
    ,
    photoUrl: {
        type: String,
        default: "https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
    },


}, {
    timestamps: true
})

userSchema.index({ firstName: 1, lastName: 1 })

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user.id }, "DEV@12345", { expiresIn: "7d" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHas = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHas)

    return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);

