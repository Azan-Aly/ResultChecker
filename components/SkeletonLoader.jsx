"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="skeleton-container" aria-label="Loading student record">
      {/* Header Profile Skeleton */}
      <div className="glass-card skeleton-card student-header-card">
        <div className="skeleton-shimmer skeleton-icon-box" style={{ width: "54px", height: "54px" }} />
        <div className="skeleton-meta-col" style={{ flex: 1 }}>
          <div className="skeleton-shimmer skeleton-title-bar" />
          <div className="skeleton-shimmer skeleton-subtitle-bar" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="metrics-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card skeleton-card metric-card">
            <div style={{ flex: 1 }}>
              <div className="skeleton-shimmer skeleton-line-sm" />
              <div className="skeleton-shimmer skeleton-value-box" />
              <div className="skeleton-shimmer skeleton-line-xs" />
            </div>
            <div className="skeleton-shimmer skeleton-icon-box" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="table-container glass-card skeleton-card" style={{ padding: "1.5rem" }}>
        <div className="skeleton-shimmer skeleton-title-bar" style={{ width: "30%", marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="skeleton-shimmer skeleton-row-bar" />
          ))}
        </div>
      </div>
    </div>
  );
}
