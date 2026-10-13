const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 60,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is invalid gender",
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "This the default about of the user.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, "Vidhya@123", {
    expiresIn: "7d",
  });
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
