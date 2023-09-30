  const express = require("express");
  const bodyParser = require("body-parser");
//   const ejs = require("ejs");
  const mongoose = require("mongoose");

  const app = express();

  app.use(express.static("public"));
//   app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({extended: true}));

  //////////////////////////////   DATABASE SCHEMAS & MODELS   ////////////////////////
  mongoose.connect("mongodb://127.0.0.1:27017/MarketOffersDB_v3");       

  const userSchema = {
    email: String,
    password: String
  };
  const adminSchema = {
    email: String,
    password: String
  };
  const categorySchema = new mongoose.Schema({
    id: String,
    name: String,
    subcategories: ["Mixed"]
  });
   const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    subcategory: String
  });
  const priceSchema = new mongoose.Schema({
    date: {
        day: Number,
        month: Number,
        year: Number
    },
    prices: ["Mixed"]
  });
  const storeSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    number: Number,
    long: Number,
    lat: Number,
    offer: Boolean
  });
  const offerSchema = new mongoose.Schema({
    product_id: String,
    category_id: String,
    subcategory_id: String,
    store_id: String,
    date: {type: Date, expires: '7d', default: Date.now},
    type: Number
  });

  const User = new mongoose.model("User", userSchema);
  const Admin = new mongoose.model("Admin", adminSchema);
  const Category = new mongoose.model("Category", categorySchema);
  const Product = new mongoose.model("Product", productSchema);
  const Price = new mongoose.model("Price", priceSchema);
  const Store = new mongoose.model("Store", storeSchema);
  const Offer = new mongoose.model("Offer", offerSchema);

  /////////////////////////////////////   ROUTES   /////////////////////////////////////
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/home.html");
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/public/login.html");
});

app.get("/register", function(req, res){
    res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", async function(req, res){
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save();
        res.redirect("/homeuser");
    } catch(err) {
        console.log(err);
    }
});

app.post("/login", async function(req,res){
    try {
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email: username});
        const foundAdmin = await Admin.findOne({email: username});

        if (foundAdmin && foundAdmin.password === password) {
            res.redirect("/homeadmin");
        } else if (foundUser && foundUser.password === password) {
            res.redirect("/homeuser");
        } else {
            res.redirect("/");
        }
    } catch(err) {
        console.log(err);
    }
    
});

app.get("/api/data", async function(req, res){
    const withoutOffer = await Store.find({offer: false});
    res.json(withoutOffer);
});

app.get("/homeuser", function(req, res){
    res.sendFile(__dirname + "/public/homeuser.html");
});

app.get("/homeadmin", function(req, res){
    res.sendFile(__dirname + "/public/admin.html");
});


//////////////////////////////////////   SERVER   //////////////////////////////////////
app.listen(3000, function(){
    console.log("Server started on port 4000...");
});