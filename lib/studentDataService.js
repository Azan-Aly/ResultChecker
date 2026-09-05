import studentsDataJson from "../data/studentsData.json";
import { calculateSemesterGPA, calculateCumulativeGPA } from "./gpaCalculator.js";

// In-memory student cache that can be augmented or updated in the client session
let studentsCache = null;

function getInitialStudents() {
  if (!studentsCache) {
    // Clone raw JSON so mutations don't corrupt the base bundle
    studentsCache = JSON.parse(JSON.stringify(studentsDataJson.students));
  }
  return studentsCache;
}

export function getBatches() {
  return studentsDataJson.batches || [];
}

export function getCurriculum() {
  return studentsDataJson.curriculum || {};
}

export function getSemesterCurriculum(sem) {
  const semNum = String(sem);
  return studentsDataJson.curriculum?.semesters?.[semNum] || [];
}

export function getAllStudents() {
  return getInitialStudents();
}

export function getStudentsList({ batchId = "all", semester = "all", search = "" } = {}) {
  const students = getInitialStudents();
  let filtered = [...students];

  if (batchId && batchId !== "all") {
    filtered = filtered.filter(s => s.batchId === batchId || s.batch === batchId);
  }

  if (semester && semester !== "all") {
    const semNum = parseInt(semester, 10);
    filtered = filtered.filter(s => (s.completedSemesters >= semNum) || (s.currentSemester === semNum));
  }

  if (search) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(s =>
      s.rollNo.toLowerCase().includes(query) ||
      s.regNo.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query)
    );
  }

  return filtered.map(s => ({
    id: s.id,
    rollNo: s.rollNo,
    regNo: s.regNo,
    name: s.name,
    fatherName: s.fatherName,
    batch: s.batch,
    batchId: s.batchId,
    section: s.section,
    completedSemesters: s.completedSemesters,
    currentSemester: s.currentSemester,
    cgpa: s.cgpa,
    standing: s.standing,
    standingClass: s.standingClass
  }));
}

export function getStudentResult(rollNoQuery, requestedSem = null) {
  if (!rollNoQuery) return null;
  const students = getInitialStudents();
  const rollNo = rollNoQuery.trim().toUpperCase();
  
  // Find exact roll number match first, or matching prefix / regNo / name
  let student = students.find(s => s.rollNo.toUpperCase() === rollNo);
  if (!student) {
    student = students.find(s => 
      s.regNo.toUpperCase() === rollNo || 
      s.rollNo.toUpperCase().includes(rollNo) ||
      s.name.toUpperCase().includes(rollNo)
    );
  }

  if (!student) return null;

  // Recompute cumulative GPA on latest student semester records
  const gpaSummary = calculateCumulativeGPA(student.semesters, student.semesterSGPAs);
  student.cgpa = gpaSummary.cgpa;
  student.overallPercentage = gpaSummary.overallPercentage;
  student.totalCreditsAttempted = gpaSummary.totalCreditsAttempted;
  student.totalCreditsEarned = gpaSummary.totalCreditsEarned;
  student.standing = gpaSummary.standing;
  student.standingClass = gpaSummary.standingClass;

  // Compute Rank in batch
  const batchPeers = students.filter(s => s.batchId === student.batchId);
  const sortedBatchPeers = [...batchPeers].sort((a, b) => b.cgpa - a.cgpa);
  const batchRank = sortedBatchPeers.findIndex(s => s.rollNo === student.rollNo) + 1;
  const batchTotal = batchPeers.length;

  // Determine active semester
  let activeSem = requestedSem && requestedSem !== "all" 
    ? parseInt(requestedSem, 10) 
    : student.completedSemesters;

  if (!student.semesters[activeSem]) {
    activeSem = student.completedSemesters || 1;
  }

  const rawSemesterCourses = student.semesters[activeSem] || [];
  const semesterResult = calculateSemesterGPA(rawSemesterCourses);
  if (student.semesterSGPAs && student.semesterSGPAs[activeSem] !== undefined) {
    semesterResult.sgpa = Number(student.semesterSGPAs[activeSem]);
    semesterResult.totalWeightedPoints = Math.round(semesterResult.sgpa * semesterResult.totalCredits * 100) / 100;
  }

  // Compute multi-semester progression trend
  const progression = [];
  let runningCredits = 0;
  let runningWeightedPoints = 0;

  const sortedSemesters = Object.keys(student.semesters).map(Number).sort((a, b) => a - b);
  for (const sNum of sortedSemesters) {
    const sResult = calculateSemesterGPA(student.semesters[sNum]);
    if (student.semesterSGPAs && student.semesterSGPAs[sNum] !== undefined) {
      sResult.sgpa = Number(student.semesterSGPAs[sNum]);
      sResult.totalWeightedPoints = Math.round(sResult.sgpa * sResult.totalCredits * 100) / 100;
    }
    runningCredits += sResult.totalCredits;
    runningWeightedPoints += sResult.totalWeightedPoints;
    const runningCGPA = runningCredits > 0 ? Math.round((runningWeightedPoints / runningCredits) * 100) / 100 : 0;

    progression.push({
      semester: sNum,
      sgpa: sResult.sgpa,
      cgpa: runningCGPA,
      credits: sResult.totalCredits,
      percentage: sResult.percentage
    });
  }

  const availableSemesters = sortedSemesters;

  return {
    student: {
      id: student.id,
      rollNo: student.rollNo,
      regNo: student.regNo,
      name: student.name,
      fatherName: student.fatherName,
      batch: student.batch,
      batchId: student.batchId,
      batchLabel: student.batchLabel,
      degree: studentsDataJson.curriculum.degreeName,
      degreeCode: studentsDataJson.curriculum.degreeCode,
      section: student.section,
      shift: student.shift,
      completedSemesters: student.completedSemesters,
      currentSemester: student.currentSemester,
      cgpa: student.cgpa,
      overallPercentage: student.overallPercentage,
      totalCreditsAttempted: student.totalCreditsAttempted,
      totalCreditsEarned: student.totalCreditsEarned,
      totalObtainedMarks: gpaSummary.totalObtainedMarks,
      totalMaxMarks: gpaSummary.totalMaxMarks,
      standing: student.standing,
      standingClass: student.standingClass,
      batchRank,
      batchTotal
    },
    selectedSemester: activeSem,
    semesterResult: {
      semester: activeSem,
      ...semesterResult
    },
    progression,
    availableSemesters,
    fullAcademicHistory: gpaSummary.semesterResults
  };
}

export function getBatchAnalytics(batchId = "all") {
  const students = getInitialStudents();
  let pool = [...students];

  if (batchId && batchId !== "all") {
    pool = pool.filter(s => s.batchId === batchId || s.batch === batchId);
  }

  if (pool.length === 0) {
    return {
      batchId,
      totalStudents: 0,
      averageCGPA: 0,
      highestCGPA: 0,
      lowestCGPA: 0,
      passRate: 0,
      leaderboard: [],
      distribution: []
    };
  }

  const cgpas = pool.map(s => s.cgpa);
  const totalCgpa = cgpas.reduce((a, b) => a + b, 0);
  const averageCGPA = Number((totalCgpa / pool.length).toFixed(2));
  const highestCGPA = Math.max(...cgpas);
  const lowestCGPA = Math.min(...cgpas);

  const passingCount = pool.filter(s => s.cgpa >= 2.0).length;
  const passRate = Math.round((passingCount / pool.length) * 100);

  // Top 5 rankers
  const leaderboard = [...pool]
    .sort((a, b) => b.cgpa - a.cgpa)
    .slice(0, 5)
    .map((s, index) => ({
      rank: index + 1,
      rollNo: s.rollNo,
      name: s.name,
      batch: s.batch,
      section: s.section,
      cgpa: s.cgpa,
      standing: s.standing,
      standingClass: s.standingClass
    }));

  // GPA Distribution buckets
  const distribution = [
    { range: "3.70 - 4.00", label: "HoD's List", count: pool.filter(s => s.cgpa >= 3.70).length, color: "var(--grad-gold)" },
    { range: "3.50 - 3.69", label: "High Distinction", count: pool.filter(s => s.cgpa >= 3.50 && s.cgpa < 3.70).length, color: "var(--grad-purple)" },
    { range: "3.00 - 3.49", label: "Merit", count: pool.filter(s => s.cgpa >= 3.00 && s.cgpa < 3.50).length, color: "var(--primary)" },
    { range: "2.00 - 2.99", label: "Good Standing", count: pool.filter(s => s.cgpa >= 2.00 && s.cgpa < 3.00).length, color: "var(--accent-emerald)" },
    { range: "< 2.00", label: "Warning", count: pool.filter(s => s.cgpa < 2.00).length, color: "var(--accent-rose)" }
  ];

  return {
    batchId,
    totalStudents: pool.length,
    averageCGPA,
    highestCGPA,
    lowestCGPA,
    passRate,
    leaderboard,
    distribution
  };
}

export function updateStudentGrade(rollNoQuery, semester, courseCode, sessional, midterm, finalMarks) {
  const students = getInitialStudents();
  const rollNo = rollNoQuery.trim().toUpperCase();
  const student = students.find(s => s.rollNo.toUpperCase() === rollNo);

  if (!student) {
    return { success: false, message: `Student '${rollNo}' not found.` };
  }

  const semNum = parseInt(semester, 10);
  if (!student.semesters[semNum]) {
    student.semesters[semNum] = [];
    if (semNum > student.completedSemesters) {
      student.completedSemesters = semNum;
      student.currentSemester = Math.min(8, semNum + 1);
    }
  }

  const semCourses = student.semesters[semNum];
  const courseIdx = semCourses.findIndex(c => c.code.toUpperCase() === courseCode.toUpperCase());

  // Find course definition from curriculum for credit count and title
  const curriculumCourses = getSemesterCurriculum(semNum);
  const courseDef = curriculumCourses.find(c => c.code.toUpperCase() === courseCode.toUpperCase()) || {
    code: courseCode,
    title: courseCode,
    credits: 3
  };

  const updatedCourseObj = {
    code: courseDef.code,
    title: courseDef.title,
    credits: courseDef.credits,
    sessional: Number(sessional),
    midterm: Number(midterm),
    final: Number(finalMarks)
  };

  if (courseIdx >= 0) {
    semCourses[courseIdx] = updatedCourseObj;
  } else {
    semCourses.push(updatedCourseObj);
  }

  // Recalculate CGPA
  const gpaSummary = calculateCumulativeGPA(student.semesters);
  student.cgpa = gpaSummary.cgpa;
  student.overallPercentage = gpaSummary.overallPercentage;
  student.totalCreditsAttempted = gpaSummary.totalCreditsAttempted;
  student.totalCreditsEarned = gpaSummary.totalCreditsEarned;
  student.standing = gpaSummary.standing;
  student.standingClass = gpaSummary.standingClass;

  return {
    success: true,
    message: `Marks updated for ${courseCode} (Semester ${semNum}). New CGPA: ${student.cgpa}`,
    student
  };
}
