import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from '../models/tnp.model.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const companies = [
  // Service-based
  {
    companyName: 'Tata Consultancy Services',
    type: 'Service',
    averagePackage: 7.5,
    departmentsTargeted: ['CSE', 'IT', 'ECE'],
    toughnessPercentage: 65,
    rolesOffered: ['Systems Engineer', 'Associate Consultant'],
    hiringProcess: [
      { roundName: 'Aptitude Test', description: 'Numerical and logical reasoning', order: 1 },
      { roundName: 'Technical Interview', description: 'Coding, DBMS, OS', order: 2 },
      { roundName: 'HR Interview', description: 'Behavioral questions', order: 3 }
    ]
  },
  {
    companyName: 'Infosys',
    type: 'Service',
    averagePackage: 8.0,
    departmentsTargeted: ['CSE', 'ECE', 'EEE'],
    toughnessPercentage: 60,
    rolesOffered: ['Software Engineer', 'Digital Specialist'],
    hiringProcess: [
      { roundName: 'Online Coding Test', description: '3 problems, 90 mins', order: 1 },
      { roundName: 'Technical Interview', description: 'Java, Python, SQL', order: 2 },
      { roundName: 'HR Interview', description: 'Communication & fit', order: 3 }
    ]
  },
  {
    companyName: 'Google',
    type: 'Product',
    averagePackage: 45.0,
    departmentsTargeted: ['CSE'],
    toughnessPercentage: 95,
    rolesOffered: ['Software Engineer', 'Product Manager'],
    hiringProcess: [
      { roundName: 'Online Assessment', description: 'Algorithms & problem solving', order: 1 },
      { roundName: 'Technical Phone Screen', description: 'Data structures', order: 2 },
      { roundName: 'On-site Interviews', description: '4 rounds of coding & system design', order: 3 },
      { roundName: 'Hiring Committee', description: 'Review & offer', order: 4 }
    ]
  },
  {
    companyName: 'Microsoft',
    type: 'Product',
    averagePackage: 42.0,
    departmentsTargeted: ['CSE', 'IT'],
    toughnessPercentage: 90,
    rolesOffered: ['Software Development Engineer', 'Program Manager'],
    hiringProcess: [
      { roundName: 'Coding Test', description: '2 problems on online platform', order: 1 },
      { roundName: 'Technical Interviews', description: '3 rounds focusing on DS/Algo', order: 2 },
      { roundName: 'AA (As Appropriate) Interview', description: 'Domain knowledge', order: 3 },
      { roundName: 'HR Discussion', description: 'Culture fit', order: 4 }
    ]
  },
  {
  companyName: 'Amazon',
  type: 'Product',
  averagePackage: 38.0,
  departmentsTargeted: ['CSE', 'IT', 'ECE'],
  toughnessPercentage: 88,
  rolesOffered: ['Software Development Engineer', 'Cloud Support Associate'],
  hiringProcess: [
    { roundName: 'Online Assessment', description: 'Coding problems & work style assessment', order: 1 },
    { roundName: 'Technical Interview 1', description: 'Data structures & algorithms', order: 2 },
    { roundName: 'Technical Interview 2', description: 'System design & problem solving', order: 3 },
    { roundName: 'Bar Raiser', description: 'Leadership principles & fit', order: 4 }
  ]
},
{
  companyName: 'Goldman Sachs',
  type: 'Service',
  averagePackage: 25.0,
  departmentsTargeted: ['CSE', 'IT', 'Finance', 'Math'],
  toughnessPercentage: 85,
  rolesOffered: ['Analyst', 'Software Engineer', 'Risk Analyst'],
  hiringProcess: [
    { roundName: 'Online Test', description: 'Aptitude, quant, coding', order: 1 },
    { roundName: 'Technical Interview', description: 'Data structures, OOP, finance basics', order: 2 },
    { roundName: 'HR Interview', description: 'Behavioral & cultural fit', order: 3 }
  ]
},
{
  companyName: 'Boeing',
  type: 'Product',
  averagePackage: 15.0,
  departmentsTargeted: ['Aerospace', 'Mechanical', 'Electrical'],
  toughnessPercentage: 75,
  rolesOffered: ['Design Engineer', 'Systems Engineer'],
  hiringProcess: [
    { roundName: 'Technical Test', description: 'Domain knowledge & aptitude', order: 1 },
    { roundName: 'Technical Interview', description: 'Core engineering concepts', order: 2 },
    { roundName: 'Managerial Interview', description: 'Project experience & leadership', order: 3 }
  ]
},
{
  companyName: 'Deloitte',
  type: 'Service',
  averagePackage: 12.5,
  departmentsTargeted: ['CSE', 'IT', 'MBA', 'Commerce'],
  toughnessPercentage: 70,
  rolesOffered: ['Consultant', 'Analyst', 'Technology Auditor'],
  hiringProcess: [
    { roundName: 'Online Test', description: 'Logical reasoning, English, domain', order: 1 },
    { roundName: 'Group Discussion', description: 'Current affairs topic', order: 2 },
    { roundName: 'Personal Interview', description: 'HR + technical', order: 3 }
  ]
},
{
  companyName: 'Intel',
  type: 'Product',
  averagePackage: 22.0,
  departmentsTargeted: ['ECE', 'CSE', 'VLSI', 'Electrical'],
  toughnessPercentage: 82,
  rolesOffered: ['Hardware Engineer', 'Firmware Engineer'],
  hiringProcess: [
    { roundName: 'Online Coding & MCQs', description: 'C, digital electronics, algorithms', order: 1 },
    { roundName: 'Technical Round 1', description: 'Microprocessors, embedded systems', order: 2 },
    { roundName: 'Technical Round 2', description: 'System design & problem solving', order: 3 },
    { roundName: 'HR Round', description: 'Communication & fit', order: 4 }
  ]
},
{
  companyName: 'Flipkart',
  type: 'Product',
  averagePackage: 28.0,
  departmentsTargeted: ['CSE', 'IT'],
  toughnessPercentage: 84,
  rolesOffered: ['Software Development Engineer', 'Data Scientist'],
  hiringProcess: [
    { roundName: 'Machine Coding Round', description: 'Design a small application', order: 1 },
    { roundName: 'Data Structures & Algo', description: 'Problem solving on whiteboard', order: 2 },
    { roundName: 'Hiring Manager Round', description: 'System design & behavioral', order: 3 }
  ]
},
{
  companyName: 'L&T Infotech',
  type: 'Service',
  averagePackage: 6.5,
  departmentsTargeted: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'],
  toughnessPercentage: 55,
  rolesOffered: ['Graduate Engineer Trainee', 'Software Developer'],
  hiringProcess: [
    { roundName: 'Aptitude Test', description: 'Quant, logical, English', order: 1 },
    { roundName: 'Technical Interview', description: 'Basics of programming & branch subjects', order: 2 },
    { roundName: 'HR Interview', description: 'General discussion', order: 3 }
  ]
},
{
  companyName: 'JP Morgan Chase',
  type: 'Service',
  averagePackage: 18.0,
  departmentsTargeted: ['CSE', 'IT', 'Finance', 'Economics'],
  toughnessPercentage: 78,
  rolesOffered: ['Software Engineer', 'Business Analyst'],
  hiringProcess: [
    { roundName: 'Online Coding Test', description: '2 medium problems', order: 1 },
    { roundName: 'Technical Interview', description: 'Data structures, OOP, SQL', order: 2 },
    { roundName: 'Fit Interview', description: 'Behavioral & resume discussion', order: 3 }
  ]
},
{
  companyName: 'Siemens',
  type: 'Product',
  averagePackage: 14.0,
  departmentsTargeted: ['Electrical', 'Mechanical', 'CSE', 'Instrumentation'],
  toughnessPercentage: 72,
  rolesOffered: ['Software Engineer', 'Automation Engineer'],
  hiringProcess: [
    { roundName: 'Technical Test', description: 'Domain MCQs & coding', order: 1 },
    { roundName: 'Technical Interview', description: 'Core subjects & projects', order: 2 },
    { roundName: 'Managerial Interview', description: 'Teamwork & problem solving', order: 3 }
  ]
},
{
  companyName: 'Zomato',
  type: 'Product',
  averagePackage: 21.0,
  departmentsTargeted: ['CSE', 'IT', 'MBA'],
  toughnessPercentage: 74,
  rolesOffered: ['Software Development Engineer', 'Product Manager'],
  hiringProcess: [
    { roundName: 'Coding Challenge', description: '2 hours, algorithms', order: 1 },
    { roundName: 'Technical Interview', description: 'System design & scalability', order: 2 },
    { roundName: 'Product Sense Round', description: 'Case study & product thinking', order: 3 },
    { roundName: 'HR Round', description: 'Culture fit', order: 4 }
  ]
},
{
  companyName: 'Qualcomm',
  type: 'Product',
  averagePackage: 24.0,
  departmentsTargeted: ['ECE', 'CSE', 'VLSI'],
  toughnessPercentage: 86,
  rolesOffered: ['DSP Engineer', 'Embedded Software Engineer'],
  hiringProcess: [
    { roundName: 'Online Test', description: 'C, C++, digital circuits', order: 1 },
    { roundName: 'Technical Round 1', description: 'Wireless communication, OS', order: 2 },
    { roundName: 'Technical Round 2', description: 'Coding & architecture', order: 3 },
    { roundName: 'Managerial Round', description: 'Project discussion', order: 4 }
  ]
},
{
  companyName: 'Accenture',
  type: 'Service',
  averagePackage: 7.0,
  departmentsTargeted: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'],
  toughnessPercentage: 50,
  rolesOffered: ['Associate Software Engineer', 'Application Developer'],
  hiringProcess: [
    { roundName: 'Cognitive & Technical Assessment', description: 'Aptitude, reasoning, coding', order: 1 },
    { roundName: 'Communication Assessment', description: 'English speaking & writing', order: 2 },
    { roundName: 'HR Interview', description: 'General fit & availability', order: 3 }
  ]
}

];

const seedCompanies = async () => {
  await connectDB();
  try {
    await Company.deleteMany(); // optional: clear existing
    await Company.insertMany(companies);
    console.log('✅ 25 companies seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedCompanies();