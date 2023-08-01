const app = require('express');
const router = app.Router();

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

const {verifyToken} = require("../middleware/verifyToken");

//for new order
router.post("/" ,verifyToken, (req , res)=>{
    const { customerId, productId, quantity } = req.body;
    console.log(customerId , productId , quantity);

    var sql =  `INSERT INTO orders (customer_id, product_id, quantity) VALUES (${customerId}, ${productId}, ${quantity});`;
    
    connection.query(sql, (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            console.log("1 row inserted");
            res.send(JSON.stringify({"status":"success"}));
        }
    });

});


//getting an order by id
router.get("/:id" ,verifyToken, (req , res)=>{
    const orderId = req.params.id;
    
    var sql =  `select * from orders where id='${orderId}';`;
    
    connection.query(sql , (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            const response = rows;
            console.log(response);
            res.send(JSON.stringify(response));
        }
    });

    
});

//all the orders
router.get("/" ,verifyToken, (req , res)=>{
    var sql =  `select * from orders;`;
    console.log(sql);
    
    connection.query(sql , (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            const response = rows;
            console.log(response);
            res.send(JSON.stringify(response));
        }

    });
});

//for updating order by id
router.put("/:id" ,verifyToken, (req , res)=>{
    const orderId = req.params.id;

    const { quantity } = req.body;


    const sql = `UPDATE orders SET quantity='${quantity}' WHERE id='${orderId}';`;
    console.log(sql);
    
    connection.query(sql , (err, response) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            res.send(JSON.stringify({"status":"success"}));
        }
    });
});

//for deleting
router.delete("/:id" ,verifyToken, (req , res)=>{
    const orderId = req.params.id;

    const sql = `DELETE from orders WHERE id='${orderId}';`;
    console.log(sql);
    
    connection.query(sql , (err, response) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            res.send(JSON.stringify({"status":"success"}));
        }
    });

});


module.exports = router;