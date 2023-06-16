const express = require("express");
const mongoose = require("mongoose");
const { availabletreatmentModel } = require("./AvailableTreatment");
const doctorRouter = express.Router();
const doctorSchema = require("../Schemas/DoctorSchema");
const doctorModel = new mongoose.model("Doctor", doctorSchema);
const checkAuthorization=require('../AllMiddleWares/checkAuthorization');

const multer = require("multer");
const path = require("path");

const DESTINATION = "./uploads/image/doctor";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DESTINATION);
  },
  filename: (req, file, cb) => {
    const extFile = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(extFile, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + extFile);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 9000000,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.fieldname === "doctorImage") {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        cb(null, true);
      } else {
        cb(new Error("ONLY .jpeg or .jpg or .png file is allowed"));
      }
    }
  },
});

doctorRouter.get("/all", async (req, res) => {
  try {
    const allTreatmentName = await availabletreatmentModel.find().select({
      slots: 0,
      price: 0,
      date: 0,
    });
    // console.log("Getting All Doctor Name Successfully");
    res.status(200).send(allTreatmentName);
  } catch (error) {
    // console.log("Getting All Doctor Name Server Sided Error");
    res.status(500).send({ error: error.message });
  }
});

doctorRouter.post("/img",checkAuthorization ,upload.single("doctorImage"), async (req, res) => {
  try {
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log("req.body is:", obj);
    console.log("req.file is:", req.file);
    const doctorImage = req.file.filename;
    const finalUser = {
      ...obj,
      doctorImage,
    };
    console.log("Final User is:", finalUser);
    const doctorInstance = new doctorModel(finalUser);
    const getAddedDoctor = await doctorInstance.save();
    console.log("Added doctor is:", getAddedDoctor);
    return res.status(200).send(getAddedDoctor);
  } catch (error) {
    console.log(" Server Sides Error  :", error.message);

    return res.status(500).send({ error: error.message });
  }
});

doctorRouter.get("/all/doctors", async (req, res) => {
  try {
    const allDoctors = await doctorModel.find();

    allDoctors.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    return res.status(200).send(allDoctors);
  } catch (error) {
    console.log(" Server Sides Error in Getting all Doctors  :", error.message);

    return res.status(500).send({ error: error.message });
  }
});

doctorRouter.get("/:id", async (req, res) => {
  try {
    const gotDoctor = await doctorModel.find({_id:req.params.id});

   console.log("Got User By Id:",gotDoctor);
    return res.status(200).send(gotDoctor);
  } catch (error) {
    console.log(" Server Sides Error in Getting  Doctors  :", error.message);

    return res.status(500).send({ error: error.message });
  }
});





doctorRouter.put("/modify/:id",checkAuthorization ,async (req, res) => {
  try {
    const modifiedObJect = req.body;
    const modifiedDoctor = await doctorModel.findOneAndUpdate(
      { _id: req.params.id },
      modifiedObJect,
      { new: true }
    );
    console.log("Modified user is:", modifiedDoctor);
    return res.status(200).send(modifiedDoctor);
  } catch (error) {
    console.log(" Server Sides Error in modifing Doctors  :", error.message);

    return res.status(500).send({ error: error.message });
  }
});

doctorRouter.delete("/delete/:id",checkAuthorization ,async (req, res) => {
  try {
    const deletedDoctor = await doctorModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      {
        useFindOneAndDelete: false,
      }
    );

    return res.status(200).send(deletedDoctor);
  } catch (error) {
    console.log(" Server Sides Error in Deleting Doctor  :", error.message);

    return res.status(500).send({ error: error.message });
  }
});
module.exports = doctorRouter;
