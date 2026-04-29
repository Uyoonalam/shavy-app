"use client";

import { useState, useEffect, useRef } from "react";

interface YouUIProps {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  onPurchase: (type: "founders" | "cvbuilder" | "ads", amount: number) => void;
}

export default function YouUI({ theme, setTheme, onPurchase }: YouUIProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [foundersEnabled, setFoundersEnabled] = useState(false);
  const [cvBuilderEnabled, setCvBuilderEnabled] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [showDeletePinModal, setShowDeletePinModal] = useState(false);
  const [deletePin, setDeletePin] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [deletePinError, setDeletePinError] = useState("");

  const darkColors = {
    cardBg: "#2A2622",
    border: "#3a3a3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    secondaryBg: "#342b24",
    goldAccent: "#d4af37",
  };

  const lightColors = {
    cardBg: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    secondaryBg: "#f8fafc",
    goldAccent: "#d4af37",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  useEffect(() => {
    const savedPhoto = localStorage.getItem("shavy_profile_photo");
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    const founders = localStorage.getItem("shavy_founders_enabled");
    if (founders === "true") {
      setFoundersEnabled(true);
    }
    const cvBuilder = localStorage.getItem("shavy_cvbuilder_enabled");
    if (cvBuilder === "true") {
      setCvBuilderEnabled(true);
    }
    const ads = localStorage.getItem("shavy_ads_removed");
    if (ads === "true") {
      setAdsRemoved(true);
      window.dispatchEvent(new CustomEvent("adsRemoved"));
    }
  }, []);

  const handleSectionToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleDeleteRequest = () => {
  const storedPin = localStorage.getItem("shavy_vault_pin");
  if (!storedPin) {
    // If no PIN exists, ask them to set one first (or just show error)
    setDeletePinError("No PIN set. Please set a PIN in Vault first.");
    setTimeout(() => setDeletePinError(""), 3001);
    return;
  }
  setShowDeletePinModal(true);
};

// Add this inside YouUI component, near other state declarations
const calculateProfileStrength = () => {
  let score = 0;
  let total = 6;
  
  // Check each field
    const hasPhoto = profilePhoto !== null;
    const hasName = localStorage.getItem("shavy_user_name") || localStorage.getItem("shavy_extracted_name");
    const hasEmail = localStorage.getItem("shavy_user_email") || localStorage.getItem("shavy_extracted_email");
    const hasSkills = JSON.parse(localStorage.getItem("shavy_skills") || "[]").length > 0;
    const hasResume = localStorage.getItem("shavy_resumeScanned") === "true";
    const hasPIN = localStorage.getItem("shavy_vault_pin") !== null;
  
  if (hasPhoto) score++;
  if (hasName) score++;
  if (hasEmail) score++;
  if (hasSkills) score++;
  if (hasResume) score++;
  if (hasPIN) score++;
  
  return Math.round((score / total) * 100);
};

const [profileStrength, setProfileStrength] = useState(0);
const [strengthLevel, setStrengthLevel] = useState("");
const [profileUpdateTrigger, setProfileUpdateTrigger] = useState(0);


useEffect(() => {
  const strength = calculateProfileStrength();
  setProfileStrength(strength);
  
  if (strength < 30) setStrengthLevel("Basic");
  else if (strength < 60) setStrengthLevel("Building");
  else if (strength < 85) setStrengthLevel("Strong");
  else setStrengthLevel("Complete");
}, [profilePhoto, profileUpdateTrigger]);

useEffect(() => {
  const handleStorageChange = () => {
    const photo = localStorage.getItem("shavy_profile_photo");
    if (photo) {
      setProfilePhoto(photo);
      setProfileUpdateTrigger(prev => prev + 1);
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

const getStrengthColor = () => {
  if (profileStrength < 30) return "#ef4444";
  if (profileStrength < 60) return "#f97316";
  if (profileStrength < 85) return "#eab308";
  return "#22c55e";
};

  const verifyDeletePin = () => {
    const storedPin = localStorage.getItem("shavy_vault_pin");
    if (deletePin === storedPin) {
      setShowDeletePinModal(false);
      handleDeleteAllData();
    } else {
      setDeletePinError("Incorrect PIN");
      setDeletePin("");
      setTimeout(() => setDeletePinError(""), 2000);
    }
  };

  const handleDeleteAllData = () => {
    localStorage.removeItem("shavy_resumeScanned");
    localStorage.removeItem("shavy_skills");
    localStorage.removeItem("shavy_description");
    localStorage.removeItem("shavy_profile_photo");
    localStorage.removeItem("shavy_enrolled_courses");
    localStorage.removeItem("shavy_founders_enabled");
    localStorage.removeItem("shavy_cvbuilder_enabled");
    localStorage.removeItem("shavy_ads_removed");
    sessionStorage.removeItem("shavy_vault_unlocked");
    localStorage.removeItem("shavy_vault_pin");
    localStorage.removeItem("shavy_vault_data");
    localStorage.removeItem("shavy_extracted_phone");
    localStorage.removeItem("shavy_extracted_address");
    sessionStorage.removeItem("shavy_vault_unlocked");
    localStorage.removeItem("shavy_onboarding_completed");
    setProfilePhoto(null);
    setFoundersEnabled(false);
    setCvBuilderEnabled(false);
    setAdsRemoved(false);
    window.dispatchEvent(new CustomEvent("showToast", { detail: "All data deleted" }));
    setShowDeleteConfirm(false);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleExportData = () => {
    const data = {
      scanned: localStorage.getItem("shavy_resumeScanned") === "true",
      skills: JSON.parse(localStorage.getItem("shavy_skills") || "[]"),
      description: localStorage.getItem("shavy_description") || "",
      foundersEnabled: foundersEnabled,
      cvBuilderEnabled: cvBuilderEnabled,
      adsRemoved: adsRemoved,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shavy-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent("showToast", { detail: "Profile exported!" }));
  };

  const handleChangePin = () => {
    setPinError("");
    setPinSuccess("");
    
    const storedPin = localStorage.getItem("shavy_vault_pin");
    if (!storedPin) {
      setPinError("No PIN set up yet. Go to Vault to create one first.");
      return;
    }
    
    if (oldPin !== storedPin) {
      setPinError("Current PIN is incorrect");
      return;
    }
    
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinError("New PIN must be 4 digits");
      return;
    }
    
    if (newPin !== confirmPin) {
      setPinError("New PINs don't match");
      return;
    }
    
    localStorage.setItem("shavy_vault_pin", newPin);
    setPinSuccess("PIN changed successfully!");
    setTimeout(() => {
      setShowPinModal(false);
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
      setPinSuccess("");
      setPinError("");
    }, 1500);
  };

  const handleFoundersPurchase = () => {
    onPurchase("founders", 9.99);
  };

  const handleCvBuilderPurchase = () => {
    onPurchase("cvbuilder", 14.99);
  };

  const handleAdsPurchase = () => {
    onPurchase("ads", 2.99);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: "40px",
        height: "20px",
        borderRadius: "20px",
        backgroundColor: checked ? "#d4af37" : "#6b7280",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.2s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );

  const faqItems = [
    { q: "How does Shavy protect my data?", a: "All your data stays on your device. Shavy never sees, sells, or shares your personal information." },
    { q: "Is Shavy really free?", a: "Yes! Basic features are completely free. We only charge companies for job postings." },
    { q: "How do I delete my data?", a: "Go to Security section in Settings and click 'Delete All Data'." },
    { q: "What file types can I upload?", a: "We support PDF, DOCX, and TXT files for resume uploads." },
    { q: "How does company auditing work?", a: "We analyze public records, financial data, and ex-employee reviews to generate trust scores." },
  ];

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    cursor: "pointer",
    borderBottom: `1px solid ${c.border}`,
    transition: "all 0.2s ease",
  };

  const iconStyle = { fontSize: "16px", width: "28px", opacity: 0.7 };
  const labelStyle = { fontSize: "14px", fontWeight: "500", color: c.text, flex: 1 };
  const valueStyle = { fontSize: "12px", color: c.textMuted };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Profile Strength Meter */}
<div style={{
  backgroundColor: c.cardBg,
  borderRadius: "16px",
  padding: "16px",
  border: `1px solid ${c.border}`,
  marginBottom: "12px",
}}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>      <span style={{ fontSize: "13px", fontWeight: "600", color: c.text }}>Profile Strength</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "18px", fontWeight: "700", color: getStrengthColor() }}>{profileStrength}%</span>
      <span style={{ fontSize: "11px", color: c.textMuted }}>{strengthLevel}</span>
    </div>
  </div>
  
  {/* Progress Bar */}
  <div style={{
    height: "8px",
    backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "12px",
  }}>
    <div style={{
      width: `${profileStrength}%`,
      height: "100%",
      background: `linear-gradient(90deg, ${getStrengthColor()}, ${getStrengthColor()}80)`,
      borderRadius: "10px",
      transition: "width 0.3s ease",
    }} />
  </div>
  
  {/* Checklist */}
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "10px", color: c.textMuted }}>
    {[
  { label: "Profile Photo", check: profilePhoto !== null },
  { label: "Full Name", check: localStorage.getItem("shavy_user_name") || localStorage.getItem("shavy_extracted_name") },
  { label: "Email", check: localStorage.getItem("shavy_user_email") || localStorage.getItem("shavy_extracted_email") },
  { label: "Skills Added", check: JSON.parse(localStorage.getItem("shavy_skills") || "[]").length > 0 },
  { label: "Resume Uploaded", check: localStorage.getItem("shavy_resumeScanned") === "true" },
  { label: "Vault PIN Set", check: localStorage.getItem("shavy_vault_pin") !== null },
].map((item, idx) => (
  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <span style={{ color: item.check ? "#22c55e" : "#ef4444" }}>{item.check ? "✅" : "❌"}</span>
    <span>{item.label}</span>
  </div>
))}
  </div>
  
  {profileStrength < 100 && (
    <p style={{ fontSize: "10px", color: c.textMuted, marginTop: "12px", textAlign: "center", fontStyle: "italic" }}>
      💡 Complete all items to reach 100% profile strength
    </p>
  )}
</div>

      {/* Security Section */}
      <div style={{
        backgroundColor: c.cardBg,
        borderRadius: "16px",
        border: `1px solid ${c.border}`,
        overflow: "hidden",
      }}>
        <div onClick={() => handleSectionToggle("security")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>🔒</span>
            <span style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Security</span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: "300", color: c.textMuted }}>
            {openSection === "security" ? "−" : "+"}
          </span>
        </div>
        {openSection === "security" && (
          <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${c.border}` }}>
            <div onClick={handleExportData} style={menuItemStyle}>
              <span style={iconStyle}>📤</span>
              <span style={labelStyle}>Export Data</span>
              <span style={valueStyle}>JSON</span>
            </div>
            <div onClick={() => setShowPinModal(true)} style={menuItemStyle}>
              <span style={iconStyle}>🔑</span>
              <span style={labelStyle}>Change Vault PIN</span>
              <span style={valueStyle}>→</span>
            </div>
            {!showDeleteConfirm ? (
              <div onClick={() => setShowDeleteConfirm(true)} style={{ ...menuItemStyle, borderBottom: "none" }}>
                <span style={iconStyle}>🗑️</span>
                <span style={{ ...labelStyle, color: "#ef4444" }}>Delete All</span>
              </div>
            ) : (
              <div style={{ marginTop: "12px", padding: "12px", backgroundColor: c.secondaryBg, borderRadius: "12px" }}>
                <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "12px" }}>⚠️ Permanent deletion — this action cannot be undone</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleDeleteRequest} style={{ background: "#ef4444", border: "none", padding: "8px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: "500", color: "#fff", cursor: "pointer" }}>Yes</button>
                  <button onClick={() => setShowDeleteConfirm(false)} style={{ background: "transparent", border: `1px solid ${c.border}`, padding: "8px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: "500", color: c.textMuted, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div style={{
        backgroundColor: c.cardBg,
        borderRadius: "16px",
        border: `1px solid ${c.border}`,
        overflow: "hidden",
      }}>
        <div onClick={() => handleSectionToggle("notifications")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <span style={{ fontSize: "16px", opacity: 0.7 }}>🔔</span>
    <span style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Notifications</span>
  </div>
  <span style={{ fontSize: "16px", fontWeight: "300", color: c.textMuted }}>
    {openSection === "notifications" ? "−" : "+"}
  </span>
</div>
{openSection === "notifications" && (
  <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${c.border}` }}>
    
    {/* Email Notifications - Slider Toggle */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={iconStyle}>📧</span>
        <span style={labelStyle}>Email</span>
      </div>
      
      {/* Slider Toggle for Email */}
      <button
        onClick={() => setEmailNotifications(!emailNotifications)}
        style={{
          width: "44px",
          height: "24px",
          backgroundColor: emailNotifications ? "#d4af37" : (theme === "dark" ? "#3a3a3a" : "#cbd5e1"),
          borderRadius: "34px",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background-color 0.3s ease",
          padding: "2px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: emailNotifications ? "22px" : "2px",
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>

    {/* Job Alerts - Slider Toggle */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={iconStyle}>💼</span>
        <span style={labelStyle}>Job Alerts</span>
      </div>
      
      {/* Slider Toggle for Job Alerts */}
      <button
        onClick={() => setJobAlerts(!jobAlerts)}
        style={{
          width: "44px",
          height: "24px",
          backgroundColor: jobAlerts ? "#d4af37" : (theme === "dark" ? "#3a3a3a" : "#cbd5e1"),
          borderRadius: "34px",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background-color 0.3s ease",
          padding: "2px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: jobAlerts ? "22px" : "2px",
            transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>

  </div>
)}
      </div>

      {/* Support Section */}
      <div style={{
        backgroundColor: c.cardBg,
        borderRadius: "16px",
        border: `1px solid ${c.border}`,
        overflow: "hidden",
      }}>
        <div onClick={() => handleSectionToggle("support")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px", opacity: 0.7 }}>🛟</span>
            <span style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Support</span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: "300", color: c.textMuted }}>
            {openSection === "support" ? "−" : "+"}
          </span>
        </div>
        {openSection === "support" && (
          <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${c.border}` }}>
            <a href="mailto:support@shavy.com" style={{ textDecoration: "none" }}>
              <div style={menuItemStyle}>
                <span style={iconStyle}>📧</span>
                <span style={labelStyle}>Email</span>
                <span style={valueStyle}>support@shavy.com</span>
              </div>
            </a>
            <div style={menuItemStyle}>
              <span style={iconStyle}>💬</span>
              <span style={labelStyle}>Live Chat</span>
              <span style={valueStyle}>Soon</span>
            </div>
            <div onClick={() => setShowFaqModal(true)} style={{ ...menuItemStyle, borderBottom: "none" }}>
              <span style={iconStyle}>❓</span>
              <span style={labelStyle}>FAQ</span>
              <span style={valueStyle}>→</span>
            </div>
          </div>
        )}
      </div>

      {/* About Section */}
<div style={{
  backgroundColor: c.cardBg,
  borderRadius: "16px",
  border: `1px solid ${c.border}`,
  overflow: "hidden",
}}>
  <div onClick={() => handleSectionToggle("about")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontSize: "16px", opacity: 0.7 }}>ℹ️</span>
      <span style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>About</span>
    </div>
    <span style={{ fontSize: "16px", fontWeight: "300", color: c.textMuted }}>
      {openSection === "about" ? "−" : "+"}
    </span>
  </div>
  {openSection === "about" && (
    <div style={{ padding: "0 16px 16px 16px", borderTop: `1px solid ${c.border}` }}>
      <div style={menuItemStyle}>
        <span style={iconStyle}>📦</span>
        <span style={labelStyle}>Version</span>
        <span style={valueStyle}>1.0.0</span>
      </div>
      <div onClick={() => setShowPrivacyModal(true)} style={menuItemStyle}>
        <span style={iconStyle}>📜</span>
        <span style={labelStyle}>Privacy</span>
        <span style={valueStyle}>→</span>
      </div>
      <div onClick={() => setShowTermsModal(true)} style={{ ...menuItemStyle, borderBottom: "none" }}>
        <span style={iconStyle}>⚖️</span>
        <span style={labelStyle}>Terms</span>
        <span style={valueStyle}>→</span>
      </div>
    </div>
  )}
</div>

      {/* Founders Ecosystem Purchase Card - only show if NOT enabled */}
      {!foundersEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "16px",
            padding: "16px",
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
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: c.text, marginBottom: "4px" }}>
            Founders Ecosystem
          </h3>
          <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "12px" }}>
            Connect with founders, mentors, and exclusive opportunities
          </p>
          <button
            onClick={handleFoundersPurchase}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Upgrade — $9.99/mo
          </button>
        </div>
      )}

      {/* CV Builder Purchase Card - only show if NOT enabled */}
      {!cvBuilderEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "16px",
            padding: "16px",
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
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: c.text, marginBottom: "4px" }}>
            CV Builder
          </h3>
          <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "12px" }}>
            Build professional CVs with AI-powered templates • Export as PDF
          </p>
          <button
            onClick={handleCvBuilderPurchase}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Upgrade — $14.99 one-time
          </button>
        </div>
      )}

      {/* Remove Ads Purchase Card - only show if NOT enabled */}
      {!adsRemoved && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "16px",
            padding: "16px",
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
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛡️</div>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: c.text, marginBottom: "4px" }}>
            Remove Ads
          </h3>
          <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "12px" }}>
            Enjoy an ad-free experience across the app
          </p>
          <button
            onClick={handleAdsPurchase}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "8px 16px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Remove Ads — $2.99 one-time
          </button>
        </div>
      )}

      {/* PIN Change Modal */}
      {showPinModal && (
        <>
          <div onClick={() => {
            setShowPinModal(false);
            setOldPin("");
            setNewPin("");
            setConfirmPin("");
            setPinError("");
            setPinSuccess("");
          }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 100 }} />
          <div style={{ 
            position: "fixed", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            width: "340px", 
            maxWidth: "calc(100% - 32px)",
            backgroundColor: c.cardBg, 
            borderRadius: "24px", 
            padding: "28px 24px", 
            zIndex: 101, 
            border: `1px solid ${c.border}`,
            boxShadow: "0 20px 35px -10px rgba(0,0,0,0.4)",
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px", color: c.text, textAlign: "center" }}>
              🔐 Change Vault PIN
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Current PIN */}
              <div>
                <label style={{ fontSize: "12px", color: c.textMuted, marginBottom: "6px", display: "block" }}>Current PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={4}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                    border: `1px solid ${c.border}`,
                    borderRadius: "14px",
                    color: c.text,
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "4px",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#d4af37"}
                  onBlur={(e) => e.currentTarget.style.borderColor = c.border}
                />
              </div>

              {/* New PIN */}
              <div>
                <label style={{ fontSize: "12px", color: c.textMuted, marginBottom: "6px", display: "block" }}>New PIN (4 digits)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                    border: `1px solid ${c.border}`,
                    borderRadius: "14px",
                    color: c.text,
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "4px",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#d4af37"}
                  onBlur={(e) => e.currentTarget.style.borderColor = c.border}
                />
              </div>

              {/* Confirm PIN */}
              <div>
                <label style={{ fontSize: "12px", color: c.textMuted, marginBottom: "6px", display: "block" }}>Confirm New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                    border: `1px solid ${c.border}`,
                    borderRadius: "14px",
                    color: c.text,
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "4px",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s ease",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#d4af37"}
                  onBlur={(e) => e.currentTarget.style.borderColor = c.border}
                />
              </div>
              
              {pinError && (
                <div style={{ 
                  fontSize: "12px", 
                  color: "#ef4444", 
                  textAlign: "center",
                  padding: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "10px",
                }}>
                  ⚠️ {pinError}
                </div>
              )}
              {pinSuccess && (
                <div style={{ 
                  fontSize: "12px", 
                  color: "#22c55e", 
                  textAlign: "center",
                  padding: "8px",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "10px",
                }}>
                  ✓ {pinSuccess}
                </div>
              )}
              
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={handleChangePin}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #d4af37, #b8860b)",
                    border: "none",
                    padding: "12px",
                    borderRadius: "40px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Change PIN
                </button>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setOldPin("");
                    setNewPin("");
                    setConfirmPin("");
                    setPinError("");
                    setPinSuccess("");
                  }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: `1px solid ${c.border}`,
                    padding: "12px",
                    borderRadius: "40px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: c.textMuted,
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Privacy Modal */}
{showPrivacyModal && (
  <>
    <div onClick={() => setShowPrivacyModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 100 }} />
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "280px", backgroundColor: c.cardBg, borderRadius: "20px", padding: "20px", zIndex: 101, border: `1px solid ${c.border}` }}>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: c.text }}>Privacy</h3>
      <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "20px", lineHeight: "1.5" }}>Privacy isn't optional. Your data lives only on your device, end-to-end encrypted. Shavy never collects, sells, or shares anything. Your information belongs to you — always.</p>
      <button onClick={() => setShowPrivacyModal(false)} style={{ width: "100%", background: "linear-gradient(135deg, #d4af37, #b8860b)", border: "none", padding: "10px", borderRadius: "40px", fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Got it</button>
    </div>
  </>
)}

{/* FAQ Modal */}
{showFaqModal && (
  <>
    <div onClick={() => setShowFaqModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 100 }} />
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", maxHeight: "70vh", overflowY: "auto", backgroundColor: c.cardBg, borderRadius: "20px", padding: "20px", zIndex: 101, border: `1px solid ${c.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text }}>FAQ</h3>
        <button onClick={() => setShowFaqModal(false)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: c.textMuted }}>✕</button>
      </div>
      {faqItems.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "12px", borderBottom: idx < faqItems.length - 1 ? `1px solid ${c.border}` : "none" }}>
          <div onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", cursor: "pointer" }}>
            <span style={{ fontSize: "13px", fontWeight: "500", color: c.text, flex: 1 }}>{item.q}</span>
            <span style={{ fontSize: "12px", color: c.textMuted }}>{openFaqIndex === idx ? "−" : "+"}</span>
          </div>
          {openFaqIndex === idx && (
            <p style={{ fontSize: "12px", color: c.textMuted, paddingBottom: "10px", lineHeight: "1.4" }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  </>
)}

{/* Terms & Conditions Modal */}
{showTermsModal && (
  <>
    <div onClick={() => setShowTermsModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 100 }} />
    <div style={{ 
      position: "fixed", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)", 
      width: "320px", 
      maxHeight: "80vh", 
      overflowY: "auto", 
      backgroundColor: c.cardBg, 
      borderRadius: "20px", 
      padding: "24px", 
      zIndex: 101, 
      border: `1px solid ${c.border}` 
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text }}>📜 Terms & Conditions</h3>
        <button onClick={() => setShowTermsModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: c.textMuted }}>✕</button>
      </div>
      
      <div style={{ fontSize: "12px", color: c.textMuted, lineHeight: "1.5", marginBottom: "20px" }}>
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>1. Data Privacy</strong><br />
          All your data is stored locally on your device. Shavy does not collect, sell, or share any of your personal information. Your resume, skills, and vault data remain entirely under your control.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>2. User Responsibility</strong><br />
          You are responsible for maintaining the security of your Vault PIN. Shavy cannot recover lost PINs or access your encrypted data.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>3. Payments & Refunds</strong><br />
          All payments are processed securely through our payment partners. Purchases are final unless otherwise stated. Subscription services can be cancelled anytime.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>4. Intellectual Property</strong><br />
          The Shavy platform, including its design, logo, content, and code, is the property of Shavy. You retain all rights to your uploaded content.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>5. Disclaimer of Warranties</strong><br />
          Shavy provides career insights and company audits based on publicly available data. We do not guarantee job placement, salary outcomes, or investment decisions.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>6. Limitation of Liability</strong><br />
          To the maximum extent permitted by law, Shavy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>7. Modifications to Terms</strong><br />
          We reserve the right to update these terms at any time. Continued use of Shavy after changes constitutes acceptance of the new terms.
        </p>
        
        <p style={{ marginBottom: "14px" }}>
          <strong style={{ color: c.goldAccent }}>8. Governing Law</strong><br />
          These terms shall be governed by and construed in accordance with the laws of Pakistan.
        </p>
        
        <p style={{ marginTop: "16px", paddingTop: "12px", borderTop: `1px solid ${c.border}`, fontSize: "10px", textAlign: "center" }}>
          Last updated: March 2026
        </p>
      </div>
      
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setShowTermsModal(false)}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #d4af37, #b8860b)",
            border: "none",
            padding: "12px",
            borderRadius: "40px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          I Agree
        </button>
        <button
          onClick={() => setShowTermsModal(false)}
          style={{
            flex: 1,
            background: "transparent",
            border: `1px solid ${c.border}`,
            padding: "12px",
            borderRadius: "40px",
            fontSize: "14px",
            fontWeight: "500",
            color: c.textMuted,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  </>
)}

      {/* Delete PIN Verification Modal */}
      {showDeletePinModal && (
        <>
          <div onClick={() => {
            setShowDeletePinModal(false);
            setDeletePin("");
            setDeletePinError("");
          }} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 100 }} />
          <div style={{ 
            position: "fixed", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            width: "300px", 
            backgroundColor: c.cardBg, 
            borderRadius: "24px", 
            padding: "24px", 
            zIndex: 101, 
            border: `1px solid ${c.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text, marginBottom: "8px" }}>
              Verify PIN to Delete
            </h3>
            <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "20px" }}>
              This action is permanent and cannot be undone.
            </p>
            
            <input
              type="password"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={deletePin}
              onChange={(e) => setDeletePin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              autoFocus
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${deletePinError ? "#ef4444" : c.border}`,
                backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                color: c.text,
                fontSize: "20px",
                textAlign: "center",
                letterSpacing: "8px",
                fontFamily: "monospace",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />
            
            {deletePinError && (
              <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "16px" }}>
                {deletePinError}
              </p>
            )}
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={verifyDeletePin}
                disabled={deletePin.length !== 4}
                style={{
                  flex: 1,
                  background: deletePin.length === 4 ? "linear-gradient(135deg, #d4af37, #b8860b)" : (theme === "dark" ? "#3a3a3a" : "#e2e8f0"),
                  border: "none",
                  padding: "12px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: deletePin.length === 4 ? "#111827" : c.textMuted,
                  cursor: deletePin.length === 4 ? "pointer" : "not-allowed",
                }}
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setShowDeletePinModal(false);
                  setDeletePin("");
                  setDeletePinError("");
                }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${c.border}`,
                  padding: "12px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: c.textMuted,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}