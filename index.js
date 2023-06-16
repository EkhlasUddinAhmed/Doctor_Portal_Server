require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")
const mongoose = require("mongoose");
const { availableTreatment } = require("./AllRouters/AvailableTreatment");
const {
  bookingTreatmentRouter,
} = require("./AllRouters/bookingTreatmentRouter");
const userRouter = require("./AllRouters/userRouter");
const doctorRouter = require("./AllRouters/doctorRouter");
const paymentRouter=require("./AllRouters/paymentRouter");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use("/teeth", availableTreatment);
app.use("/booking", bookingTreatmentRouter);
app.use("/new", userRouter);
app.use("/doctor", doctorRouter);
app.use(errorHandler);
app.use(express.static(`${__dirname}/uploads/`));
app.use("/payment",paymentRouter);
// Database Connection Starts Here....

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.13y3n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(uri);
const PORT = process.env.PORT || 5000;

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, config)
  .then(() => {
    console.log("DataBase Connection Successfull");
    app.listen(PORT, () => {
      console.log(
        `After Connection DataBase ,Server is Running at PORT :${PORT}`
      );
    });
  })
  .catch((error) => console.log(error));

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err) {
    res.status(500).send(err.message);
  } else res.send("Success");
  res.status(500).json({ error: err });
}


// console.log("From Index.js, UUID is:",uuidv4());
// const { v4: uuidv4 } = require('uuid');