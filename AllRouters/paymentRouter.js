const express = require("express");
const paymentRouter = express.Router();
const { v4: uuidv4 } = require("uuid");

const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = `${process.env.STORE_ID}`;
const store_passwd = `${process.env.STORE_PASSWORD}`;
const is_live = false; //true for live, false for sandbox
let finalOrderProduct;
paymentRouter.post("/order", async (req, res) => {
  try {

    const tran_id=uuidv4();
    const {productName, productPrice, customerName, customerPhone}=req.body
    let price=parseInt(req.body.productPrice  ); 
    console.log("Req.body is:",typeof price );

    const data = {
      total_amount: price,
      currency: "BDT",
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: "http://localhost:5000/payment/finalOrder/success",
      fail_url: "http://localhost:5000/payment/finalOrder/fail",
      cancel_url: "http://localhost:5000/payment/finalOrder/cancel",
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: productName,
      product_category: "Electronic",
      product_profile: "general",
      cus_name: customerName,
      cus_email: "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: customerPhone,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

   
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Redirect the user to payment gateway
      let GatewayPageURL =apiResponse.GatewayPageURL;
      finalOrderProduct=req.body;
       res.status(200).send({url:GatewayPageURL});
      // res.redirect(GatewayPageURL);
      console.log("Redirecting to: ", {url:GatewayPageURL});
    });

    
    
  } catch (error) {
    res.status(500).send(error.message);
      console.log("Payment Error:",error.message);
  }
});

paymentRouter.post('/finalOrder/fail',async(req,res)=>{
    try{
        res.redirect('http://localhost:5173/payment/fail');
        
    }catch(error){
      res.status(500).send(error.message);
      console.log("Final Order Error Error:",error.message);
    }
});
paymentRouter.post('/finalOrder/success',async(req,res)=>{
  try{
      res.redirect('http://localhost:5173/payment/success');
      
  }catch(error){
    res.status(500).send(error.message);
    console.log("Final Order Error Error:",error.message);
  }
});
paymentRouter.post('/finalOrder/cancel',async(req,res)=>{
  try{
      res.redirect('http://localhost:5173/payment/cancel');
      
  }catch(error){
    res.status(500).send(error.message);
    console.log("Final Order Error Error:",error.message);
  }
});


module.exports = paymentRouter;
