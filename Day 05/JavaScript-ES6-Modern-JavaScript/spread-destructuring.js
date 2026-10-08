// Day 5 - Spread and Destructuring

const user = {
    name: "Rohit",
    email: "rohit@example.com",
    role: "Developer",
    skills: ["JavaScript", "React"]
};


// Create a new object using spread operator

const updatedUser = {
    ...user,

    role: "MERN Stack Developer",

    skills: [
        ...user.skills,
        "Node.js",
        "Express",
        "MongoDB"
    ]
};


// Display original user

console.log("Original User:");
console.log(user);


// Display updated user

console.log("\nUpdated User:");
console.log(updatedUser);


// Destructuring

const {
    name,
    email,
    role,
    skills
} = updatedUser;


console.log("\nDestructured Data:");

console.log("Name:", name);
console.log("Email:", email);
console.log("Role:", role);
console.log("Skills:", skills);