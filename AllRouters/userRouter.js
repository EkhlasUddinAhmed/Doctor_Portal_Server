const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../Schemas/userSchema");
const userModel = new mongoose.model("Newuser", userSchema);
const jwt = require("jsonwebtoken");
const checkAuthorization = require("../AllMiddleWares/checkAuthorization");

userRouter.get("/user", checkAuthorization, async (req, res) => {
  try {
    const allUsers = await userModel.find();

    // console.log("allUsers successfully Got", allUsers);
    res.status(200).send(allUsers);
  } catch (error) {
    console.log("Getting AllUsers Server Error ");
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/user", async (req, res) => {
  try {
    const newUserInstance = new userModel(req.body);

    const createdNewUser = await newUserInstance.save();
    // console.log("CreatedNewUser successfully");
    res.status(200).send(createdNewUser);
  } catch (error) {
    console.log("CreatedNewUser Server Error ");
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/jwt", async (req, res) => {
  try {
    let token = "";
    const email = req.query.email;
    // console.log("FRom jwt, Email Sent is:", email);
    const matchedUser = await userModel.find({ newUserEmail: email });

    console.log("Matched User is:", matchedUser);

    if (matchedUser?.length > 0) {
      token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
        expiresIn: "2h",
      });
    }

    // console.log("Created Token is:", { token });
    res.status(200).send({ token });
  } catch (error) {
    console.log("Server Error in Creating Token");
    res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/allUser", async (req, res) => {
  try {
    const deletedUser = await userModel.deleteMany();
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/user/:id", async (req, res) => {
  try {
    // console.log("req.params.id:", req.params.id);
    const deletedUser = await userModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      {
        useFindOneAndDelete: false,
      }
    );
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.put("/admin/:id", checkAuthorization, async (req, res) => {
  try {
    const decodedEmail = req.decoded.email;

    const getCurrentUser = await userModel.find({ newUserEmail: decodedEmail });

    if (!getCurrentUser[0]?.newUserAdmin) {
      return res.status(403).send("Forbidden To Make Admin");
    }

    const userId = req.params.id;
    console.log("req.params.id:", req.params.id);
    const upDatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      {
        new: true,
        useFindOneAndUpdate: false,
      }
    );
    // console.log("Successfully Updating User:", upDatedUser);
    res.status(200).send(upDatedUser);
  } catch (error) {
    console.log("Server Side error in Updating User:", error.message);
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/checkAdmin", async (req, res) => {
  try {
    let isAdmin=false;
    // console.log("Checking User is Ok:");
    const email = req.query.email;
    // console.log("Email is:", email);
    const userGot = await userModel.find({
      newUserEmail: email,
    });

      if(userGot[0].newUserAdmin){
          isAdmin=true;
      }

    
    res.status(200).send({isAdmin});
  } catch (error) {
    console.log("Server Side error in Checking User:", error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
