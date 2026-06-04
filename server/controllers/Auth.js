const User =require("../models/User");
const OTP=require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const { randomInt } = require("crypto");
const Profile =require("../models/Profile");
const mailSender=require("../utils/mailSender");
const { passwordUpdated }=require("../mail/templates/passwordUpdate");
require("dotenv").config();
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from body
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    const recentOtpRequest = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (recentOtpRequest && Date.now() - recentOtpRequest.createdAt.getTime() < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    const otp = String(randomInt(100000, 1000000));
    const hashedOtp = await bcrypt.hash(otp, 10);

    console.log("OTP generated for", email);

    await OTP.deleteMany({ email });

    // save otp
    const otpRecord = await OTP.create({ email, otp: hashedOtp });

    console.log("OTP saved to DB");

    const htmlContent = otpTemplate(otp);

    // send email
    try {
      await mailSender(
        {
          to: email,
          subject: "Your SkillBridge verification code",
          html: htmlContent,
        }
      );

      console.log("OTP Email Sent Successfully");

    } catch (mailError) {

      console.log("Failed to send OTP email:", mailError.message);
      await OTP.findByIdAndDelete(otpRecord._id);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Error: " + mailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



 // signup
    exports.signUp=async(req,res)=>{

        try{
            //data fatch from request ki body
        const {
            firstName,
            lastName,
            email: rawEmail,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;

        const email = rawEmail?.trim().toLowerCase();

        //validate krlo
        if(!firstName || !lastName || !email|| !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All feilds are required",
            })
        }

        //2 password match krlo 
        if(password !== confirmPassword){
            return res.status(400).json({
                success:true,
                message:"Password and ConfirmPassword miss match, Please try again",
            });
        }

        //check user already exist or not
        const existingUser =await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:true,
                message:"User is already registered",
            });
        }

        // find most recent otp 
         const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        console.log(recentOtp);
        
        //validation otp
        if(recentOtp.length == 0){
            //OTP not found
            return res.status(400).json({
                success:true,
                message:"OTP is not  Found",
            })
        }
         const isOtpValid = await bcrypt.compare(String(otp), recentOtp[0].otp);

         if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

        // hash password
        const hashedPassword =await  bcrypt.hash(password,10);

        //Create yhe user 
        let approved = accountType === "Instructor" ? false : true;


        // entry create in db

        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user =await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
           contactNumber,
            accountType,
            additionalDetails:profileDetails._id,
            Image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
        })

        await OTP.deleteMany({ email });
        
        // return response
        return res.status(200).json({
            success:true,
            message:"User is registered Successfully",
            user,
        });
    }

        catch(error){
            console.log(error); 
            return res.status(500).json({
                success:false,
                message:"User cannot be registered .Please try again",
            });
        }
    };


//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, Please try again",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || "manish", {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      return res.cookie("Token", token, option).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });

    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, Please try again",
    });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await mailSender(
      user.email,
      "Password Updated Successfully",
      passwordUpdated(user.email)
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
