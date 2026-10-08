function calculateSalary(basic, house, transport, other) {
    const monthlySalary = basic + house + transport + other;

    const annualSalary = monthlySalary * 12;

    return {
        monthlySalary: monthlySalary,
        annualSalary: annualSalary
    };
}

const salary = calculateSalary(30000, 5000, 3000, 2000);

console.log("Monthly Salary:", salary.monthlySalary);
console.log("Annual Salary:", salary.annualSalary);