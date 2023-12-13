const User = require("../models/User");
const nodeMailer = require("nodemailer");
const randomID = "secret"
const sendMail = async (req,res,email, password) =>{
    try{
        const email = req.body.email; // email to be recovered
        const checkEmail = await User.find({email:email}); // check if email exists
        if(checkEmail.length == 0) return res.status(401).send(JSON.stringify({"message":"Email Not Found!!!"})); // if email does not exists
        // send mail
        const transporter = nodeMailer.createTransport({
            port: 465, // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth:{
                user: "ansibtri961@gmail.com",
                pass: "zhie xaij tjle soxo"
            },
            secure: true
        });
        const mailData = {
            from: "ansibtri961@gmail.com",
            to: email,
            text:'Account Recovery',
            subject: "Account Recovery",
            html: `<h1>Account Recovery</h1><p>Click on the link to recover your account</p><a href='http://localhost:3000/recovery/${randomID}'>Recover Account</a><br><p>Ignore this mail if you didn't request for account recovery</p>`
        }
        transporter.sendMail(mailData,(err,info)=>{
            if(err) return res.status(500).send(JSON.stringify({"message":"Mail Not Sent","error":err}));
            res.status(200).send(JSON.stringify({"message":"Mail Sent Successfully","data":info}));
        })
    }catch(errors){
        res.status(500).json({"message":"User Recovery Failed",errors});
    }
}
module.exports = sendMail;