const User =require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator =require("otp-generator"); 
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const Profile =require("../models/Profile");
const mailSender=require("../utils/mailSender");
const { passwordUpdated }=require("../mail/templates/passwordUpdate");
require("dotenv").config();
const { otpTemplate } = require("../mail/templates/emailVerificationTemplate");



// send otp
exports.sendOTP =async (req,res)=>{
  try{
      //fatch email from body
    const { email }=req.body;

    //check if user already exist 
    const checkUserPresent =await User.findOne({email});

    // if user already exists then return a response
    if(checkUserPresent){
        return res.status(409).json({
            success:false,
            message:"User aleady regsitered",
        })
    } 

    //ganerate otp
    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP generated",otp);

    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result =await OTP.findOne({otp:otp});
    }

   const otpPayload = { email, otp };


    // create an entry for otp
    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);

    await mailSender(email, "Verify Your Email", otpTemplate(otp));

    // return response successfully
    res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",
        otp,
    });



  }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
  }
}


 // signup
    exports.signUp=async(req,res)=>{

        try{
            //data fatch from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;
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
         if (String(otp) !== String(recentOtp[0].otp)) {
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

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
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