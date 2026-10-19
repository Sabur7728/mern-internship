require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'), Department = require('./models/Department'), Employee = require('./models/Employee'), Attendance = require('./models/Attendance'), Leave = require('./models/Leave');
const { day } = require('./utils/helpers');
const depts = [['Engineering', 'Software development', 'Bangalore'], ['Human Resources', 'People operations', 'Mumbai'], ['Finance', 'Accounts and audit', 'Pune'], ['Marketing', 'Brand and growth', 'Delhi'], ['Sales', 'Revenue team', 'Mumbai'], ['Operations', 'Business operations', 'Nagpur']];
const rows = `Rahul|Sharma|0|Frontend Developer|Active|Full-time
Priya|Singh|1|HR Executive|Active|Full-time
Arjun|Kumar|2|Financial Analyst|Active|Full-time
Neha|Verma|3|Marketing Executive|Active|Full-time
Vikash|Gupta|4|Sales Executive|On Leave|Full-time
Aman|Khan|0|Backend Developer|Active|Full-time
Sana|Shaikh|0|QA Engineer|Active|Full-time
Rohit|Patil|0|DevOps Engineer|Active|Full-time
Pooja|Deshmukh|0|Full Stack Developer|Active|Full-time
Kiran|Joshi|1|Recruiter|Active|Full-time
Meera|Nair|2|Accountant|Active|Full-time
Sameer|Ali|2|Finance Manager|Active|Full-time
Anita|Rao|3|Content Strategist|Active|Full-time
Dev|Malhotra|3|SEO Specialist|Active|Contract
Isha|Kapoor|4|Sales Manager|Active|Full-time
Nikhil|Jain|4|Business Development Executive|Active|Full-time
Farhan|Qureshi|5|Operations Manager|Active|Full-time
Swati|Kulkarni|5|Logistics Coordinator|Active|Full-time
Manoj|Yadav|5|Operations Executive|Active|Contract
Tanvi|Mehta|0|UI/UX Designer|Active|Full-time
Yash|Thakur|0|Software Intern|Active|Intern
Riya|Chavan|3|Social Media Manager|Active|Part-time
Harsh|Vora|2|Auditor|Resigned|Full-time
Zoya|Pathan|1|HR Assistant|Inactive|Full-time
Omkar|Pawar|4|Sales Intern|Active|Intern
Admin|User|5|System Administrator|Active|Full-time`.split('\n').map(l => l.split('|'));
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Department, Employee, Attendance, Leave].map(M => M.deleteMany({})));
  const D = await Department.insertMany(depts.map(([name, description, location]) => ({ name, description, location, manager: name + ' Manager' })));
  const E = [];
  for (let i = 0; i < rows.length; i++) {
    const [first, last, d, designation, status, employmentType] = rows[i];
    const role = i === 1 ? 'hr' : i === 25 ? 'admin' : 'employee';
    const email = (i === 1 ? 'hr' : first.toLowerCase()) + '@worksphere.com';
    const u = await User.create({ name: `${first} ${last}`, email, role, password: role === 'admin' ? 'Admin@123' : role === 'hr' ? 'Hr@12345' : 'Employee@123', isActive: !['Inactive', 'Resigned'].includes(status) });
    E.push(await Employee.create({ employeeId: 'EMP' + String(i + 1).padStart(3, '0'), user: u._id, firstName: first, lastName: last, email, phone: '98765' + String(43210 + i), gender: i % 3 === 1 ? 'Female' : 'Male', dateOfBirth: new Date(1992 + (i % 8), i % 12, 10), department: D[+d]._id, designation, joiningDate: new Date(2021 + (i % 5), i % 12, 5), employmentType, status, salary: 300000 + i * 25000, manager: depts[+d][0] + ' Manager', city: depts[+d][2], state: 'Maharashtra', address: 'Sample Street ' + (i + 1), postalCode: '4' + String(10000 + i) }));
  }
  const T = [['Present', '09:25', '18:10', 8.75], ['Present', '09:30', '18:15', 8.75], ['Late', '09:55', '18:05', 8.17], ['Half Day', '09:30', '13:30', 4], ['Work From Home', '09:40', '18:20', 8.67]];
  for (const e of E.filter(x => x.status === 'Active')) for (let k = 0; k < 7; k++) {
    const date = day(new Date(Date.now() - k * 864e5)), t = T[Math.floor(Math.random() * T.length)];
    await Attendance.create(Math.random() < 0.08 ? { employee: e._id, date, status: 'Absent', remarks: 'Not informed' } : { employee: e._id, date, status: t[0], checkIn: t[1], checkOut: t[2], workHours: t[3] });
  }
  const fut = n => day(new Date(Date.now() + n * 864e5));
  const hr = await User.findOne({ role: 'hr' });
  await Leave.create([
    { employee: E[0]._id, leaveType: 'Casual Leave', startDate: fut(5), endDate: fut(7), days: 3, reason: 'Family function' },
    { employee: E[2]._id, leaveType: 'Sick Leave', startDate: fut(2), endDate: fut(3), days: 2, reason: 'Fever', status: 'Approved', reviewedBy: hr._id, reviewedAt: new Date() },
    { employee: E[5]._id, leaveType: 'Annual Leave', startDate: fut(10), endDate: fut(14), days: 5, reason: 'Vacation', status: 'Rejected', reviewComment: 'Project deadline', reviewedBy: hr._id, reviewedAt: new Date() }]);
  console.log('Seeded: 6 departments, 26 employees, attendance and leaves.\nadmin@worksphere.com / Admin@123\nhr@worksphere.com / Hr@12345\nrahul@worksphere.com / Employee@123');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
