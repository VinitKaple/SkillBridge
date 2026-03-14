import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },       // e.g., "Aptitude Test"
  description: { type: String },                      // optional details
  order: { type: Number, required: true }             // to maintain sequence
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Service', 'Product', 'Other'], required: true },
  averagePackage: { type: Number, required: true },   // in LPA
  departmentsTargeted: [{ type: String }],            // e.g., ["CSE", "ECE"]
  toughnessPercentage: { type: Number, min: 0, max: 100, required: true },
  rolesOffered: [{ type: String }],                   // e.g., ["SDE", "Data Analyst"]
  hiringProcess: [roundSchema]                         // ordered rounds
}, { timestamps: true });

const tnp = mongoose.model('tnp', companySchema);
export default tnp;