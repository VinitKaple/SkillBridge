import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../models/companyModel.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const companies = [

{
name:"TCS",
minCGPA:6,
maxBacklogs:1,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC"],
skillKeywords:["java","sql","html","css","javascript","react","git"]
},

{
name:"Deloitte",
minCGPA:7,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS","AIML","AIDS"],
skillKeywords:["java","python","sql","aws","react","node","git"]
},

{
name:"JP Morgan",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:["java","spring","microservices","sql","aws","docker"]
},

{
name:"Goldman Sachs",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:["java","data structures","algorithms","system design","aws"]
},

{
name:"Infosys",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC","IOT"],
skillKeywords:["java","python","html","css","sql","git"]
},

{
name:"Wipro",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC"],
skillKeywords:["java","python","sql","html","css"]
},

{
name:"Accenture",
minCGPA:6.5,
maxBacklogs:1,
branchesAllowed:["IT","CS","CSE","COMPS","AIML","AIDS"],
skillKeywords:["java","python","sql","aws","react","node"]
},

{
name:"Capgemini",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC"],
skillKeywords:["java","sql","html","css","javascript"]
},

{
name:"Flipkart",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:["react","node","mongodb","system design","aws"]
},

{
name:"Google",
minCGPA:8.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:["data structures","algorithms","system design","java","python"]
}

];

const seedCompanies = async () => {

try{

await connectDB();

await Company.deleteMany();

await Company.insertMany(companies);

console.log("Companies Seeded Successfully");

process.exit();

}catch(error){

console.log(error);

process.exit(1);

}

};

seedCompanies();