
const fs = require('fs');

const students = JSON.parse(fs.readFileSync('dummyStudents.json'));

const getRandomStatus = () => {
  const statuses = ['Absent', 'Present'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomClass = () => {
    const classes = ['1st', '2nd', '3rd', '4th', '5th']; // Add more classes as needed
    return classes[Math.floor(Math.random() * classes.length)];
  };

students.forEach((student) => {
//   const createdAt = getRandomDate(new Date(2021, 0, 1), new Date());
//   const modifiedAt = getRandomDate(createdAt, new Date());
//   student.status = getRandomStatus();
//   student.createdAt = createdAt;
    student.class = getRandomClass();
});

fs.writeFileSync('dummyStudents.json', JSON.stringify(students, null, 2));
