
/**
 * Test Data Generation Script
 * 
 * This Node.js script is used to generate and manipulate dummy student data
 * for testing and development purposes in the Signal School Frontend application.
 * 
 * Features:
 * - Reads existing dummy student data from JSON file
 * - Generates random attendance statuses (Present/Absent)
 * - Generates random dates within specified ranges
 * - Assigns random class levels to students
 * - Writes updated data back to JSON file
 * 
 * This script helps create realistic test data for development and testing
 * of student management features without requiring real student information.
 * 
 * Usage: node test.js (run from the directory containing dummyStudents.json)
 */

const fs = require('fs');

// Read existing dummy student data from JSON file
const students = JSON.parse(fs.readFileSync('dummyStudents.json'));

/**
 * Generates a random attendance status
 * 
 * @returns {string} Random status - either 'Absent' or 'Present'
 */
const getRandomStatus = () => {
  const statuses = ['Absent', 'Present'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Generates a random date between two given dates
 * 
 * @param {Date} start - Start date for the range
 * @param {Date} end - End date for the range
 * @returns {Date} Random date within the specified range
 */
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generates a random class level
 * 
 * @returns {string} Random class level (1st through 5th grade)
 */
const getRandomClass = () => {
    const classes = ['1st', '2nd', '3rd', '4th', '5th']; // Add more classes as needed
    return classes[Math.floor(Math.random() * classes.length)];
};

// Process each student in the dummy data
students.forEach((student) => {
    // Commented out code for generating random dates and status:
    // const createdAt = getRandomDate(new Date(2021, 0, 1), new Date());
    // const modifiedAt = getRandomDate(createdAt, new Date());
    // student.status = getRandomStatus();
    // student.createdAt = createdAt;
    
    // Assign a random class to each student
    student.class = getRandomClass();
});

// Write the updated student data back to the JSON file
fs.writeFileSync('dummyStudents.json', JSON.stringify(students, null, 2));
