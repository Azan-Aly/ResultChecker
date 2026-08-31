"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Navbar from "../components/Navbar";
import SearchFilter from "../components/SearchFilter";
import StudentResultView from "../components/StudentResultView";
import TranscriptPrintView from "../components/TranscriptPrintView";
import BatchAnalytics from "../components/BatchAnalytics";
import SkeletonLoader from "../components/SkeletonLoader";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { getBatches, getStudentResult } from "../lib/studentDataService";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [currentTab, setCurrentTab] = useState("checker"); // 'checker' | 'analytics'
  const [batches, setBatches] = useState([]);
  
  // Search & Filter state
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Result state
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize batches on mount
  useEffect(() => {
    const loadedBatches = getBatches();
    setBatches(loadedBatches);
  }, []);

  const triggerCelebration = () => {
    try {
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      // Confetti fallback
    }
  };

  // Fetch student result from static data service
  const loadStudent = (rollNo, sem = null) => {
    if (!rollNo || !rollNo.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    // Smooth skeletal transition
    setTimeout(() => {
      try {
        const data = getStudentResult(rollNo, sem);

        if (data && data.student) {
          setResultData(data);
          if (data.student.cgpa >= 3.70) {
            triggerCelebration();
          }
        } else {
          setError(`No academic record found matching "${rollNo}". Please verify your Roll Number.`);
          setResultData(null);
        }
      } catch (err) {
        setError("Error loading academic record.");
        setResultData(null);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a valid Roll Number or Registration Number.");
      return;
    }
    loadStudent(searchQuery.trim(), selectedSemester);
  };

  const handleQuickLoad = (rollNo) => {
    setSearchQuery(rollNo);
    loadStudent(rollNo, selectedSemester);
    if (currentTab !== "checker") {
      setCurrentTab("checker");
    }
  };

  const handleSelectSemester = (sem) => {
    if (resultData?.student?.rollNo) {
      loadStudent(resultData.student.rollNo, sem);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="app-layout" data-theme={theme}>
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="app-container">
        {currentTab === "checker" ? (
          <>
            <SearchFilter
              batches={batches}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              quickLoadStudent={handleQuickLoad}
            />

            {/* Skeletal Loading State */}
            {loading && <SkeletonLoader />}

            {/* Error Message Card */}
            {error && !loading && (
              <div className="glass-card" style={{ padding: "2.5rem 1.5rem", textAlign: "center", border: "1px solid rgba(244, 63, 94, 0.4)", marginBottom: "2rem" }}>
                <AlertCircle size={42} color="var(--accent-rose)" style={{ marginBottom: "0.75rem" }} />
                <h3 style={{ fontSize: "1.25rem", color: "var(--accent-rose)", marginBottom: "0.5rem" }}>Student Record Not Found</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "480px", margin: "0 auto 1.25rem" }}>
                  {error}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleQuickLoad("BCS-F21-001")}>
                    Try BCS-F21-001
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleQuickLoad("BCS-F22-005")}>
                    Try BCS-F22-005
                  </button>
                </div>
              </div>
            )}

            {/* Initial Pleasant Welcome Guide (Before Search) */}
            {!hasSearched && !loading && !resultData && (
              <div className="glass-card welcome-portal-card">
                <div className="welcome-header">
                  <ShieldCheck size={28} color="var(--primary)" />
                  <div>
                    <h3>Welcome to the Computer Science Examination Portal</h3>
                    <p>Official verified examination records & detailed marksheets for BSCS students.</p>
                  </div>
                </div>

                <div className="welcome-steps-grid">
                  <div className="welcome-step-item">
                    <div className="step-badge">1</div>
                    <h4>Enter Roll Number</h4>
                    <p>Type your university assigned roll number or registration number.</p>
                  </div>
                  <div className="welcome-step-item">
                    <div className="step-badge">2</div>
                    <h4>Select Semester</h4>
                    <p>Filter by specific semester or view your latest cumulative records.</p>
                  </div>
                  <div className="welcome-step-item">
                    <div className="step-badge">3</div>
                    <h4>Print Official DMC</h4>
                    <p>Generate clean, print-ready Detailed Marks Certificates instantly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Student Result View */}
            {resultData && !loading && (
              <StudentResultView
                resultData={resultData}
                activeSemester={resultData.selectedSemester}
                onSelectSemester={handleSelectSemester}
                onPrintTranscript={handlePrint}
              />
            )}
          </>
        ) : (
          <BatchAnalytics
            batches={batches}
            onSelectStudent={(rollNo) => {
              handleQuickLoad(rollNo);
              setCurrentTab("checker");
            }}
          />
        )}

        {/* Printable Official DMC Layout (Only triggered on Print) */}
        {resultData && <TranscriptPrintView resultData={resultData} />}
      </main>
    </div>
  );
}
