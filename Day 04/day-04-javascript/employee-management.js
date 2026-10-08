const employees = [
    {
        id: 1,
        name: "Shaikh Sabur",
        department: "IT",
        position: "MERN Developer",
        salary: 600000,
        experience: 1,
        status: "Active"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        department: "HR",
        position: "HR Executive",
        salary: 450000,
        experience: 2,
        status: "Active"
    },
    {
        id: 3,
        name: "Priya Patel",
        department: "IT",
        position: "Frontend Developer",
        salary: 550000,
        experience: 2,
        status: "Active"
    },
    {
        id: 4,
        name: "Amit Kumar",
        department: "Finance",
        position: "Accountant",
        salary: 500000,
        experience: 3,
        status: "Inactive"
    },
    {
        id: 5,
        name: "Neha Singh",
        department: "Marketing",
        position: "Marketing Executive",
        salary: 480000,
        experience: 2,
        status: "Active"
    },
    {
        id: 6,
        name: "Arjun Verma",
        department: "IT",
        position: "Backend Developer",
        salary: 700000,
        experience: 3,
        status: "Active"
    },
    {
        id: 7,
        name: "Sneha Joshi",
        department: "HR",
        position: "HR Manager",
        salary: 750000,
        experience: 5,
        status: "Active"
    },
    {
        id: 8,
        name: "Vikas Patil",
        department: "Finance",
        position: "Financial Analyst",
        salary: 650000,
        experience: 4,
        status: "Inactive"
    },
    {
        id: 9,
        name: "Pooja Deshmukh",
        department: "IT",
        position: "Software Developer",
        salary: 800000,
        experience: 4,
        status: "Active"
    },
    {
        id: 10,
        name: "Rohit More",
        department: "Marketing",
        position: "SEO Specialist",
        salary: 420000,
        experience: 1,
        status: "Active"
    }
];


// 1. Display all employees

console.log("All Employees:");

employees.forEach((employee) => {
    console.log(employee);
});


// 2. Find an employee by ID

const employee = employees.find((employee) => {
    return employee.id === 5;
});

console.log("Employee with ID 5:");
console.log(employee);


// 3. Filter employees by department

const itEmployees = employees.filter((employee) => {
    return employee.department === "IT";
});

console.log("IT Department Employees:");
console.log(itEmployees);


// 4. Filter employees with salary above 600000

const highSalaryEmployees = employees.filter((employee) => {
    return employee.salary > 600000;
});

console.log("Employees with salary above ₹6 Lakh:");
console.log(highSalaryEmployees);


// 5. Filter active employees

const activeEmployees = employees.filter((employee) => {
    return employee.status === "Active";
});

console.log("Active Employees:");
console.log(activeEmployees);


// 6. Create an array containing only employee names

const employeeNames = employees.map((employee) => {
    return employee.name;
});

console.log("Employee Names:");
console.log(employeeNames);