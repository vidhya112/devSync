const express = require("express")
const {validateSignupData} = require("../utils/validation")
const bcrypt = require("bcrypt");
const User = require("../Models/user");

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    res.status(400).send("Error adding user: " + err.message);
  }
});

authRouter.post("/login", async(req, res) => {
  const {emailId, password} = req.body;

  try{
    const user = await User.findOne({emailId: emailId});

    if(!user) {
      throw new Error("Invalid credentials")
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(isPasswordValid) {

      const token = await user.getJWT();

      res.cookie("token", token)
      res.send("Login successful!!")
    } else{
       throw new Error("Invalid Credentials")
    }

  }catch(err) {
    res.status(400).send("Error "+err.message)
  }
})

authRouter.post("logout", (req, res) => {
    req.cookie("token", null, {
        expires: new Date(Date.now())
    })

    res.send()
})

module.exports = authRouter;