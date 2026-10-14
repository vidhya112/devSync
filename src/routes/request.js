const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS = ["interested", "ignored"];

      if (!ALLOWED_STATUS.includes(status)) {
       return res.status(400).json({ message: "Invalid status type: " + status });
      }

      const user = await User.findById(toUserId);

      if (!user) {
       return res.status(400).json({
          message: "Invalid User",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection request already exists!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully!",
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try{

        const {status, requestId} = req.params;
        const loggedInUser = req.user;

        const ALLOWED_STATUS = ["accepted", "rejected"]

        if(!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({message: "Status not allowed"})
        }

        const connectionRequest =  await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found!"
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()

        res.json({
            message: "Connection request " + status, data
        })

    } catch(err) {
        res.status(400).send("Error " + err.message)
    }
})

module.exports = requestRouter;
