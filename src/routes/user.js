const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user")

const USER_DATA = "firstName lastName age skills about gender"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);

    console.log(connectionRequest)
    res.json({
        message: "Data fetch successfully",
        connectionRequest
    })
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_DATA)

        const data = connectionRequest.map((request) => {
            if(request.fromUserId._id.equals(request.loggedInUser._id)) {
return request.toUserId
            }
            return request.fromUserId
        } )

        res.json({
            message: "Data fetch successfully",
            data
        })

    } catch(err) {
        res.status(400).send("Error "+ err.message)
    }
})

userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
         const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
      

        const hideConnectionsFromFeed = new Set();

        connectionRequest.forEach((request) => {
            hideConnectionsFromFeed.add(request.fromUserId.toString()),
            hideConnectionsFromFeed.add(request.toUserId.toString())
        })

        const users = await User.find({
            $and: [
            {_id: {$nin: Array.from(hideConnectionsFromFeed)}} ,
            {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_DATA)
          .skip(skip)
        .limit(limit)

        res.json({
            message: "Data fetch successfully",
            users
        })

    } catch(err) {
        res.status(400).send("Error "+ err.message)
    }
})

module.exports = userRouter;
