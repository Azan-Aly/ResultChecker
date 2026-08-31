"use client";

import React from "react";
import { Code, GraduationCap, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="portal-footer no-print">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-title">
            <GraduationCap size={18} color="var(--primary)" />
            <span>CS Examination Portal</span>
          </div>
          <p className="footer-dept">Department of Computer Science • BSCS Program</p>
        </div>

        <div className="footer-center">
          <div className="developer-badge">
            <Code size={14} color="var(--accent-cyan)" />
            <span>Developed by <strong className="developer-name">Azan Ali</strong></span>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-security">
            <ShieldCheck size={14} color="var(--accent-emerald)" />
            <span>Official Academic Records</span>
          </div>
          <span className="footer-copy">© {currentYear} Dept. of CS</span>
        </div>
      </div>
    </footer>
  );
}
