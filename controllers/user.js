const User = require("../models/user.js");

module.exports.signup = (req , res) =>{
    res.render("users/signup");
};

module.exports.createSignup = async(req , res) =>{
    try{
        let {username , email, password } = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser, password);
    
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
        req.flash("success", "Welcome to Arki Travels");
        res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.getLogin = (req , res ) =>{
    res.render("users/login");
};

module.exports.login = async(req , res) =>{
    req.flash("success","Welcome back to Arki Travels! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            // handle logout error (optional)
            req.flash("error", "Something went wrong during logout. Please try again.");
            return res.redirect("/listings");
        }
        
        req.flash("success", "You have been logged out successfully.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl); // Redirect to home or a specific URL
    });
};


