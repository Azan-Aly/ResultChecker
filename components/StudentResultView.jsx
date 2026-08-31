"use client";

import React from "react";
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Trophy, 
  Percent, 
  Layers, 
  Hash,
  GraduationCap 
} from "lucide-react";
import GpaTrendChart from "./GpaTrendChart";

export default function StudentResultView({
  resultData,
  activeSemester,
  onSelectSemester,
  onPrintTranscript
}) {
  if (!resultData || !resultData.student) {
    return null;
  }

  const { student, semesterResult, progression, availableSemesters } = resultData;

  const getGradeClass = (grade) => {
    if (!grade) return "";
    const g = grade.charAt(0).toUpperCase();
    switch (g) {
      case "A": return "grade-a";
      case "B": return "grade-b";
      case "C": return "grade-c";
      case "D": return "grade-d";
      default: return "grade-f";
    }
  };

  const copyResultSummary = () => {
    const text = `BS Computer Science Official Academic Record\nStudent: ${student.name} (${student.rollNo})\nBatch: ${student.batch}\nCGPA: ${student.cgpa} | SGPA (Sem ${semesterResult.semester}): ${semesterResult.sgpa}\nStanding: ${student.standing}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Result summary copied to clipboard!");
    }
  };

  return (
    <div className="student-result-container">
      {/* 1. Student Header Profile Card */}
      <div className="glass-card student-header-card">
        <div className="student-icon-badge">
          <GraduationCap size={30} />
        </div>

        <div className="student-meta">
          <div className="student-name-row">
            <h2>{student.name}</h2>
            <span className={`badge ${student.standingClass}`}>
              <ShieldCheck size={13} />
              {student.standing}
            </span>
          </div>

          <div className="meta-tags">
            <div className="meta-item">
              <Hash size={14} color="var(--primary)" />
              <span>Roll: <strong className="mono">{student.rollNo}</strong></span>
            </div>
            <span className="meta-divider">•</span>
            <div className="meta-item">
              <BookOpen size={14} />
              <span>Reg: <strong className="mono">{student.regNo}</strong></span>
            </div>
            <span className="meta-divider">•</span>
            <div className="meta-item">
              <Layers size={14} />
              <span>{student.degree}</span>
            </div>
            <span className="meta-divider">•</span>
            <div className="meta-item">
              <Calendar size={14} />
              <span>Batch: {student.batch} (Sec {student.section} - {student.shift})</span>
            </div>
          </div>
        </div>

        <div className="student-header-actions no-print">
          <button className="btn btn-primary btn-sm" onClick={onPrintTranscript}>
            <Printer size={15} />
            <span>Print Marksheet</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={copyResultSummary}>
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 2. Key Academic Metrics Grid */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Cumulative CGPA</h4>
            <div className="metric-value mono" style={{ color: "var(--primary)" }}>
              {student.cgpa.toFixed(2)}
            </div>
            <div className="metric-sub">Across {student.completedSemesters} Semesters</div>
          </div>
          <div className="metric-icon-box icon-box-primary">
            <Trophy size={22} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Semester SGPA</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-cyan)" }}>
              {semesterResult.sgpa.toFixed(2)}
            </div>
            <div className="metric-sub">Semester {semesterResult.semester} Record</div>
          </div>
          <div className="metric-icon-box icon-box-cyan">
            <Award size={22} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Credits Earned</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-emerald)" }}>
              {student.totalCreditsEarned} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {student.totalCreditsAttempted}</span>
            </div>
            <div className="metric-sub">{semesterResult.totalCredits} Cr in Sem {semesterResult.semester}</div>
          </div>
          <div className="metric-icon-box icon-box-emerald">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Cumulative %</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-amber)" }}>
              {student.overallPercentage}%
            </div>
            <div className="metric-sub">{semesterResult.percentage}% in Sem {semesterResult.semester}</div>
          </div>
          <div className="metric-icon-box icon-box-amber">
            <Percent size={22} />
          </div>
        </div>
      </div>

      {/* 3. Semester Switcher Navigation */}
      <div className="semester-nav-bar no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileText size={18} color="var(--primary)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
            Detailed Marksheet & Breakdown
          </h3>
        </div>

        <div className="semester-pills">
          {availableSemesters.map((sem) => (
            <button
              key={sem}
              className={`sem-pill-btn ${activeSemester === sem ? "active" : ""}`}
              onClick={() => onSelectSemester(sem)}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Detailed Marksheet Table */}
      <div className="table-container">
        <table className="marksheet-table">
          <thead>
            <tr>
              <th style={{ width: "14%" }}>Course Code</th>
              <th style={{ width: "34%" }}>Course Title</th>
              <th style={{ width: "10%", textAlign: "center" }}>Cr. Hrs</th>
              <th style={{ width: "20%" }}>Marks Assessment</th>
              <th style={{ width: "11%", textAlign: "center" }}>Grade</th>
              <th style={{ width: "11%", textAlign: "right" }}>GP (Weight)</th>
            </tr>
          </thead>
          <tbody>
            {semesterResult.courses.map((course) => (
              <tr key={course.code}>
                <td className="course-code-cell">{course.code}</td>
                <td className="course-title-cell">
                  <div>{course.title}</div>
                  <div className="marks-breakdown-sub">
                    Sess: {course.sessional}/{course.sessionalMax} • Mid: {course.midterm}/{course.midtermMax} • Fin: {course.final}/{course.finalMax}
                  </div>
                </td>
                <td style={{ textAlign: "center", fontWeight: "600" }}>{course.credits}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${Math.min(100, (course.totalMarks / course.maxMarks) * 100)}%`,
                          height: "100%",
                          background: course.isPassed ? "var(--grad-primary)" : "var(--accent-rose)",
                          borderRadius: "3px"
                        }}
                      />
                    </div>
                    <span className="mono" style={{ fontWeight: "700", minWidth: "55px", textAlign: "right" }}>
                      {course.totalMarks}/{course.maxMarks}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className={`badge-grade ${getGradeClass(course.grade)}`}>
                    {course.grade}
                  </span>
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                  {course.gradePoints.toFixed(2)} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>({course.weightedPoints.toFixed(2)})</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ color: "var(--text-primary)" }}>
                Semester {semesterResult.semester} Summary
              </td>
              <td style={{ textAlign: "center" }}>{semesterResult.totalCredits} Cr</td>
              <td>Total Marks: <span className="mono">{semesterResult.totalObtainedMarks} / {semesterResult.totalMaxMarks}</span> (QP: <span className="mono">{semesterResult.totalWeightedPoints}</span>)</td>
              <td style={{ textAlign: "center" }}>
                <span className="badge badge-teal">SGPA {semesterResult.sgpa.toFixed(2)}</span>
              </td>
              <td style={{ textAlign: "right" }} className="mono">
                {semesterResult.percentage}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Progression Chart & Grading Criteria */}
      <div className="analytics-grid">
        <GpaTrendChart progression={progression} />

        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <BookOpen size={20} color="var(--accent-cyan)" />
              <span>Pakistan HEC Standard Grading Criteria</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem", fontSize: "0.8rem", marginBottom: "1rem" }}>
            <div className="grade-criteria-item">
              <span>85 - 100%</span>
              <strong style={{ color: "#34d399" }}>A (4.00)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>80 - 84%</span>
              <strong style={{ color: "#34d399" }}>A- (3.67)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>75 - 79%</span>
              <strong style={{ color: "#60a5fa" }}>B+ (3.33)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>70 - 74%</span>
              <strong style={{ color: "#60a5fa" }}>B (3.00)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>65 - 69%</span>
              <strong style={{ color: "#fbbf24" }}>B- (2.67)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>61 - 64%</span>
              <strong style={{ color: "#fbbf24" }}>C+ (2.33)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>58 - 60%</span>
              <strong style={{ color: "#fb923c" }}>C (2.00)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>50 - 54%</span>
              <strong style={{ color: "#fb923c" }}>D (1.00)</strong>
            </div>
            <div className="grade-criteria-item">
              <span>&lt; 50%</span>
              <strong style={{ color: "#f43f5e" }}>F (0.00)</strong>
            </div>
          </div>

          <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "0.75rem 0.9rem", borderRadius: "8px", border: "1px solid rgba(99, 102, 241, 0.2)", fontSize: "0.78rem" }}>
            <strong style={{ color: "var(--primary)", display: "block", marginBottom: "0.25rem" }}>
              Credit Hour Marks Scaling (20 Marks per Credit Hour):
            </strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.35rem", color: "var(--text-secondary)" }}>
              <span>• 1 Cr = 20 Marks Max</span>
              <span>• 2 Cr = 40 Marks Max</span>
              <span>• 3 Cr = 60 Marks Max</span>
              <span>• 4 Cr = 80 Marks Max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
