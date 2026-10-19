const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");

exports.seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      accountType: { $regex: /^admin$/i },
    });

    if (!existingAdmin) {
      console.log("No Admin found in database. Creating default Admin account...");

      const profile = await Profile.create({
        gender: "Other",
        dateOfBirth: "2000-01-01",
        about: "Platform Super Administrator",
        contactNumber: "9999999999",
      });

      const hashedPassword = await bcrypt.hash("AdminPassword123", 10);

      const adminUser = await User.create({
        firstName: "System",
        lastName: "Admin",
        email: "admin@skillbridge.com",
        password: hashedPassword,
        accountType: "Admin",
        additionalDetails: profile._id,
        Image: "https://api.dicebear.com/5.x/initials/svg?seed=System%20Admin",
      });

      console.log("Default Admin created successfully: admin@skillbridge.com / AdminPassword123");
    } else {
      console.log(`Admin account active: ${existingAdmin.email} (${existingAdmin.accountType})`);
    }
  } catch (error) {
    console.error("Admin seed error:", error.message);
  }
};
