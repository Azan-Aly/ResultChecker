"use client";

import React from "react";

export default function TranscriptPrintView({ resultData }) {
  if (!resultData || !resultData.student) return null;

  const { student, semesterResult } = resultData;
  const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="transcript-print-sheet" aria-hidden="true">
      {/* Official University Header */}
      <div className="transcript-header">
        <div className="uni-sub-header">FACULTY OF INFORMATION TECHNOLOGY & COMPUTER SCIENCE</div>
        <div className="transcript-title">DEPARTMENT OF COMPUTER SCIENCE</div>
        <div className="transcript-subtitle">OFFICIAL DETAILED MARKS CERTIFICATE (DMC)</div>
        <div className="program-desc">
          Degree Program: Bachelor of Science in Computer Science (BSCS - 4 Years) • HEC Pakistan Standard
        </div>
      </div>

      {/* Student Profile Info Table */}
      <table className="transcript-student-table">
        <tbody>
          <tr>
            <td className="table-label" style={{ width: "18%" }}>Student Name:</td>
            <td style={{ width: "32%", fontWeight: "600" }}>{student.name}</td>
            <td className="table-label" style={{ width: "18%" }}>Roll Number:</td>
            <td style={{ width: "32%", fontFamily: "monospace", fontWeight: "700" }}>{student.rollNo}</td>
          </tr>
          <tr>
            <td className="table-label">Father's Name:</td>
            <td>{student.fatherName}</td>
            <td className="table-label">Registration No:</td>
            <td style={{ fontFamily: "monospace" }}>{student.regNo}</td>
          </tr>
          <tr>
            <td className="table-label">Academic Batch:</td>
            <td>{student.batch} (Shift: {student.shift} - Sec {student.section})</td>
            <td className="table-label">Semester Examined:</td>
            <td style={{ fontWeight: "700" }}>Semester {semesterResult.semester}</td>
          </tr>
        </tbody>
      </table>

      {/* Course Marks Table */}
      <table className="transcript-grades-table">
        <thead>
          <tr>
            <th style={{ width: "12%" }}>Course Code</th>
            <th style={{ width: "34%" }}>Course Title</th>
            <th style={{ width: "8%", textAlign: "center" }}>Cr. Hrs</th>
            <th style={{ width: "8%", textAlign: "center" }}>Sess. (20%)</th>
            <th style={{ width: "8%", textAlign: "center" }}>Mid (30%)</th>
            <th style={{ width: "8%", textAlign: "center" }}>Fin (50%)</th>
            <th style={{ width: "10%", textAlign: "center" }}>Obt. / Max</th>
            <th style={{ width: "6%", textAlign: "center" }}>Grade</th>
            <th style={{ width: "6%", textAlign: "center" }}>GP</th>
          </tr>
        </thead>
        <tbody>
          {semesterResult.courses.map((c, i) => (
            <tr key={i}>
              <td style={{ fontFamily: "monospace", fontWeight: "700" }}>{c.code}</td>
              <td>{c.title}</td>
              <td style={{ textAlign: "center" }}>{c.credits}</td>
              <td style={{ textAlign: "center" }}>{c.sessional}</td>
              <td style={{ textAlign: "center" }}>{c.midterm}</td>
              <td style={{ textAlign: "center" }}>{c.final}</td>
              <td style={{ textAlign: "center", fontWeight: "700" }}>{c.totalMarks} / {c.maxMarks}</td>
              <td style={{ textAlign: "center", fontWeight: "700" }}>{c.grade}</td>
              <td style={{ textAlign: "center" }}>{c.gradePoints.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Box */}
      <table className="transcript-summary-table">
        <tbody>
          <tr>
            <td style={{ width: "25%" }}>
              <div className="summary-label">SEMESTER GPA (SGPA)</div>
              <div className="summary-val">{semesterResult.sgpa.toFixed(2)} / 4.00</div>
              <div style={{ fontSize: "7.5pt", color: "#555", marginTop: "2px" }}>
                Marks: {semesterResult.totalObtainedMarks} / {semesterResult.totalMaxMarks} ({semesterResult.percentage}%)
              </div>
            </td>
            <td style={{ width: "25%" }}>
              <div className="summary-label">CUMULATIVE GPA (CGPA)</div>
              <div className="summary-val">{student.cgpa.toFixed(2)} / 4.00</div>
              <div style={{ fontSize: "7.5pt", color: "#555", marginTop: "2px" }}>
                Cumulative: {student.overallPercentage}%
              </div>
            </td>
            <td style={{ width: "25%" }}>
              <div className="summary-label">CREDITS EARNED / TOTAL</div>
              <div className="summary-val-sm">{student.totalCreditsEarned} / {student.totalCreditsAttempted} Cr</div>
              <div style={{ fontSize: "7.5pt", color: "#555", marginTop: "2px" }}>
                Sem Cr: {semesterResult.totalCredits} Cr
              </div>
            </td>
            <td style={{ width: "25%" }}>
              <div className="summary-label">ACADEMIC STANDING</div>
              <div className="summary-val-sm" style={{ fontWeight: "700" }}>{student.standing}</div>
              <div style={{ fontSize: "7.5pt", color: "#555", marginTop: "2px" }}>
                Status: Qualified
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Grading Legend & Security Footnote */}
      <div className="transcript-legend">
        <strong>Pakistan HEC Grading Scale:</strong> A (85-100% / 4.00), A- (80-84% / 3.67), B+ (75-79% / 3.33), B (70-74% / 3.00), B- (65-69% / 2.67), C+ (61-64% / 2.33), C (58-60% / 2.00), D (50-54% / 1.00), F (&lt;50% / 0.00 Fail).
        <br />
        <strong>Credit-Hour Scaling:</strong> 20 Marks per Credit Hour (1 Cr = 20, 2 Cr = 40, 3 Cr = 60, 4 Cr = 80). Assessment: Sessional (20%), Midterm (30%), Final Exam (50%).
        <br />
        <em>Note: This is an official computer-generated document issued by the Examination Department, Department of Computer Science on {issueDate}.</em>
      </div>

      {/* Signature Section */}
      <div className="transcript-footer">
        <div className="signature-box">
          Prepared By
          <div className="sig-sub">Academic Branch</div>
        </div>

        <div className="signature-box">
          Head of Department (HoD)
          <div className="sig-sub">Dept. of Computer Science</div>
        </div>

        <div className="signature-box">
          Controller of Examinations
          <div className="sig-sub">Official Seal & Signature</div>
        </div>
      </div>
    </div>
  );
}
