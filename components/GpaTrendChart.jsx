"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function GpaTrendChart({ progression = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!progression || progression.length === 0) {
    return (
      <div className="glass-card chart-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "240px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No semester history available for trend analysis.</p>
      </div>
    );
  }

  const svgWidth = 520;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 35;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Scale: Min GPA = 1.0, Max GPA = 4.0
  const maxGpa = 4.0;
  const minGpa = 1.0;

  const getX = (index) => {
    if (progression.length === 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (progression.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    const clamped = Math.max(minGpa, Math.min(maxGpa, val));
    const ratio = (clamped - minGpa) / (maxGpa - minGpa);
    return paddingY + chartHeight - ratio * chartHeight;
  };

  // Generate path data
  const sgpaPoints = progression.map((p, i) => `${getX(i)},${getY(p.sgpa)}`).join(" ");
  const cgpaPoints = progression.map((p, i) => `${getX(i)},${getY(p.cgpa)}`).join(" ");

  // Fill area under CGPA curve
  const areaPoints = progression.length > 1
    ? `${getX(0)},${paddingY + chartHeight} ${cgpaPoints} ${getX(progression.length - 1)},${paddingY + chartHeight}`
    : "";

  return (
    <div className="glass-card chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={20} color="var(--primary)" />
          <span>Academic Progression Trend</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--primary)" }}></span>
            <span>SGPA</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-cyan)" }}></span>
            <span>Cumulative CGPA</span>
          </span>
        </div>
      </div>

      <div className="chart-svg-container">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="cgpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines for 2.0, 3.0, 3.7, 4.0 */}
          {[2.0, 3.0, 3.7, 4.0].map((level) => (
            <g key={level}>
              <line
                x1={paddingX}
                y1={getY(level)}
                x2={svgWidth - paddingX}
                y2={getY(level)}
                stroke="var(--border-color)"
                strokeDasharray={level === 3.7 ? "3,3" : "none"}
                strokeWidth={level === 3.7 ? 1.5 : 1}
              />
              <text
                x={paddingX - 8}
                y={getY(level) + 4}
                fill="var(--text-muted)"
                fontSize="10"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {level.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Area fill for CGPA */}
          {progression.length > 1 && (
            <polygon points={areaPoints} fill="url(#cgpaAreaGrad)" />
          )}

          {/* Line for SGPA (Dashed) */}
          {progression.length > 1 && (
            <polyline
              points={sgpaPoints}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />
          )}

          {/* Line for CGPA */}
          {progression.length > 1 && (
            <polyline
              points={cgpaPoints}
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="3"
            />
          )}

          {/* Points & Hover Markers */}
          {progression.map((item, idx) => {
            const x = getX(idx);
            const ySgpa = getY(item.sgpa);
            const yCgpa = getY(item.cgpa);
            const isHovered = hoveredPoint?.idx === idx;

            return (
              <g key={idx}>
                {/* Semester Label on X-axis */}
                <text
                  x={x}
                  y={paddingY + chartHeight + 18}
                  fill="var(--text-secondary)"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="var(--font-heading)"
                >
                  Sem {item.semester}
                </text>

                {/* SGPA circle */}
                <circle
                  cx={x}
                  cy={ySgpa}
                  r={isHovered ? "6" : "4.5"}
                  fill="var(--bg-secondary)"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={() => setHoveredPoint({ idx, type: "SGPA", val: item.sgpa, sem: item.semester, x, y: ySgpa })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* CGPA circle */}
                <circle
                  cx={x}
                  cy={yCgpa}
                  r={isHovered ? "6" : "4.5"}
                  fill="var(--bg-secondary)"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2.5"
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={() => setHoveredPoint({ idx, type: "CGPA", val: item.cgpa, sem: item.semester, x, y: yCgpa })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: "absolute",
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`,
              transform: "translate(-50%, -120%)",
              background: "var(--bg-card)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--primary)",
              padding: "0.35rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
              pointerEvents: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
              zIndex: 10
            }}
          >
            Sem {hoveredPoint.sem} {hoveredPoint.type}: <strong>{hoveredPoint.val.toFixed(2)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
