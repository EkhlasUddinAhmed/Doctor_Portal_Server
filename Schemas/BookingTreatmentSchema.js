const mongoose = require("mongoose");
const bookingTreatmentSchema = mongoose.Schema({
  treatmentName: {
    type: String,
    required: true,
  },
  selectedSlot: {
    type: String,
    required: true,
  },

  selectedDate: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },

  patientEmail: {
    type: String,
    required: true,
  },

  patientPhone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports=bookingTreatmentSchema;
