const mongoose=require("mongoose");
const availabletreatmentSchema=new mongoose.Schema({
    treatmentName:{
        type:String,
        required:true
    },
    slots:{
        type:Array,
        required:true 
    },
    price:String,
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports=availabletreatmentSchema;