// One-time helper to create your first admin account.
// New signups always default to role "user" for security —
// use this script to promote one account to admin.
//
// Usage:
//   cd backend
//   node scripts/make-admin.js your-email@example.com

import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/database-config.js";
import User from "../models/user-model.js";

const email = process.argv[2];

if (!email) {
  console.log("Usage: node scripts/make-admin.js <email>");
  process.exit(1);
}

const run = async () => {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }

  user.role = "admin";
  await user.save();

  console.log(`✅ ${user.name} (${user.email}) is now an admin.`);
  process.exit(0);
};

run();
