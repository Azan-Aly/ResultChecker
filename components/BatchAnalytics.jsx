"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Users, 
  Award, 
  TrendingUp, 
  Percent, 
  Filter, 
  ArrowRight, 
  Layers, 
  Medal, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { getBatchAnalytics, getStudentsList } from "../lib/studentDataService";

export default function BatchAnalytics({ batches = [], onSelectStudent }) {
  const [selectedBatchId, setSelectedBatchId] = useState("all");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [searchTableQuery, setSearchTableQuery] = useState("");

  useEffect(() => {
    const data = getBatchAnalytics(selectedBatchId);
    const students = getStudentsList({ batchId: selectedBatchId });
    setAnalyticsData(data);
    setStudentsList(students);
  }, [selectedBatchId]);

  if (!analyticsData) {
    return (
      <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading BSCS Batch Analytics & Leaderboard...</p>
      </div>
    );
  }

  const { totalStudents, averageCGPA, highestCGPA, lowestCGPA, passRate, leaderboard, distribution } = analyticsData;

  const filteredStudents = studentsList.filter(s => 
    s.name.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  return (
    <div className="batch-analytics-container">
      {/* 1. Header & Batch Selector */}
      <div className="glass-card" style={{ padding: "1.8rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="hero-tag">
              <Trophy size={14} />
              <span>BS Computer Science Academic Standing</span>
            </span>
            <h2 style={{ fontSize: "1.75rem", marginTop: "0.4rem" }}>
              Batch Performance & <span>Hall of Fame</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Comprehensive class statistics, GPA distribution histograms, and batch rankers.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              className={`sem-pill-btn ${selectedBatchId === "all" ? "active" : ""}`}
              onClick={() => setSelectedBatchId("all")}
            >
              All Batches
            </button>
            {batches.map((b) => (
              <button
                key={b.id}
                className={`sem-pill-btn ${selectedBatchId === b.id ? "active" : ""}`}
                onClick={() => setSelectedBatchId(b.id)}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Key Batch Stats */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Total Enrolled</h4>
            <div className="metric-value mono" style={{ color: "var(--primary)" }}>
              {totalStudents}
            </div>
            <div className="metric-sub">Active BSCS Students</div>
          </div>
          <div className="metric-icon-box icon-box-primary">
            <Users size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Average Class CGPA</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-cyan)" }}>
              {averageCGPA.toFixed(2)}
            </div>
            <div className="metric-sub">Mean Cumulative GPA</div>
          </div>
          <div className="metric-icon-box icon-box-cyan">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Batch Highest CGPA</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-emerald)" }}>
              {highestCGPA.toFixed(2)}
            </div>
            <div className="metric-sub">Top Standing (4.00 Max)</div>
          </div>
          <div className="metric-icon-box icon-box-emerald">
            <Award size={24} />
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-info">
            <h4>Pass Rate</h4>
            <div className="metric-value mono" style={{ color: "var(--accent-amber)" }}>
              {passRate}%
            </div>
            <div className="metric-sub">CGPA &gt;= 2.00 Standing</div>
          </div>
          <div className="metric-icon-box icon-box-amber">
            <Percent size={24} />
          </div>
        </div>
      </div>

      {/* 3. Podium & Leaderboard Section */}
      <div className="analytics-grid">
        {/* Top 3 Podium Card */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Medal size={20} color="var(--accent-amber)" />
              <span>Batch Top Performers Podium</span>
            </div>
          </div>

          {leaderboard.length >= 3 ? (
            <div className="podium-container">
              {/* Rank 2 */}
              <div className="podium-step rank-2" onClick={() => onSelectStudent(leaderboard[1].rollNo)} style={{ cursor: "pointer" }}>
                <div className="podium-avatar-wrap">
                  <div className="podium-icon-box">
                    <Award size={26} color="#94a3b8" />
                  </div>
                </div>
                <div className="podium-name">{leaderboard[1].name}</div>
                <div className="podium-cgpa">{leaderboard[1].cgpa.toFixed(2)}</div>
                <div className="podium-bar">#2</div>
              </div>

              {/* Rank 1 */}
              <div className="podium-step rank-1" onClick={() => onSelectStudent(leaderboard[0].rollNo)} style={{ cursor: "pointer" }}>
                <div className="podium-avatar-wrap">
                  <div className="podium-icon-box crown-box">
                    <Trophy size={28} color="#fbbf24" />
                  </div>
                </div>
                <div className="podium-name">{leaderboard[0].name}</div>
                <div className="podium-cgpa">{leaderboard[0].cgpa.toFixed(2)}</div>
                <div className="podium-bar">#1</div>
              </div>

              {/* Rank 3 */}
              <div className="podium-step rank-3" onClick={() => onSelectStudent(leaderboard[2].rollNo)} style={{ cursor: "pointer" }}>
                <div className="podium-avatar-wrap">
                  <div className="podium-icon-box">
                    <Medal size={24} color="#d97706" />
                  </div>
                </div>
                <div className="podium-name">{leaderboard[2].name}</div>
                <div className="podium-cgpa">{leaderboard[2].cgpa.toFixed(2)}</div>
                <div className="podium-bar">#3</div>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
              Insufficient student data for podium display.
            </p>
          )}
        </div>

        {/* GPA Distribution Histogram */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Layers size={20} color="var(--primary)" />
              <span>CGPA Academic Distribution</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.5rem" }}>
            {distribution.map((dist, idx) => {
              const pct = totalStudents > 0 ? (dist.count / totalStudents) * 100 : 0;
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                    <span>
                      <strong className="mono">{dist.range}</strong> ({dist.label})
                    </span>
                    <span className="mono" style={{ color: "var(--text-secondary)" }}>
                      {dist.count} Students ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: dist.color,
                        borderRadius: "4px",
                        transition: "width 0.6s ease"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Complete Batch Student Registry Table */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem" }}>Complete Student Directory</h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Click any student row to load full academic marksheet and official DMC.
            </span>
          </div>

          <div style={{ width: "260px" }}>
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: "1rem", height: "38px" }}
              placeholder="Search table by name or roll..."
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container" style={{ margin: 0 }}>
          <table className="marksheet-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Roll No</th>
                <th style={{ width: "28%" }}>Student Name</th>
                <th style={{ width: "16%" }}>Batch / Shift</th>
                <th style={{ width: "14%", textAlign: "center" }}>Completed Sem</th>
                <th style={{ width: "12%", textAlign: "center" }}>CGPA</th>
                <th style={{ width: "14%", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr
                  key={st.rollNo}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectStudent(st.rollNo)}
                >
                  <td className="course-code-cell">{st.rollNo}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: "600" }}>{st.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{st.fatherName}</div>
                    </div>
                  </td>
                  <td>
                    <div>{st.batch}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sec {st.section}</div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>
                    Sem {st.completedSemesters}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="mono" style={{ fontWeight: "800", color: "var(--primary)", fontSize: "1.05rem" }}>
                      {st.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-outline btn-sm">
                      <span>View Marksheet</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
