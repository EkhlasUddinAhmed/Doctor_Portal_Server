const express = require("express");
const bookingTreatmentRouter = express.Router();
const mongoose = require("mongoose");
const bookingTreatmentSchema = require("../Schemas/BookingTreatmentSchema");
const checkAuthorization = require("../AllMiddleWares/checkAuthorization");
const bookingTreatmentModel = new mongoose.model(
  "Bookingtreatment",
  bookingTreatmentSchema
);

bookingTreatmentRouter.get("/treatment", checkAuthorization,async (req, res) => {
  try {
    let query = {
      patientEmail: req.query.email,
    };
    const decodedEmail = req.decoded.email;
    const sentEmail = req.query.email;
    if (decodedEmail !== sentEmail) {
      return res.status(403).send({ message: "No Access" });
    }
    const myAllBookings = await bookingTreatmentModel.find(query);
        // console.log("Getting All Bookings Successfully:", myAllBookings);
    res.status(200).send(myAllBookings);
  } catch (error) {
    console.log("Server Sided Error in Getting All Bookings :", error.message);
    res.status(500).send({ error: error.message });
  }
});

bookingTreatmentRouter.post("/treatment", async (req, res) => {
  try {
    const bookingInstance = new bookingTreatmentModel(req.body);
    const getNewBooking = await bookingInstance.save();
    // console.log("Submit New Booking:", getNewBooking);

    res.status(200).send(getNewBooking);
  } catch (error) {
    console.log(
      "Server Sided Error in Submitting New Bookings :",
      error.message
    );
    res.status(500).send({ error: error.message });
  }
});

bookingTreatmentRouter.delete("/treatment/:id", async (req, res) => {
  try {
    const deletedBooking = await bookingTreatmentModel.findOneAndDelete(
      { _id: req.params.id },
      {
        useFindOneAndDelete: false,
      }
    );

    // console.log("Deleted Booking:", deletedBooking);

    res.status(200).send(deletedBooking);
  } catch (error) {
    console.log("Server Sided Error in Deleting :", error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  bookingTreatmentRouter,
  bookingTreatmentModel,
};
