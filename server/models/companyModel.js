import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  minCGPA: {
    type: Number,
    required: true
  },

  maxBacklogs: {
    type: Number,
    required: true
  },

  branchesAllowed: [
    {
      type: String,
      enum: [
        "IT",
        "CS",
        "CSE",
        "COMPS",
        "IOT",
        "ENTC",
        "MECH",
        "CYBER SECURITY",
        "AIML",
        "AIDS"
      ]
    }
  ],

  skillKeywords: [
    {
      type: String
    }
  ]

}, { timestamps: true });

export default mongoose.model("Company", companySchema);