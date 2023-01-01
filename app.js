require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(cookieParser());
app.use(session({
    secret: 'you are lucky babe',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        return cb(null, profile);
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  app.get("/auth/google", 
  passport.authenticate("google", {scope: ["profile"]} )
);

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secret.
    console.log("success");
    res.redirect('/secrets');
  });

  app.get("/secrets", (req, res)=>{
    if(req.isAuthenticated()){
        
      res.json(req.user);
    //   console.log(req.user);
    } else{
      res.send("login first");
    }
  });



app.listen(80, () => {
    console.log("listening on port 80");
  });
  