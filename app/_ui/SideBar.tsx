"use client";

import { useState, useEffect, useRef } from "react";
import InviteUI from "./InviteUI";

interface SidebarProps {
  theme: "dark" | "light";
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
}

export default function Sidebar({ theme, isOpen, onClose, onThemeToggle }: SidebarProps) {
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("shavy_user_name") || localStorage.getItem("shavy_extracted_name") || "Guest User";
    const email = localStorage.getItem("shavy_user_email") || localStorage.getItem("shavy_extracted_email") || "";
    const photo = localStorage.getItem("shavy_profile_photo");
    
    setUserName(name);
    setUserEmail(email);
    if (photo) setProfilePhoto(photo);
  }, []);

  if (!isOpen) return null;

  const darkColors = {
    bg: "#1F1C18",
    border: "rgba(255,255,255,0.08)",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    goldAccent: "#d4af37",
    hoverBg: "rgba(212, 175, 55, 0.1)",
  };

  const lightColors = {
    bg: "#ffffff",
    border: "rgba(0,0,0,0.06)",
    text: "#0f172a",
    textMuted: "#64748b",
    goldAccent: "#b8860b",
    hoverBg: "rgba(184, 134, 11, 0.08)",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem("shavy_profile_photo", base64String);
        const toast = document.createElement("div");
        toast.textContent = "📸 Profile photo updated!";
        toast.style.position = "fixed";
        toast.style.bottom = "80px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
        toast.style.color = "#d4af37";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "40px";
        toast.style.fontSize = "13px";
        toast.style.zIndex = "300";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate shareable profile link
  const shareableLink = `https://shavy-app.vercel.app/share/${encodeURIComponent(userName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  const handleInviteFriends = () => {
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "none",
          zIndex: 100,
          borderRadius: "44px",
        }}
      />
      
      {/* Sidebar Panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          backgroundColor: c.bg,
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease-out",
          borderRadius: "0 24px 24px 0",
          borderRight: `1px solid ${c.border}`,
          boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 0 0" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: c.textMuted,
              padding: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.color = c.goldAccent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = c.textMuted;
            }}
          >
            ✕
          </button>
        </div>

        {/* Profile Section with Upload */}
        <div style={{ textAlign: "center", padding: "8px 20px 20px 20px", borderBottom: `1px solid ${c.border}` }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: profilePhoto ? "transparent" : `linear-gradient(135deg, ${c.goldAccent}, ${c.goldAccent}80)`,
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              overflow: "hidden",
              border: `2px solid ${c.goldAccent}`,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "👤"
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "4px" }}>
            <span style={{ fontSize: "10px", color: c.textMuted }}>Tap to change photo</span>
            <span style={{ fontSize: "10px" }}>📸</span>
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text, marginBottom: "4px", marginTop: "8px" }}>
            {userName.length > 20 ? userName.substring(0, 20) + "..." : userName}
          </h3>
          {userEmail && (
            <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "8px" }}>
              {userEmail.length > 25 ? userEmail.substring(0, 25) + "..." : userEmail}
            </p>
          )}
        </div>

        {/* Theme Toggle */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${c.border}` }}>
          <button
            onClick={onThemeToggle}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              background: c.hoverBg,
              border: `1px solid ${c.goldAccent}40`,
              borderRadius: "40px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = c.goldAccent;
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${c.goldAccent}40`;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>{theme === "dark" ? "☀️" : "🌙"}</span>
              <span style={{ fontSize: "13px", fontWeight: "500", color: c.text }}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>Toggle</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: "16px 12px", flex: 1 }}>
          {/* Invite Friends */}
          <button
            onClick={handleInviteFriends}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>👥</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Invite Friends</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Earn rewards</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>

          {/* Share Profile */}
          <button
            onClick={handleShareProfile}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              marginTop: "4px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>📤</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Share Profile</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Get your shareable link</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>

          {/* Legal Sources */}
          <button
            onClick={() => setShowLegalModal(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              marginTop: "4px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>⚖️</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Legal Sources</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Data & research references</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>
        </div>

        {/* Bottom Section - Version */}
        <div style={{ padding: "16px", borderTop: `1px solid ${c.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: c.textMuted, opacity: 0.6 }}>Shavy v1.0.0</p>
          <p style={{ fontSize: "9px", color: c.textMuted, opacity: 0.4, marginTop: "4px" }}>
            🔒 Privacy-first career platform
          </p>
        </div>
      </div>

      {/* Share Profile Modal */}
      {showShareModal && (
        <>
          <div onClick={() => setShowShareModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "260px", backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff", borderRadius: "20px", padding: "20px", zIndex: 201, border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text }}>📤 Share Profile</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: c.textMuted }}>✕</button>
            </div>
            <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "12px", textAlign: "center" }}>
              Share your profile link
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                readOnly
                value={shareableLink}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: `1px solid ${c.border}`,
                  backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                  color: c.text,
                  fontSize: "10px",
                  fontFamily: "monospace",
                }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: "8px 12px",
                  background: "linear-gradient(135deg, #d4af37, #b8860b)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Legal Sources Modal */}
      {showLegalModal && (
        <>
          <div onClick={() => setShowLegalModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", maxHeight: "70vh", overflowY: "auto", backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff", borderRadius: "20px", padding: "20px", zIndex: 201, border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text }}>⚖️ Legal Sources</h3>
              <button onClick={() => setShowLegalModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: c.textMuted }}>✕</button>
            </div>
            <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "16px", lineHeight: "1.4" }}>
              Shavy uses data from these trusted sources:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href="https://www.sec.gov/edgar" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: c.hoverBg, borderRadius: "12px", textDecoration: "none" }}>
                <span style={{ fontSize: "24px" }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: c.text }}>SEC EDGAR</div>
                  <div style={{ fontSize: "11px", color: c.textMuted }}>Financial filings</div>
                </div>
                <span style={{ fontSize: "14px", color: c.textMuted }}>🔗</span>
              </a>
              <a href="https://www.glassdoor.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: c.hoverBg, borderRadius: "12px", textDecoration: "none" }}>
                <span style={{ fontSize: "24px" }}>💼</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: c.text }}>Glassdoor</div>
                  <div style={{ fontSize: "11px", color: c.textMuted }}>Employee reviews</div>
                </div>
                <span style={{ fontSize: "14px", color: c.textMuted }}>🔗</span>
              </a>
              <a href="https://www.bbb.org" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: c.hoverBg, borderRadius: "12px", textDecoration: "none" }}>
                <span style={{ fontSize: "24px" }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: c.text }}>Better Business Bureau</div>
                  <div style={{ fontSize: "11px", color: c.textMuted }}>Complaints & ratings</div>
                </div>
                <span style={{ fontSize: "14px", color: c.textMuted }}>🔗</span>
              </a>
              <a href="https://www.bls.gov" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: c.hoverBg, borderRadius: "12px", textDecoration: "none" }}>
                <span style={{ fontSize: "24px" }}>📊</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: c.text }}>Bureau of Labor Statistics</div>
                  <div style={{ fontSize: "11px", color: c.textMuted }}>Salary data</div>
                </div>
                <span style={{ fontSize: "14px", color: c.textMuted }}>🔗</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteUI 
          theme={theme} 
          onClose={handleCloseInviteModal} 
          onUnlockCVBuilder={() => {
            window.dispatchEvent(new CustomEvent("showToast", { detail: "🎉 CV Builder unlocked! Check your Vault tab." }));
            handleCloseInviteModal();
          }}
        />
      )}

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