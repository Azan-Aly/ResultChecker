/**
 * Pakistan Higher Education Commission (HEC) & National Computing Education Accreditation
 * Standard Grading System & Credit-Hour Marks Scaling:
 * 
 * 1 Credit Hour  = 20 Max Marks (Sess: 4, Mid: 6, Fin: 10)
 * 2 Credit Hours = 40 Max Marks (Sess: 8, Mid: 12, Fin: 20)
 * 3 Credit Hours = 60 Max Marks (Sess: 12, Mid: 18, Fin: 30)
 * 4 Credit Hours = 80 Max Marks (Sess: 16, Mid: 24, Fin: 40)
 */

export const PAKISTAN_HEC_GRADING_SCALE = [
  { minPct: 85, maxPct: 100, grade: "A", points: 4.00, remarks: "Exceptional / Outstanding" },
  { minPct: 80, maxPct: 84.99, grade: "A-", points: 3.67, remarks: "Excellent" },
  { minPct: 75, maxPct: 79.99, grade: "B+", points: 3.33, remarks: "Very Good" },
  { minPct: 70, maxPct: 74.99, grade: "B", points: 3.00, remarks: "Good" },
  { minPct: 65, maxPct: 69.99, grade: "B-", points: 2.67, remarks: "Above Average" },
  { minPct: 61, maxPct: 64.99, grade: "C+", points: 2.33, remarks: "Average" },
  { minPct: 58, maxPct: 60.99, grade: "C", points: 2.00, remarks: "Satisfactory" },
  { minPct: 55, maxPct: 57.99, grade: "C-", points: 1.67, remarks: "Below Average" },
  { minPct: 50, maxPct: 54.99, grade: "D", points: 1.00, remarks: "Pass" },
  { minPct: 0, maxPct: 49.99, grade: "F", points: 0.00, remarks: "Fail" }
];

export function getMaxMarksForCredits(credits) {
  const cr = Number(credits) || 3;
  return cr * 20; // 1 Cr = 20, 2 Cr = 40, 3 Cr = 60, 4 Cr = 80
}

export function getGradeFromPercentage(percentage) {
  const roundedPct = Math.round(Number(percentage) * 10) / 10;
  for (const item of PAKISTAN_HEC_GRADING_SCALE) {
    if (roundedPct >= item.minPct && roundedPct <= item.maxPct) {
      return { grade: item.grade, points: item.points, remarks: item.remarks };
    }
  }
  if (roundedPct > 100) return { grade: "A", points: 4.00, remarks: "Exceptional / Outstanding" };
  return { grade: "F", points: 0.00, remarks: "Fail" };
}

export function computeCourseResult(course) {
  const credits = Number(course.credits || 3);
  const maxMarks = getMaxMarksForCredits(credits);
  const sessionalMax = Math.round(maxMarks * 0.20 * 10) / 10; // 20%
  const midtermMax = Math.round(maxMarks * 0.30 * 10) / 10;   // 30%
  const finalMax = Math.round(maxMarks * 0.50 * 10) / 10;     // 50%

  let sessional = 0;
  let midterm = 0;
  let finalMarks = 0;
  let totalMarks = 0;

  if (course.sessional !== undefined || course.midterm !== undefined || course.final !== undefined) {
    sessional = Number(course.sessional || 0);
    midterm = Number(course.midterm || 0);
    finalMarks = Number(course.final || 0);
    totalMarks = Math.round((sessional + midterm + finalMarks) * 10) / 10;
  } else if (course.totalMarks !== undefined || course.marks !== undefined) {
    const rawTotal = Number(course.totalMarks ?? course.marks);
    totalMarks = Math.round(rawTotal * 10) / 10;
    sessional = Math.round((totalMarks * 0.20) * 10) / 10;
    midterm = Math.round((totalMarks * 0.30) * 10) / 10;
    finalMarks = Math.round((totalMarks - sessional - midterm) * 10) / 10;
  }

  // Calculate percentage based on Credit Hour Max Marks
  const percentage = maxMarks > 0 ? Math.round(((totalMarks / maxMarks) * 100) * 10) / 10 : 0.0;
  const { grade, points, remarks } = getGradeFromPercentage(percentage);
  
  const earnedCredits = points > 0 ? credits : 0;
  const weightedPoints = Math.round(points * credits * 100) / 100;

  return {
    code: course.code,
    title: course.title,
    credits,
    maxMarks,
    sessionalMax,
    midtermMax,
    finalMax,
    sessional,
    midterm,
    final: finalMarks,
    totalMarks,
    percentage,
    grade,
    gradePoints: points,
    weightedPoints,
    earnedCredits,
    isPassed: points > 0,
    remarks
  };
}

export function calculateSemesterGPA(coursesList) {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalWeightedPoints = 0;
  let totalObtainedMarks = 0;
  let totalMaxMarks = 0;

  const processedCourses = (coursesList || []).map(computeCourseResult);

  for (const course of processedCourses) {
    totalCredits += course.credits;
    earnedCredits += course.earnedCredits;
    totalWeightedPoints += course.weightedPoints;
    totalObtainedMarks += course.totalMarks;
    totalMaxMarks += course.maxMarks;
  }

  const sgpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0.00;
  const percentage = totalMaxMarks > 0 ? Math.round(((totalObtainedMarks / totalMaxMarks) * 100) * 10) / 10 : 0.0;

  return {
    courses: processedCourses,
    totalCredits,
    earnedCredits,
    totalObtainedMarks: Math.round(totalObtainedMarks * 10) / 10,
    totalMaxMarks,
    totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
    sgpa: Number(sgpa.toFixed(2)),
    percentage: Number(percentage.toFixed(1))
  };
}

export function calculateCumulativeGPA(allSemestersMap) {
  let cumulativeTotalCredits = 0;
  let cumulativeEarnedCredits = 0;
  let cumulativeWeightedPoints = 0;
  let cumulativeObtainedMarks = 0;
  let cumulativeMaxMarks = 0;

  const semesterResults = {};
  const semNumbers = Object.keys(allSemestersMap || {}).map(Number).sort((a, b) => a - b);

  for (const semNum of semNumbers) {
    const semData = calculateSemesterGPA(allSemestersMap[semNum]);
    semesterResults[semNum] = semData;

    cumulativeTotalCredits += semData.totalCredits;
    cumulativeEarnedCredits += semData.earnedCredits;
    cumulativeWeightedPoints += semData.totalWeightedPoints;
    cumulativeObtainedMarks += semData.totalObtainedMarks;
    cumulativeMaxMarks += semData.totalMaxMarks;
  }

  const cgpa = cumulativeTotalCredits > 0 ? Math.round((cumulativeWeightedPoints / cumulativeTotalCredits) * 100) / 100 : 0.00;
  const overallPercentage = cumulativeMaxMarks > 0 ? Math.round(((cumulativeObtainedMarks / cumulativeMaxMarks) * 100) * 10) / 10 : 0.0;

  let standing = "Good Standing";
  let standingClass = "badge-teal";
  if (cgpa >= 3.70) {
    standing = "HoD's Honor List";
    standingClass = "badge-gold";
  } else if (cgpa >= 3.50) {
    standing = "High Distinction";
    standingClass = "badge-purple";
  } else if (cgpa >= 3.00) {
    standing = "Merit Standing";
    standingClass = "badge-blue";
  } else if (cgpa >= 2.00) {
    standing = "Good Standing";
    standingClass = "badge-teal";
  } else {
    standing = "Academic Warning";
    standingClass = "badge-danger";
  }

  return {
    cgpa: Number(cgpa.toFixed(2)),
    overallPercentage: Number(overallPercentage.toFixed(1)),
    totalCreditsAttempted: cumulativeTotalCredits,
    totalCreditsEarned: cumulativeEarnedCredits,
    totalObtainedMarks: Math.round(cumulativeObtainedMarks * 10) / 10,
    totalMaxMarks: cumulativeMaxMarks,
    standing,
    standingClass,
    semesterResults
  };
}
