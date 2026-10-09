const mongoose = require("mongoose")
const validator = require("validator")

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
         trim: true,
         validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("email is not valid")
            }
         }
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
        type: String,
        validate(value) {
            if(!["Male", "Female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
                }
        }
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
    },
   
}, 
 {
        timestamps: true
    })

const userModel = new mongoose.model("User", UserSchema);

module.exports = userModel;