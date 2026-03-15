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
skillKeywords:[
"java","sql","html","css","javascript",
"frontend","backend","database",
"version control","api integration",
"aptitude","project management"
]
},

{
name:"Infosys",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC","IOT"],
skillKeywords:[
"java","python","html","css","sql",
"frontend","backend","database",
"version control","automation",
"aptitude"
]
},

{
name:"Wipro",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC"],
skillKeywords:[
"java","python","sql","html","css",
"api integration","automation",
"aptitude","project management"
]
},

{
name:"Accenture",
minCGPA:6.5,
maxBacklogs:1,
branchesAllowed:["IT","CS","CSE","COMPS","AIML","AIDS"],
skillKeywords:[
"java","python","sql",
"cloud","deployment",
"frontend","backend",
"api integration","version control",
"aptitude"
]
},

{
name:"Capgemini",
minCGPA:6,
maxBacklogs:2,
branchesAllowed:["IT","CS","CSE","COMPS","ENTC"],
skillKeywords:[
"javascript","html","css","sql",
"frontend","backend","database",
"api integration","version control",
"aptitude"
]
},

{
name:"Deloitte",
minCGPA:7,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS","AIML","AIDS"],
skillKeywords:[
"java","python","sql",
"cloud","deployment",
"data analysis","automation",
"api integration","project management"
]
},

{
name:"JP Morgan",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"java","microservices","sql",
"cloud","deployment",
"backend","api integration",
"data structures","algorithms"
]
},

{
name:"Goldman Sachs",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","COMPS"],
skillKeywords:[
"data structures","algorithms",
"system design",
"java","python",
"backend","database",
"cloud"
]
},

{
name:"Flipkart",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS" ,"AIDS"],
skillKeywords:[
"mern","frontend","backend",
"database","cloud",
"deployment","system design",
"api integration","version control"
]
},

{
name:"Amazon",
minCGPA:8,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"data structures","algorithms",
"system design",
"cloud","backend",
"database","api integration",
"automation"
]
},

{
name:"Google",
minCGPA:8.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"data structures","algorithms",
"system design",
"java","python",
"backend","cloud","automation"
]
},

{
name:"Swiggy",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"mern","frontend","backend",
"database","cloud",
"deployment","api integration"
]
},

{
name:"Zomato",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"frontend","backend",
"database","cloud",
"api integration",
"deployment","system design"
]
},

{
name:"Paytm",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"java","backend",
"database","cloud",
"api integration",
"automation","deployment"
]
},

/* Android Development Companies */

{
name:"Razorpay",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","IOT","CSE","COMPS"],
skillKeywords:[
"kotlin",
"android",
"jetpack compose",
"material 3",
"firebase",
"api integration",
"play store publishing"
]
},

{
name:"PhonePe",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","CSE","COMPS"],
skillKeywords:[
"kotlin",
"android",
"jetpack compose",
"firebase",
"material 3",
"play store publishing",
"api integration"
]
},

{
name:"CRED",
minCGPA:7.5,
maxBacklogs:0,
branchesAllowed:["IT","CS","IOT","COMPS"],
skillKeywords:[
"kotlin",
"android",
"jetpack compose",
"firebase",
"material 3",
"api integration",
"play store publishing"
]
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