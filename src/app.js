const express = require("express");
const connectDB = require("./config/database");
const User = require("./Models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(user);

  try {
    await user.save();
    res.send("User added successfully", user);
  } catch (err) {
    res.status(400).send("Error adding user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;
  console.log(userEmailId);

  try {
    const user = await User.findOne({ emailId: userEmailId });
    console.log(user);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  // const userEmailId =  new User(req.body.emailId)
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: id });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong", err);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.id;
  const data = req.body;
  console.log(data);
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    if (!user) {
      res.status(404).send("Not found");
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");

    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
