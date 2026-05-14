const Razorpay = require("razorpay");

let instance;

exports.getInstance = () => {
  if (!instance) {
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
      throw new Error("RAZORPAY_KEY and RAZORPAY_SECRET env vars are required");
    }
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  return instance;
};