const cors = require("cors");
const express = require("express");
const router = express.Router();

require("dotenv").config(); 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mySql@123',
    database: 'order_management',
    port:3306
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

const executeQuery = (sql)=>{
    console.log(sql);
    
    connection.query(sql , (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            res.send(JSON.stringify({"status":"success"}));
        }
    });
};


router.get("/" , (req , res)=>{
    console.log(process.env.STRIPE_SECRET_KEY);
    res.send("Payment section");
});

router.get("/success" , (req , res)=>{
    alert("Successful");
    res.send("Successful");
});

router.get("/cancel" , (req , res)=>{
    alert("Cancelled");
    res.send("Cancel");
});

router.post("/", async (req, res) => { 
    const { product } = req.body; 
    console.log(product.name);

    const session = await stripe.checkout.sessions.create({ 
      payment_method_types: ["card"], 
      line_items: [ 
        { 
          price_data: { 
            currency: "inr", 
            product_data: { 
              name: product.name, 
            }, 
            unit_amount: product.price * 100, 
          }, 
          quantity: product.quantity, 
        }, 
      ], 
      mode: "payment", 
      success_url: "http://localhost:5500/api/payment/success", 
      cancel_url: "http://localhost:5500/api/payment/cancel", 
    }); 

    if(!session.id){
        const sql1 = `update orders set payment_status='paid' where id=${order.id} `;
        const sql2 = `update orders set payment_transaction_id=${session.id} where id=${order.id} `;
        executeQuery(sql1);
        executeQuery(sql2);
        res.status(500).json({ error: 'Payment processing error' });
    }else{
        const sql = `update orders set payment_status='faied' where id=${order.id} `;
        executeQuery(sql);
        res.json({ id: session.id }); 
    }
    
  }); 

module.exports = router;