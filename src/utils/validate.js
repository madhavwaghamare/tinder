const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Enter the name")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter the strong password")
    }
}

const validateProfileData = (req) => {
    const alllowdEditField = ["firstName", "lastName", "gender", "age", "photoUrl", "email", "aboutUs"];
    let payload = JSON.parse(req.body.payload);
    payload.photoUrl = req.file.path
    const isEditAllowed = Object.keys(payload).every((field) =>
        alllowdEditField.includes(field)
    )
    return isEditAllowed;
}
module.exports = {
    validateSignUpData, validateProfileData
}