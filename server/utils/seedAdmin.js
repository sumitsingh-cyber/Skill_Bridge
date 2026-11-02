const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");

/**
 * seedDefaultAdmin
 * 
 * Provisions the initial Admin account using environment variables.
 * Only runs if NO Admin account exists in the database.
 * 
 * Required env vars:
 *   ADMIN_EMAIL    — e.g. admin@yourdomain.com
 *   ADMIN_PASSWORD — a strong password (min 12 characters recommended)
 * 
 * If these vars are not set, no admin account is created automatically.
 * In that case, provision the admin manually via the database or a
 * one-time secure CLI script.
 */
exports.seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      accountType: { $regex: /^admin$/i },
    });

    if (existingAdmin) {
      console.log(`Admin account active: ${existingAdmin.email}`);
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn(
        "No admin account found and ADMIN_EMAIL / ADMIN_PASSWORD are not set. " +
        "Set these environment variables to auto-provision the first admin account."
      );
      return;
    }

    console.log("No Admin found. Provisioning admin account from environment variables...");

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: "Platform Administrator",
      contactNumber: null,
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "SkillBridge",
      email: adminEmail.trim().toLowerCase(),
      password: hashedPassword,
      accountType: "Admin",
      additionalDetails: profile._id,
      Image: `https://api.dicebear.com/5.x/initials/svg?seed=Admin`,
    });

    console.log(`Admin account created: ${adminUser.email}`);
    // Never log the password
  } catch (error) {
    console.error("seedDefaultAdmin error:", error.message);
  }
};
