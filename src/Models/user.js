const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 60
    },
    lastName: {
        type: String,
         required: true
    },
    emailId: {
        type: String,
         required: true,
         lowercase: true,
         unique: true,
         trim: true
    },
    password: {
        type: String,
         required: true
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "This the default about of the user."
    },
    skills: {
        type: [String]
    }
})

const userModel = new mongoose.model("User", UserSchema);

module.exports = userModel;