const mongoose = require("mongoose");
const doctorSchema=new mongoose.Schema({
    doctorName:String,
    doctorEmail:String,
    doctorSpeciality:String,
    doctorImage:String,
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=doctorSchema;