"use client";

import React from "react";
import { Search, Filter, BookOpen, UserCheck, Layers, Sparkles } from "lucide-react";

export default function SearchFilter({
  batches = [],
  selectedBatch,
  setSelectedBatch,
  selectedSemester,
  setSelectedSemester,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  quickLoadStudent
}) {
  const sampleRolls = [
    { roll: "BCS-F21-001", batch: "Batch 2021" },
    { roll: "BCS-F22-005", batch: "Batch 2022" },
    { roll: "BCS-F23-002", batch: "Batch 2023" },
    { roll: "BCS-F24-001", batch: "Batch 2024" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="glass-card search-hero">
      <div className="hero-tag">
        <BookOpen size={14} />
        <span>Department of Computer Science</span>
      </div>
      
      <h2 className="hero-title">
        Official Semester Result & <span>Marksheet Portal</span>
      </h2>
      <p className="hero-desc">
        Enter your Roll Number or Registration Number below to verify course grades, semester GPA, and print official computer-generated marksheets.
      </p>

      <form onSubmit={handleSubmit} className="filter-grid">
        <div className="input-group">
          <label className="input-label">
            <Search size={14} />
            <span>Roll Number / Reg No</span>
          </label>
          <div className="input-wrapper">
            <Search size={18} className="input-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="e.g. BCS-F21-001, 21-CS-001..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">
            <Layers size={14} />
            <span>Academic Batch</span>
          </label>
          <select
            className="form-control form-select"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">
            <Filter size={14} />
            <span>Semester</span>
          </label>
          <select
            className="form-control form-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">Latest Completed</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary search-submit-btn">
          <UserCheck size={18} />
          <span>Check Result</span>
        </button>
      </form>

      <div className="quick-chips">
        <span className="chips-label">Sample Roll Numbers:</span>
        <div className="chips-list">
          {sampleRolls.map((sr) => (
            <button
              key={sr.roll}
              type="button"
              className="chip-btn"
              onClick={() => quickLoadStudent(sr.roll)}
              title={`Load record for ${sr.roll}`}
            >
              <Sparkles size={12} />
              <span>{sr.roll} ({sr.batch})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
