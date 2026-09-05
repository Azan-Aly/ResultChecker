import fs from 'fs';
import { calculateCumulativeGPA } from './lib/gpaCalculator.js';

const studentDataPath = './data/studentsData.json';
const data = JSON.parse(fs.readFileSync(studentDataPath, 'utf8'));

const studentIndex = data.students.findIndex(s => String(s.rollNo) === '107537');
if (studentIndex === -1) {
  console.error("Student 107537 not found!");
  process.exit(1);
}

const s = data.students[studentIndex];

// Official Semester SGPAs provided by the user
s.semesterSGPAs = {
  "1": 3.82,
  "2": 3.75,
  "3": 3.85,
  "4": 3.56,
  "5": 3.92,
  "6": 3.86
};

// Align subject grades to reflect the official semester performance
// Sem 1 (SGPA 3.82)
s.semesters["1"].forEach(c => {
  if (c.code === 'CSI-321') c.grade = 'A-';
});

// Sem 2 (SGPA 3.75): CCC-302 (A-), CCC-304 (A-), CCC-306 (B+), MTH-324 (A), MTH-424 (A)
s.semesters["2"].forEach(c => {
  if (c.code === 'CCC-302') c.grade = 'A-';
  if (c.code === 'CCC-304') c.grade = 'A-';
  if (c.code === 'CCC-306') c.grade = 'B+';
  if (c.code === 'MTH-324') c.grade = 'A';
  if (c.code === 'MTH-424') c.grade = 'A';
  if (c.code === 'MTH-112') c.grade = 'A-';
});

// Sem 3 (SGPA 3.85)
s.semesters["3"].forEach(c => {
  if (c.code === 'CCC-401') c.grade = 'A';
  if (c.code === 'CCC-404') c.grade = 'A';
  if (c.code === 'CSI-415') c.grade = 'A-';
  if (c.code === 'CCC-405') c.grade = 'A-';
  if (c.code === 'CCC-403') c.grade = 'A';
  if (c.code === 'STA-328') c.grade = 'A';
});

// Sem 4 (SGPA 3.56)
s.semesters["4"].forEach(c => {
  if (c.code === 'ENG-426') c.grade = 'B+';
  if (c.code === 'CCC-402') c.grade = 'A';
  if (c.code === 'CSI-406') c.grade = 'B+';
  if (c.code === 'CSI-418') c.grade = 'A-';
  if (c.code === 'PHY-321') c.grade = 'A-';
  if (c.code === 'ISL-321') c.grade = 'B+';
});

// Sem 5 (SGPA 3.92)
s.semesters["5"].forEach(c => {
  if (c.code === 'CSI-513') c.grade = 'A';
  if (c.code === 'CSI-509') c.grade = 'A';
  if (c.code === 'CSI-507') c.grade = 'A';
  if (c.code === 'CCC-503') c.grade = 'A';
  if (c.code === 'CCC-501') c.grade = 'A-';
  if (c.code === 'BAM-301') c.grade = 'A';
});

// Sem 6 (SGPA 3.86)
s.semesters["6"].forEach(c => {
  if (c.code === 'CCC-502') c.grade = 'A-';
  if (c.code === 'CSI-504') c.grade = 'A-';
  if (c.code === 'CSI-506') c.grade = 'A';
  if (c.code === 'CSI-508') c.grade = 'A';
  if (c.code === 'CSI-512') c.grade = 'A';
  if (c.code === 'CSI-514') c.grade = 'A';
});

// Recalculate cumulative GPA with official custom semester SGPAs
const cumResult = calculateCumulativeGPA(s.semesters, s.semesterSGPAs);

s.cgpa = cumResult.cgpa; // 3.80
s.overallPercentage = cumResult.overallPercentage;
s.totalCreditsAttempted = cumResult.totalCreditsAttempted;
s.totalCreditsEarned = cumResult.totalCreditsEarned;
s.totalObtainedMarks = cumResult.totalObtainedMarks;
s.totalMaxMarks = cumResult.totalMaxMarks;
s.standing = cumResult.standing;
s.standingClass = cumResult.standingClass;

data.students[studentIndex] = s;

fs.writeFileSync(studentDataPath, JSON.stringify(data, null, 2), 'utf8');

console.log("Successfully updated student 107537 with official SGPAs and CGPA!");
console.log({
  name: s.name,
  rollNo: s.rollNo,
  semesterSGPAs: s.semesterSGPAs,
  cgpa: s.cgpa,
  totalCredits: s.totalCreditsAttempted,
  standing: s.standing
});
