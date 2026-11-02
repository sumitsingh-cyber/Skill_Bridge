/**
 * seedCourses.js
 * 
 * ⚠️  AUTO-SEEDING IS DISABLED
 * 
 * This file previously auto-seeded 6 sample courses with dummy w3schools
 * video URLs and a hardcoded instructor account on every server start.
 * That behavior has been intentionally removed to:
 *
 *  1. Prevent fake demo courses appearing in the production catalog.
 *  2. Prevent a hardcoded instructor account with a logged plaintext password.
 *  3. Keep the course catalog clean — only real instructor-created courses appear.
 *
 * HOW TO CLEAN UP EXISTING SEED COURSES (run once against production DB):
 *   1. Open MongoDB Atlas or a Mongo shell connected to your cluster.
 *   2. Identify seed courses by their videoUrl containing "w3schools.com":
 *        db.subsections.find({ videoUrl: /w3schools\.com/ })
 *   3. Get the subsection IDs, trace back to sections, then courses.
 *   4. Verify no real student enrollments exist on those courses.
 *   5. Delete subsections → sections → courses → remove from categories.
 *   6. If the dummy instructor "instructor@skillbridge.com" has no real courses,
 *      delete that user and their profile document as well.
 *
 * See the Audit Report for the full safe-deletion checklist.
 */

exports.seedDefaultCourses = async () => {
  console.log("seedDefaultCourses: Auto-seeding is disabled. Skipping.");
};
