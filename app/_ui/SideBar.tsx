"use client";

import Image from "next/image";

interface SidebarProps {
  theme: "dark" | "light";
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ theme, isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

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
      {/* Backdrop inside frame */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          borderRadius: "44px",
        }}
      />
      
      {/* Sidebar Panel - Inside Frame, Slides from left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          backgroundColor: theme === "light"
            ? "rgba(255, 255, 255, 0.95)"
            : c.cardBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.2s ease-out",
          borderRadius: "0 24px 24px 0",
          padding: "20px 0",
          borderRight: theme === "dark" ? `1px solid ${c.border}` : "none",
          boxShadow: theme === "dark" ? "none" : "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header with Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "22px",
              cursor: "pointer",
              marginTop: 0,
              padding: "8px",
              color: c.textMuted,
              opacity: 0.6,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
          >
            ✕
          </button>
        </div>

        {/* Logo with enhanced visibility */}
<div style={{
  textAlign: "center",
  padding: "20px 0",
}}>
  {/* Outer ring with gold gradient glow */}
  <div style={{
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d4af37, #b8860b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    boxShadow: theme === "dark" 
      ? "0 0 0 2px rgba(212, 175, 55, 0.4), 0 8px 20px rgba(212, 175, 55, 0.3)"
      : "0 4px 12px rgba(0,0,0,0.1)",
  }}>
    {/* Inner circle background */}
    <div style={{
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
    }}>
      <Image
        src="/ShavyNew.png"
        alt="Shavy Logo"
        width={52}
        height={52}
        style={{
          borderRadius: "12px",
          objectFit: "cover",
        }}
      />
    </div>
  </div>
  
  {/* Shavy text below logo */}
  <h2 style={{
    marginTop: "16px",
    fontSize: "18px",
    fontWeight: "600",
    color: c.text,
    letterSpacing: "-0.3px",
  }}>Shavy</h2>
</div>

        {/* Menu Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px", marginTop: "16px" }}>
          {[
            { icon: "🏠", label: "Home" },
            { icon: "🔍", label: "Audit" },
            { icon: "🔐", label: "Vault" },
            { icon: "👤", label: "Profile" },
            { icon: "⚙️", label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              style={{
                background: "transparent",
                textAlign: "left",
                padding: "12px 16px",
                marginTop: 0,
                borderRadius: "12px",
                color: c.text,
                fontSize: "15px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "18px", opacity: 0.8 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}