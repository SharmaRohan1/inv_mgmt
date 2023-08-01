const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mysql = require("mysql");

const config = require("../config/auth");

const app = express();
app.use(express.static("public"));
app.set("view engine" , "ejs");

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

router.get("/register" , (req,res)=>{
  res.render("user-registration");
});

router.get("/login" , (req , res)=>{
  const cookie = req.headers.cookie;
  console.log(cookie);
  res.render("login");
});

router.get("/logout" , (req , res)=>{
  const cookie = req.headers.cookie;
  const token = cookie.split('=')[1];
  res.redirect("/auth/login");
});

const {verifyToken , ensureLogOut} = require("../middleware/verifyToken.js");

router.post("/register" , ensureLogOut ,async (req , res)=>{
    try {
        const { username, password } = req.body;

        console.log(username , password);

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // // Create a new user in the database
        const sql = `insert into users (username , password) values ("${username}" , "${hashedPassword}")`;
        const user = connection.query(sql);

        //res.status(201).json({ message: 'User registered successfully.' });
        res.status(200).json({ "status": 'Success' });
      } catch (error) {
        res.status(500).json({ "status": 'Registration failed' });
      }
});

router.post('/login', ensureLogOut , (req, res) => {
    const { username, password } = req.body;
  
    // Fetch the user from the database
    const sql = `select * from users where username="${username}";`;
    connection.query(sql , (err, rows) => {
        if (err){
            res.status(500).send({"status":"error"});
        }else{
            const response = rows;
            const user  = response[0];
            console.log(response[0].username);
            
            // Compare the passwords
            const passwordMatch = bcrypt.compareSync(password, response[0].password);

            if (!passwordMatch) {
              res.status(401).json({ error: 'Invalid credentials.' });
            }
        
            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiration });
        
            res.json({"status":"success", "token":`${token}` });
        }
    });
  
});

module.exports = router;