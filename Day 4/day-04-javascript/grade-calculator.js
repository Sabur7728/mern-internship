function calculateGrade(marks) {

    if (marks >= 90) {
        return "A";
    } 
    else if (marks >= 80) {
        return "B";
    } 
    else if (marks >= 70) {
        return "C";
    } 
    else if (marks >= 60) {
        return "D";
    } 
    else {
        return "F";
    }
}


// Test with multiple scores
console.log("Marks: 95, Grade:", calculateGrade(95));
console.log("Marks: 85, Grade:", calculateGrade(85));
console.log("Marks: 75, Grade:", calculateGrade(75));
console.log("Marks: 65, Grade:", calculateGrade(65));
console.log("Marks: 45, Grade:", calculateGrade(45));