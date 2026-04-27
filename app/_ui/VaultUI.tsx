"use client";

import { useState, useEffect } from "react";

interface VaultUIProps {
  theme: "dark" | "light";
}

export default function VaultUI({ theme }: VaultUIProps) {
  const [foundersEnabled, setFoundersEnabled] = useState(false);
  const [cvBuilderEnabled, setCvBuilderEnabled] = useState(false);

  useEffect(() => {
    const founders = localStorage.getItem("shavy_founders_enabled");
    if (founders === "true") setFoundersEnabled(true);
    
    const cvBuilder = localStorage.getItem("shavy_cvbuilder_enabled");
    if (cvBuilder === "true") setCvBuilderEnabled(true);
  }, []);

  const darkColors = {
    cardBg: "#2A2622",
    border: "#3a3a3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
  };

  const lightColors = {
    cardBg: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "80px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
    toast.style.color = theme === "dark" ? "#d4af37" : "#b8860b";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "40px";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "500";
    toast.style.zIndex = "200";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.border = `1px solid ${c.border}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleComingSoon = (feature: string) => {
    showToast(`🔐 ${feature} — Coming soon`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Main Vault Card */}
      <div
        className="simple-card-hover"
        style={{
          backgroundColor: c.cardBg,
          borderRadius: "20px",
          padding: "32px 24px",
          border: `1px solid ${c.border}`,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.borderColor = "#d4af37";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = c.border;
        }}
        onClick={() => handleComingSoon("Your Vault")}
      >
        <div style={{ fontSize: "56px", marginBottom: "16px", opacity: 0.9 }}>🔐</div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: c.text }}>Your Vault</h3>
        <p style={{ fontSize: "13px", color: c.textMuted, lineHeight: "1.4" }}>
          Encrypted resume & skills stored here
        </p>
        <div style={{ fontSize: "11px", color: c.textMuted, marginTop: "12px", opacity: 0.7 }}>
          🔒 PIN protected • Coming soon
        </div>
      </div>

      {/* Founders Ecosystem - shows only after purchase */}
      {foundersEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "20px",
            padding: "20px",
            border: `1px solid ${c.border}`,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "#d4af37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = c.border;
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🚀</div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text, marginBottom: "8px" }}>
            Founders Ecosystem
          </h3>
          <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "16px" }}>
            ✅ Enabled — Connect with founders, mentors, and exclusive opportunities
          </p>
          <button
            onClick={() => handleComingSoon("Founders Ecosystem")}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "10px 24px",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "40px",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Explore
          </button>
        </div>
      )}

      {/* CV Builder - shows only after purchase */}
      {cvBuilderEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "20px",
            padding: "20px",
            border: `1px solid ${c.border}`,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "#d4af37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = c.border;
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text, marginBottom: "8px" }}>
            CV Builder
          </h3>
          <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "16px" }}>
            ✅ Enabled — AI-powered templates • Export as PDF
          </p>
          <button
            onClick={() => handleComingSoon("CV Builder")}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "10px 24px",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "40px",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Create CV
          </button>
        </div>
      )}
    </div>
  );
}