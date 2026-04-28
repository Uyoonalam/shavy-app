"use client";

import { useState } from "react";
import Image from "next/image";

interface TopBarProps {
  theme: "dark" | "light";
  onMenuClick: () => void;
}

export default function TopBar({ theme, onMenuClick }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const darkColors = {
    bg: "#1F1C18",
    cardBg: "#2A2622",
    border: "rgba(255,255,255,0.08)",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    goldAccent: "#d4af37",
  };

  const lightColors = {
    bg: "#ffffff",
    cardBg: "#f8fafc",
    border: "rgba(0,0,0,0.06)",
    text: "#0f172a",
    textMuted: "#64748b",
    goldAccent: "#b8860b",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  return (
    <>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme === "light"
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(31, 28, 24, 0.9)",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
  onClick={onMenuClick}
  style={{
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "transparent",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  {/* Hamburger icon - gold gradient lines */}
  <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "center",
    justifyContent: "center",
  }}>
    <div style={{
      width: "20px",
      height: "2.5px",
      background: "linear-gradient(90deg, #d4af37, #b8860b)",
      borderRadius: "2px",
    }} />
    <div style={{
      width: "20px",
      height: "2.5px",
      background: "linear-gradient(90deg, #d4af37, #b8860b)",
      borderRadius: "2px",
    }} />
    <div style={{
      width: "20px",
      height: "2.5px",
      background: "linear-gradient(90deg, #d4af37, #b8860b)",
      borderRadius: "2px",
    }} />
  </div>
</div>

{/* Shavy text with gold gradient */}
<div style={{
  fontSize: "20px",
  fontWeight: "700",
  letterSpacing: "-0.5px",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(135deg, #d4af37, #b8860b)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}}>
  Shavy
</div>

        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            marginTop: 0,
            padding: "6px",
            opacity: showNotifications ? 1 : 0.7,
            transition: "opacity 0.2s ease",
            position: "relative",
            borderRadius: "8px",
            color: c.text,
          }}
        >
          🔔
          {showNotifications && (
            <span style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "6px",
              height: "6px",
              backgroundColor: "#d4af37",
              borderRadius: "50%",
            }} />
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          <div
            onClick={() => setShowNotifications(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "none",
              zIndex: 45,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "280px",
              backgroundColor: theme === "light" ? "#ffffff" : c.cardBg,
              backdropFilter: "none",
              borderRadius: "20px",
              padding: "20px",
              textAlign: "center",
              zIndex: 50,
              border: `1px solid ${c.border}`,
              boxShadow: "0 20px 35px -10px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}>
              <span style={{
                fontSize: "16px",
                fontWeight: "600",
                color: c.text,
              }}>Notifications</span>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  marginTop: 0,
                  padding: "4px",
                  color: c.textMuted,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{
              padding: "24px 0",
              color: c.textMuted,
              fontSize: "13px",
            }}>
              🔔 No notifications
            </div>
          </div>
        </>
      )}
    </>
  );
}