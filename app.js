if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); // ✅ Import path module
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js"); 
const {listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");
const listingsRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/review.js"); 
const cookieParser = require("cookie-parser");
const session = require("express-session"); 
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js"); 


const port = 8080; // ✅ Define port correctly

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ✅ Set correct views directory
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser());



const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,

    },
    touchAfter:  78 * 3600,
});

store.on("error",() =>{
    console.log("error in mongo session",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 + 24 * 60 * 60 * 1000,
        maxAge: 7 + 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  mongoose.connect(process.env.ATLASDB_URL);
}

// app.get("/", (req, res) => {
//     res.send("Welcome to the homepage!"); // ✅ Send a proper response
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res , next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "delta-student",
//     });
//     let  registeredUser = await User.register(fakeUser , "helloWorld");
//     res.send(registeredUser);
// });




app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });  


app.use((err , req, res , next) =>{
    let{statusCode=500 , message= "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
