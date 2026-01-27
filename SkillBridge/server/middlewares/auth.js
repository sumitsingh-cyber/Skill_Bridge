const jwt=require("jsonwebtoken");
require("dotenv").config();
const User =require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};


//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType?.toLowerCase() !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

//isinstructor
exports.isInstructor =async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            });
        }next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again",
        });
    }
}




//isAdmin
exports.isAdmin =async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            });
        }next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified,please try again",
        });
    }
}
