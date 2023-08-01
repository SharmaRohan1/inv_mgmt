const express = require("express");
const router = express.Router();

const mysql = require("mysql");

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


//all the suppliers
router.get("/" ,verifyToken, (req , res)=>{
    var sql =  `select * from suppliers;`;
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

//getting a supplier by id
router.get("/:id" ,verifyToken, (req , res)=>{
    const supplierId = req.params.id;
    
    var sql =  `select * from suppliers where id='${supplierId}';`;
    
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

//for new supplier
router.post("/" ,verifyToken, (req , res)=>{
    const { id , name , contact_name , phone_number , email , address } = req.body;

    var sql =  `INSERT INTO suppliers (id,name,contact_name,phone_number,email,address) VALUES (${id},"${name}","${contact_name}","${phone_number}","${email}","${address}");`;
    console.log(sql);

    connection.query(sql, (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            console.log("1 row inserted");
            res.send(JSON.stringify({"status":"success"}));
        }
    });

});

//for updating supplier by id
router.put("/:id" ,verifyToken, (req , res)=>{
    const supplierId = req.params.id;

    const { name , contact_name , phone_number , email , address } = req.body;


    const sql = `UPDATE suppliers SET name="${name}",contact_name="${contact_name}",phone_number="${phone_number}",email="${email}",address="${address}" WHERE id=${supplierId};`;
    console.log(sql);
    
    connection.query(sql , (err, response) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            res.send(JSON.stringify({"status":"success"}));
        }
    });
});

//for deleting by id
router.delete("/:id" ,verifyToken, (req , res)=>{
    const supplierId = req.params.id;

    const sql = `DELETE from suppliers WHERE id='${supplierId}';`;
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