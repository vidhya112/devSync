const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid token");
    }

    const decodeMessage = await jwt.verify(token, "Vidhya@123");

    const { _id } = decodeMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next()
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
