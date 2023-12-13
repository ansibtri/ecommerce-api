const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendMail = require("../middlewares/mail");
// create a user account

router.post('/register', async (req, res) => {
    try {
        const email = req.body.email;
        const checkEmail = await User.find({ email: email });
        if (checkEmail.length > 0) return res.status(401).send(JSON.stringify({ "message": "Email Already Exists!!!" }));
        // generate a salt
        const salt = await bcrypt.genSalt(10);
        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email,
            "password": hashedPassword,
            "agreeToTerms": req.body.termsAndConditions || true
        });
        const savedUser = await newUser.save();
        res.status(200).send(JSON.stringify({ "message": "Account Created Successfully!!!", "data": savedUser }));
    } catch (errors) {
        res.status(500).json({ "message": "User Registration Failed", errors });
    }
});

// login user
router.post('/login', async (req, res) => {
    if (req.session.user) {
        // if user is already logged in
        res.status(200).send(JSON.stringify({ "message": "User Already Logged In", "data": req.session.user }));
    } else {
        // if user is not logged in
        try {
            if (req.body.email == "" || req.body.password == "") return res.status(400).send(JSON.stringify({ "message": "Credentials is missing" }));
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(401).send(JSON.stringify({ "message": "User not found" }));
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) return res.status(401).send(JSON.stringify({ "message": "Invalid Credentials" })); // if password is invalid 
            req.session.user = { "id": user._id, "email": user.email, "firstname": user.firstname, "lastname": user.lastname }; // set session
            res.status(200).send(JSON.stringify({ "message": "Account Logged in !!!", "data": user }));
            console.log(req.session.user)
        } catch (errors) {
            res.status(500).json({ "message": "User Login Failed", errors });
        }
    }
});

router.post('/logout', async (req, res) => {
    try {
        // delete req.session
        req.session.destroy();
        res.status(200).send(JSON.stringify({ "message": "Account Logged Out !!!" }));
    } catch (errors) {
        res.status(500).json({ "message": "User Logout Failed", errors });
    }
});

// account recovery in case of forget password
router.post('/recovery', async (req, res) => {
    try {
        const email = req.body.email; // email to be recovered
        const checkEmail = await User.find({ email: email }); // check if email exists
        if (checkEmail.length == 0) return res.status(401).send(JSON.stringify({ "message": "Email Not Found!!!" })); // if email does not exists
        sendMail(req, res); // send mail
        res.status(200).send(JSON.stringify({ "message": "Email Found !!!", "data": checkEmail })); // if email exists
    }
    catch (errors) {
        res.status(500).json({ "message": "User Recovery Failed", errors });
    }
});
module.exports = router;
