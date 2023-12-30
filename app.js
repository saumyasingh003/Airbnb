if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
 



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");


const initDatabase = require("./init/index")

const listings = require("./routes/listing");
const reviews = require("./routes/review");
const users = require("./routes/user");




app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const baseUrl = "";



const atlasDbUrl = process.env.ATLASDB_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(atlasDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

// module.exports = connectToDatabase;

  



const sessionOptions = {
  secret: "mysupersecretcodes",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "saumyasingh98982@gmail.com",
//     username: "SAUMYA SINGH",
//   });
//   let registeredUser = await User.register(fakeUser, "hellosam");
//   res.send(registeredUser);
// }),
  // Your middleware
  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND!!!"));
  });

// Error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("error.ejs", { message });
});
initDatabase();

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
