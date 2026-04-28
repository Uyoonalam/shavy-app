"use client";

import { useState, useEffect } from "react";

interface InviteUIProps {
  theme: "dark" | "light";
  onClose: () => void;
  onUnlockCVBuilder: () => void;
}

export default function InviteUI({ theme, onClose, onUnlockCVBuilder }: InviteUIProps) {
  const [inviteCount, setInviteCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteHistory, setInviteHistory] = useState<{ name: string; email: string; date: string }[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const colors = theme === "dark" 
    ? { cardBg: "#2A2622", border: "#3a3a3a", text: "#e2e8f0", textMuted: "#94a3b8", gold: "#d4af37" }
    : { cardBg: "#ffffff", border: "#e2e8f0", text: "#0f172a", textMuted: "#64748b", gold: "#b8860b" };

  useEffect(() => {
    // Load saved invite data
    const savedCount = localStorage.getItem("shavy_invite_count");
    const savedCode = localStorage.getItem("shavy_referral_code");
    const savedHistory = localStorage.getItem("shavy_invite_history");
    
    if (savedCount) setInviteCount(parseInt(savedCount));
    if (savedCode) setReferralCode(savedCode);
    else {
      // Generate unique referral code
      const newCode = "SHAVY-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferralCode(newCode);
      localStorage.setItem("shavy_referral_code", newCode);
    }
    if (savedHistory) setInviteHistory(JSON.parse(savedHistory));
  }, []);

  const handleCopyLink = () => {
    const link = `https://shavy-app.vercel.app/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    
    const newInvite = {
      name: inviteName,
      email: inviteEmail,
      date: new Date().toLocaleDateString(),
    };
    
    const newHistory = [newInvite, ...inviteHistory];
    const newCount = inviteCount + 1;
    
    setInviteHistory(newHistory);
    setInviteCount(newCount);
    localStorage.setItem("shavy_invite_history", JSON.stringify(newHistory));
    localStorage.setItem("shavy_invite_count", newCount.toString());
    
    // Check if reached 5 invites
    if (newCount >= 5) {
      const cvBuilderEnabled = localStorage.getItem("shavy_cvbuilder_enabled");
      if (!cvBuilderEnabled || cvBuilderEnabled !== "true") {
        localStorage.setItem("shavy_cvbuilder_enabled", "true");
        onUnlockCVBuilder();
        // Show success toast
        const toast = document.createElement("div");
        toast.textContent = "🎉 You unlocked CV Builder for FREE! Check your Vault tab.";
        toast.style.position = "fixed";
        toast.style.bottom = "80px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
        toast.style.color = colors.gold;
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "40px";
        toast.style.fontSize = "13px";
        toast.style.zIndex = "200";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }
    }
    
    setInviteName("");
    setInviteEmail("");
    setShowInviteForm(false);
    
    // Show success toast
    const toast = document.createElement("div");
    toast.textContent = `✅ Invite sent to ${inviteName}! (${newCount}/5)`;
    toast.style.position = "fixed";
    toast.style.bottom = "80px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
    toast.style.color = colors.gold;
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "40px";
    toast.style.fontSize = "13px";
    toast.style.zIndex = "200";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const progressPercent = (inviteCount / 5) * 100;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      backdropFilter: "none",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: "24px",
        padding: "24px",
        width: "280px ",
        maxWidth: "calc(100% - 40px)",
        maxHeight: "80vh",
        overflowY: "auto",
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: colors.text, margin: 0 }}>
            👥 Invite Friends
          </h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: colors.textMuted }}>✕</button>
        </div>

        {/* Progress Section */}
        <div style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>
            {inviteCount >= 5 ? "🎉" : `${inviteCount}/5`}
          </div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>
            {inviteCount >= 5 
              ? "CV Builder Unlocked!" 
              : `Invite ${5 - inviteCount} more friends to unlock CV Builder FREE`}
          </div>
          <div style={{
            height: "8px",
            backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
            borderRadius: "10px",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${Math.min(progressPercent, 100)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              borderRadius: "10px",
              transition: "width 0.3s ease",
            }} />
          </div>
          {inviteCount >= 5 && (
            <p style={{ fontSize: "11px", color: "#22c55e", marginTop: "8px" }}>
              ✅ CV Builder is now FREE in your Vault tab!
            </p>
          )}
        </div>

        {/* Referral Link */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "6px", display: "block" }}>
            Your Referral Link
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              readOnly
              value={`https://shavy-app.vercel.app/?ref=${referralCode}`}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                color: colors.text,
                fontSize: "11px",
                fontFamily: "monospace",
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "12px",
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

        {/* Add Invite Button */}
        {!showInviteForm ? (
          <button
            onClick={() => setShowInviteForm(true)}
            style={{
              width: "100%",
              background: "transparent",
              border: `2px dashed ${colors.gold}`,
              padding: "12px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "600",
              color: colors.gold,
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            + Send Manual Invite
          </button>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Friend's Name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                color: colors.text,
                marginBottom: "10px",
              }}
            />
            <input
              type="email"
              placeholder="Friend's Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                color: colors.text,
                marginBottom: "10px",
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleSendInvite}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #d4af37, #b8860b)",
                  border: "none",
                  padding: "10px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${colors.border}`,
                  padding: "10px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: colors.textMuted,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Invite History */}
        {inviteHistory.length > 0 && (
          <div>
            <h4 style={{ fontSize: "13px", fontWeight: "600", color: colors.text, marginBottom: "12px" }}>
              📋 Sent Invites ({inviteHistory.length})
            </h4>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {inviteHistory.map((invite, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: `1px solid ${colors.border}`,
                }}>
                  <div>
                    <div style={{ fontSize: "13px", color: colors.text }}>{invite.name}</div>
                    <div style={{ fontSize: "10px", color: colors.textMuted }}>{invite.email}</div>
                  </div>
                  <div style={{ fontSize: "10px", color: colors.textMuted }}>{invite.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}