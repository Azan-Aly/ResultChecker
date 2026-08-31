"use client";

import React from "react";
import { GraduationCap, BarChart3, Sun, Moon, Sparkles } from "lucide-react";

export default function Navbar({ currentTab, setCurrentTab, theme, setTheme }) {
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <header className="navbar no-print">
      <div className="nav-content">
        <div className="brand" onClick={() => setCurrentTab("checker")}>
          <div className="brand-icon-wrap">
            <GraduationCap size={22} />
          </div>
          <div className="brand-titles">
            <h1>CS Portal</h1>
            <span className="brand-subtitle">Dept. of Computer Science</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className={`nav-tab-btn ${currentTab === "checker" ? "active" : ""}`}
            onClick={() => setCurrentTab("checker")}
            title="Result Checker"
          >
            <Sparkles size={16} />
            <span className="tab-label-text">Result Checker</span>
          </button>

          <button
            className={`nav-tab-btn ${currentTab === "analytics" ? "active" : ""}`}
            onClick={() => setCurrentTab("analytics")}
            title="Batch Analytics"
          >
            <BarChart3 size={16} />
            <span className="tab-label-text">Analytics</span>
          </button>

          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
