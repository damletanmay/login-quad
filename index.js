// imports
const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
// const md5 = require('js-md5');
const app = express();
const dotenv = require("dotenv")

// default settings
dotenv.config();
app.use(body.urlencoded({
  extended: true
}));

// db connection
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're Connected to Database.");
});


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required:false,
  },
  name:{
    type: String,
  },
  phone: {
    type: String,
    required:false,
  },
  password: String,
  isLoggedIn: Boolean,
});
const User = mongoose.model('User', userSchema);

app.post("/signup", (req, res) => {
  const email = req.body.email || null;
  const name =  req.body.name;
  const phone = req.body.phone || null;
  const password = req.body.password;

  console.log(phone);
  console.log(email);

  const user = new User({
   email: email,
   phone:phone,
   name:name,
   password: password,
   isLoggedIn:true,
 });

  success_msg = {
   success : true,
   user : {
     email: email,
     phone:phone,
     name:name,
     isLoggedIn:true,
   },
 };

  faliure_msg = {
    success: false,
    msg: "User Already Exists"
  };

  if (email == null){
    User.findOne({
      phone: phone,
    }, (err, user_1) => {
      if (user_1) {
        console.log(user_1);
         res.status(400).send(faliure_msg);

      }
      else {
        user.save(function(err,u){
          if (err) {
            console.log(err);
            res.send(400, 'Bad Request');
        }
        });
         res.status(200).send(success_msg);
      }
    });
  }
  else if (phone == null){
    User.findOne({
      email: email,
    }, (err, user_1) => {
      if (user_1) {
        console.log(user_1);
        res.status(400).send(faliure_msg);
      }
      else {
        user.save(function(err,u){
          if (err) {
            console.log(err);
            res.send(400, 'Bad Request');
        }
        });
        res.status(200).send(success_msg);
      }
    });
  }

});

app.post("/login", async (req, res) => {
  const email = req.body.email || null;
  const phone = req.body.phone || null;

  success_msg = {
    success : true,
    msg : 'Login Successfull',
  }

  faliure_msg = {
    success : false,
    msg:"User Does Not Exists"
  }

  if (email == null){
    User.findOneAndUpdate({phone:phone},{isLoggedIn:true},function (err,user){
      if(!user){
        console.log(user);
        res.send(400,faliure_msg);
      }
      else{
        res.status(200).send(success_msg);
      }
    });
  }
  else if (phone == null){
    User.findOneAndUpdate({email:email},{isLoggedIn:true},function (err,user){
      if(!user){
        console.log(user);
        res.send(400,faliure_msg);
      }
      else{
        res.status(200).send(success_msg);
      }
    });
  }
});

app.get("/getUser",(req,res)=>{
  const email = req.get('email') || null;
  const phone = req.get('phone') || null;

  console.log(email);
  console.log(phone);

  if (email == null){
    User.findOne({phone:phone},function(err,user){
      if(!user){
        res.status(400).send({'msg':'User Not Found'});
      }
      else{
        res.status(200).send(user);
      }
    });
  }
  else if (phone == null){
    User.findOne({email:email},function(err,user){
      if(!user){
        res.status(400).send({'msg':'User Not Found'});
      }
      else{
        res.status(200).send(user);
      }
    });
  }
});

// for listening onto this port
app.listen( process.env.PORT || 3000, function() {
  console.log("Connected on port 3000");
})
