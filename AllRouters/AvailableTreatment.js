const express = require("express");
const availableTreatment = express.Router();
const mongoose = require("mongoose");
const availabletreatmentSchema = require("../Schemas/AvailabletreatmentSchema");
const checkAuthorization = require("../AllMiddleWares/checkAuthorization");
const { bookingTreatmentModel } = require("./bookingTreatmentRouter");
const availabletreatmentModel = new mongoose.model(
  "Availabletreatment",
  availabletreatmentSchema
);

availableTreatment.get("/availabletreatment", async (req, res) => {
  try {
    
    const date = req.query.date;
    // console.log("Date sent is:",date);
    // console.log("Type of date is:",typeof date);
    const allAvailableTreatments = await availabletreatmentModel.find();

    const allBooked=await bookingTreatmentModel.find({selectedDate:date});

    allAvailableTreatments.forEach((option)=>{
      const allBookedByName=allBooked.filter((name=>name.treatmentName===option.treatmentName));
      const getSlots=allBookedByName.map(slot=>slot.selectedSlot)
      
       const remaingSlots=option.slots.filter((booked)=>!getSlots.includes(booked));
       allAvailableTreatments.slots=remaingSlots;

      // console.log(date,option.treatmentName,remaingSlots.length)
      // option.slots=remaingSlots;

    });

    // console.log(` on:${date}: Number of Bookings are:${allBooked.length}`);
    
    res.status(200).send(allAvailableTreatments);
    // console.log("allAvailableTreatments are:", allAvailableTreatments);
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log("Server Error in Getting all Treatments");
  }
});

module.exports = {
  availableTreatment,
  availabletreatmentModel
};
