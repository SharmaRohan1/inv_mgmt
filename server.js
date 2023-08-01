const express = require('express');
var cors = require('cors')
const app = express();
const fs = require("fs");

//const IP_ADDRESS = '127.0.0.1';
const PORT = 5500;

app.set("view engine" , "ejs");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/orders" , require("./routes/orders.js"));
app.use("/suppliers" , require("./routes/suppliers.js"));
app.use("/auth" , require("./routes/auth.js"));
app.use("/api/payment" , require("./routes/payments.js"));

const {verifyToken} = require("./middleware/verifyToken.js");

app.get("/" , verifyToken ,(req , res)=>{
    res.render("index");
});


app.get("/product-listing" , verifyToken ,(req , res)=>{
    res.render("product-listing");
});

app.get("/api/products" , verifyToken , (req , res)=>{
    const searchQuery = req.query.search;

    if(searchQuery){
        console.log("search requested" , searchQuery);

        fs.readFile('./data/products.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            // Code to handle the retrieved product data
            const products = JSON.parse(data);

            const filteredProducts = products.filter((product) => {
                const productName = product.name.toLowerCase();
                const productCategory = product.category.toLowerCase();
                const searchTerm = searchQuery.toLowerCase();
                
                return productName.includes(searchTerm) || productCategory.includes(searchTerm);
              });
              
            return res.json(filteredProducts);

        });

        
    }else{

        const ppp = Number(req.query.ppp);///products per page
        const pn = Number(req.query.pn);//page no

        //code to fetch and return products data
        fs.readFile('./data/products.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            // Code to handle the retrieved product data
            const allProducts = JSON.parse(data);

            const totalProducts = allProducts.length;
            const totalPages = Math.ceil(totalProducts / ppp);

            const products = [];

            const startingIdx = ((pn - 1) * ppp) + 1;
            const lastIdx = Number(startingIdx) + Number(ppp) - 1;

            for(let i = startingIdx - 1; i <= Math.min(lastIdx - 1 , totalProducts - 1); i++){
                products.push(allProducts[i]);
            }

            res.send(JSON.stringify({products , totalPages , totalProducts}));
        });

    }

});

const mysql = require("mysql");
const { verify } = require('crypto');

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

app.get("/product-supplier/:id" , verifyToken ,(req,res)=>{
    const productId = req.params.id;
    
    var sql = `select supplier_id from products where id=${productId}`;

    connection.query(sql , (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            const response = rows;
            console.log(JSON.stringify(response));
            res.send(JSON.stringify(response));
        }
    });

});

app.get("/order-management" , verifyToken , (req , res)=>{
    res.render("order-management");
});

app.get("/orderEdit/:id" , (req , res) => {
    const id = req.params.id;

    res.locals.id = id;
    console.log("edit for " , id);

    res.render("order-edit");
});

app.get("/newOrder" , verifyToken , (req , res) => {
    res.render("new-order");
});

app.get("/supplier-management" , verifyToken , (req , res)=>{
    res.render("supplier-management");
});

app.get("/newSupplier" , verifyToken, (req,res)=>{
    res.render("new-supplier");
});

app.get("/supplierEdit/:id" , verifyToken, (req,res)=>{
    const id = req.params.id;

    res.locals.id = id;
    console.log("edit for " , id);

    res.render("supplier-edit");
});

app.listen(PORT , ()=>{
    console.log(`Server listening on port ${PORT}`)
});