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

app.get("/" , (req , res)=>{
    res.render("index");
});


app.get("/product-listing" , (req , res)=>{
    res.render("product-listing");
});

app.get("/api/products" , (req , res)=>{

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

});

app.listen(PORT , ()=>{
    console.log(`Server listening on port ${PORT}`)
});