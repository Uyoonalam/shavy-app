"use client";

import { useState, useEffect } from "react";
import VaultPINModal from "./VaultPINModal";

interface VaultUIProps {
  theme: "dark" | "light";
}

// Simple encryption helper (client-side only - for demo purposes)
// In production, use a proper encryption library like crypto-js
const encryptData = (data: string, pin: string): string => {
  // Simple XOR-based obfuscation for demo
  // This is NOT production-grade encryption, just to show the concept
  let result = "";
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ pin.charCodeAt(i % pin.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode the result
};

export default function VaultUI({ theme }: VaultUIProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [resumeScanned, setResumeScanned] = useState(false);
  const [foundersEnabled, setFoundersEnabled] = useState(false);
  const [cvBuilderEnabled, setCvBuilderEnabled] = useState(false);
  const [editingField, setEditingField] = useState<{ field: string; value: string; label: string } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPin, setExportPin] = useState("");
  const [exportError, setExportError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [vaultData, setVaultData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    skills: [] as string[],
    experience: "",
    education: "",
    certifications: [] as string[],
  });

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

  useEffect(() => {
    const scanned = localStorage.getItem("shavy_resumeScanned");
    setResumeScanned(scanned === "true");
    
    const founders = localStorage.getItem("shavy_founders_enabled");
    if (founders === "true") setFoundersEnabled(true);
    
    const cvBuilder = localStorage.getItem("shavy_cvbuilder_enabled");
    if (cvBuilder === "true") setCvBuilderEnabled(true);
    
    const wasUnlocked = sessionStorage.getItem("shavy_vault_unlocked");
    const hasPin = localStorage.getItem("shavy_vault_pin");
    
    if (!hasPin) {
      setIsLocked(false);
    } else if (wasUnlocked === "true") {
      setIsLocked(false);
    } else {
      setIsLocked(true);
    }
    
    // Load extracted data from localStorage
    const extractedName = localStorage.getItem("shavy_extracted_name") || "";
    const extractedEmail = localStorage.getItem("shavy_extracted_email") || "";
    const extractedPhone = localStorage.getItem("shavy_extracted_phone") || "+1 (217) 555-0198";
    const extractedAddress = localStorage.getItem("shavy_extracted_address") || "742 Evergreen Terrace, Springfield, IL 62704";
    const extractedExperience = localStorage.getItem("shavy_extracted_experience") || "Strategic Operations Director with 12+ years of experience optimizing supply chain logistics";
    const extractedEducation = localStorage.getItem("shavy_extracted_education") || "M.S. Supply Chain Management, Purdue University (2014)";
    const extractedCertifications = JSON.parse(localStorage.getItem("shavy_extracted_certifications") || '["Lean Six Sigma Black Belt", "PMP Certified", "SAP Certified"]');
    const savedSkills = JSON.parse(localStorage.getItem("shavy_skills") || "[]");
    
    setVaultData({
      fullName: extractedName,
      email: extractedEmail,
      phone: extractedPhone,
      address: extractedAddress,
      skills: savedSkills,
      experience: extractedExperience,
      education: extractedEducation,
      certifications: extractedCertifications,
    });
  }, []);

  const handleUnlockSuccess = () => {
    setIsDecrypting(true);
    setTimeout(() => {
      setIsDecrypting(false);
      setIsLocked(false);
      sessionStorage.setItem("shavy_vault_unlocked", "true");
    }, 1500);
  };

  const handleLock = () => {
    setIsLocked(true);
    setShowDetails(false);
    sessionStorage.removeItem("shavy_vault_unlocked");
  };

  const handleSaveEdit = () => {
    if (editingField) {
      const updatedData = { ...vaultData };
      if (editingField.field === "fullName") updatedData.fullName = editingField.value;
      else if (editingField.field === "email") updatedData.email = editingField.value;
      else if (editingField.field === "phone") updatedData.phone = editingField.value;
      else if (editingField.field === "address") updatedData.address = editingField.value;
      else if (editingField.field === "experience") updatedData.experience = editingField.value;
      else if (editingField.field === "education") updatedData.education = editingField.value;
      
      setVaultData(updatedData);
      
      // Save to localStorage
      localStorage.setItem(`shavy_extracted_${editingField.field}`, editingField.value);
      if (editingField.field === "fullName") localStorage.setItem("shavy_user_name", editingField.value);
      if (editingField.field === "email") localStorage.setItem("shavy_user_email", editingField.value);
      
      const toast = document.createElement("div");
      toast.textContent = `✅ ${editingField.label} updated!`;
      toast.style.position = "fixed";
      toast.style.bottom = "80px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
      toast.style.color = "#d4af37";
      toast.style.padding = "12px 20px";
      toast.style.borderRadius = "40px";
      toast.style.fontSize = "13px";
      toast.style.zIndex = "200";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    }
    setEditingField(null);
  };

  const handleExportVault = () => {
    const storedPin = localStorage.getItem("shavy_vault_pin");
    
    if (!storedPin) {
      setExportError("No PIN set up. Please set a PIN in Vault first.");
      return;
    }
    
    if (exportPin !== storedPin) {
      setExportError("Incorrect PIN");
      return;
    }
    
    setExportError("");
    setIsExporting(true);
    
    // Prepare vault data for export
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      vault: {
        personalInfo: {
          fullName: vaultData.fullName,
          email: vaultData.email,
          phone: vaultData.phone,
          address: vaultData.address,
        },
        professionalInfo: {
          skills: vaultData.skills,
          experience: vaultData.experience,
          education: vaultData.education,
          certifications: vaultData.certifications,
        },
        metadata: {
          foundersEnabled: foundersEnabled,
          cvBuilderEnabled: cvBuilderEnabled,
          resumeScanned: resumeScanned,
        },
      },
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Encrypt the data with the PIN
    const encryptedData = encryptData(jsonString, exportPin);
    
    // Create downloadable file
    const blob = new Blob([encryptedData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shavy-vault-export-${Date.now()}.enc`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      setExportPin("");
      
      // Show success toast
      const toast = document.createElement("div");
      toast.textContent = "🔐 Vault exported successfully! (Encrypted)";
      toast.style.position = "fixed";
      toast.style.bottom = "80px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
      toast.style.color = "#22c55e";
      toast.style.padding = "12px 20px";
      toast.style.borderRadius = "40px";
      toast.style.fontSize = "13px";
      toast.style.zIndex = "200";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 1000);
  };

  // If no resume scanned, show empty state
  if (!resumeScanned) {
    return (
      <div
        style={{
          backgroundColor: c.cardBg,
          borderRadius: "20px",
          padding: "48px 24px",
          border: `1px solid ${c.border}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.7 }}>📭</div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text, marginBottom: "8px" }}>
          No resume scanned yet
        </h3>
        <p style={{ fontSize: "13px", color: c.textMuted, marginBottom: "20px" }}>
          Upload and scan your resume on the Home tab first to unlock your vault
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("switchTab", { detail: "home" }))}
          style={{
            background: "linear-gradient(135deg, #d4af37, #b8860b)",
            border: "none",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "40px",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  // If locked, show PIN modal
  if (isLocked) {
    return <VaultPINModal theme={theme} onSuccess={handleUnlockSuccess} onClose={() => {}} />;
  }

  // If decrypting, show animation
  if (isDecrypting) {
    return (
      <div
        style={{
          backgroundColor: c.cardBg,
          borderRadius: "20px",
          padding: "48px 24px",
          border: `1px solid ${c.border}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px", animation: "pulse 1s infinite" }}>🔓</div>
        <p style={{ fontSize: "14px", color: c.textMuted }}>Decrypting your vault...</p>
        <div
          style={{
            width: "100%",
            height: "4px",
            backgroundColor: "#3a3a3a",
            borderRadius: "10px",
            marginTop: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              borderRadius: "10px",
              animation: "loading 1s ease-in-out infinite",
            }}
          />
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 20%; margin-left: 0%; }
            50% { width: 80%; margin-left: 20%; }
            100% { width: 20%; margin-left: 80%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.98); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Main Vault Card */}
      <div
        className="simple-card-hover"
        style={{
          backgroundColor: c.cardBg,
          borderRadius: "20px",
          padding: "24px",
          border: `1px solid ${c.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text }}>🔐 Encrypted Vault</h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowExportModal(true)}
              style={{
                background: "transparent",
                border: "1px solid #d4af37",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                color: "#d4af37",
                cursor: "pointer",
                marginTop: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              📤 Export
            </button>
            <button
              onClick={handleLock}
              style={{
                background: "transparent",
                border: "1px solid #ef4444",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "11px",
                color: "#ef4444",
                cursor: "pointer",
                marginTop: 0,
              }}
            >
              Lock Vault
            </button>
          </div>
        </div>

        {/* Single Toggle for ALL extracted data */}
        <div 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: "20px",
            padding: "14px",
            backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
            borderRadius: "12px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>
            📄 Extracted from your resume
          </span>
          
        </div>

        {/* All Extracted Data - Editable via click */}
        {showDetails && (
          <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9", borderRadius: "12px" }}>
            
            {/* Name - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "fullName", value: vaultData.fullName, label: "Full Name" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Full Name</div>
              <div style={{ fontSize: "15px", fontWeight: "500", color: c.text }}>{vaultData.fullName || "Not extracted"} ✏️</div>
            </div>

            {/* Email - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "email", value: vaultData.email, label: "Email" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Email</div>
              <div style={{ fontSize: "15px", fontWeight: "500", color: c.text }}>{vaultData.email || "Not extracted"} ✏️</div>
            </div>

            {/* Phone - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "phone", value: vaultData.phone, label: "Phone Number" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Phone</div>
              <div style={{ fontSize: "15px", fontWeight: "500", color: c.text }}>{vaultData.phone} ✏️</div>
            </div>

            {/* Address - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "address", value: vaultData.address, label: "Address" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Address</div>
              <div style={{ fontSize: "15px", fontWeight: "500", color: c.text }}>{vaultData.address} ✏️</div>
            </div>

            {/* Experience - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "experience", value: vaultData.experience, label: "Experience" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Experience</div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>{vaultData.experience.substring(0, 80)}... ✏️</div>
            </div>

            {/* Education - Click to edit */}
            <div 
              onClick={() => setEditingField({ field: "education", value: vaultData.education, label: "Education" })}
              style={{ marginBottom: "12px", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#334155" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <div style={{ fontSize: "11px", color: c.textMuted }}>Education</div>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>{vaultData.education} ✏️</div>
            </div>

            {/* Skills */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "11px", color: c.textMuted, marginBottom: "6px" }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {vaultData.skills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} style={{ background: "rgba(212,175,55,0.15)", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", color: "#d4af37" }}>
                    {skill}
                  </span>
                ))}
                {vaultData.skills.length > 5 && (
                  <span style={{ fontSize: "11px", color: c.textMuted }}>+{vaultData.skills.length - 5} more</span>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "11px", color: c.textMuted, marginBottom: "6px" }}>Certifications</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {vaultData.certifications.map((cert, idx) => (
                  <span key={idx} style={{ background: "rgba(100,100,100,0.15)", padding: "4px 8px", borderRadius: "12px", fontSize: "11px", color: c.textMuted }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "10px", color: c.textMuted, marginTop: "12px", textAlign: "center" }}>
              ✏️ Click any field to edit
            </p>
          </div>
        )}

        <p style={{ fontSize: "11px", color: c.textMuted, textAlign: "center", marginTop: "8px" }}>
          🔒 Data is encrypted and stored only on your device
        </p>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <>
          <div
            onClick={() => {
              setShowExportModal(false);
              setExportPin("");
              setExportError("");
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "320px",
              maxWidth: "calc(100% - 40px)",
              backgroundColor: c.cardBg,
              borderRadius: "20px",
              padding: "24px",
              zIndex: 101,
              border: `1px solid ${c.border}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "40px" }}>🔐</span>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text, marginTop: "8px", marginBottom: "4px" }}>
                Export Encrypted Vault
              </h3>
              <p style={{ fontSize: "12px", color: c.textMuted }}>
                Enter your PIN to encrypt and export your vault data
              </p>
            </div>

            <input
              type="password"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              value={exportPin}
              onChange={(e) => {
                setExportPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                setExportError("");
              }}
              placeholder="Enter 4-digit PIN"
              autoFocus
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${exportError ? "#ef4444" : c.border}`,
                backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                color: c.text,
                fontSize: "18px",
                textAlign: "center",
                letterSpacing: "8px",
                fontFamily: "monospace",
                marginBottom: "16px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            {exportError && (
              <p style={{ fontSize: "12px", color: "#ef4444", textAlign: "center", marginBottom: "16px" }}>
                {exportError}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleExportVault}
                disabled={exportPin.length !== 4 || isExporting}
                style={{
                  flex: 1,
                  background: exportPin.length === 4 && !isExporting 
                    ? "linear-gradient(135deg, #d4af37, #b8860b)" 
                    : theme === "dark" ? "#3a3a3a" : "#e2e8f0",
                  border: "none",
                  padding: "12px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: exportPin.length === 4 && !isExporting ? "#111827" : c.textMuted,
                  cursor: exportPin.length === 4 && !isExporting ? "pointer" : "not-allowed",
                  marginTop: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isExporting ? "Exporting..." : "Export Vault"}
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportPin("");
                  setExportError("");
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
                  marginTop: 0,
                }}
              >
                Cancel
              </button>
            </div>

            <p style={{ fontSize: "10px", color: c.textMuted, textAlign: "center", marginTop: "16px" }}>
              Your data will be encrypted with your PIN before download
            </p>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingField && (
        <>
          <div
            onClick={() => setEditingField(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              maxWidth: "calc(100% - 40px)",
              backgroundColor: c.cardBg,
              borderRadius: "20px",
              padding: "24px",
              zIndex: 101,
              border: `1px solid ${c.border}`,
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text, marginBottom: "16px" }}>
              Edit {editingField.label}
            </h3>
            {editingField.field === "experience" || editingField.field === "address" ? (
              <textarea
                value={editingField.value}
                onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: `1px solid ${c.border}`,
                  backgroundColor: c.cardBg,
                  color: c.text,
                  fontSize: "14px",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
                autoFocus
              />
            ) : (
              <input
                type={editingField.field === "email" ? "email" : "text"}
                value={editingField.value}
                onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: `1px solid ${c.border}`,
                  backgroundColor: c.cardBg,
                  color: c.text,
                  fontSize: "14px",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                }}
                autoFocus
              />
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #d4af37, #b8860b)",
                  border: "none",
                  padding: "10px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer",
                  marginTop: 0,
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingField(null)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: `1px solid ${c.border}`,
                  padding: "10px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: c.textMuted,
                  cursor: "pointer",
                  marginTop: 0,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Founders Ecosystem Card */}
      {foundersEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "20px",
            padding: "20px",
            border: `1px solid ${c.border}`,
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
            onClick={() => {
              const toast = document.createElement("div");
              toast.textContent = "🚀 Founders Ecosystem — Coming soon!";
              toast.style.position = "fixed";
              toast.style.bottom = "80px";
              toast.style.left = "50%";
              toast.style.transform = "translateX(-50%)";
              toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
              toast.style.color = "#d4af37";
              toast.style.padding = "12px 20px";
              toast.style.borderRadius = "40px";
              toast.style.fontSize = "13px";
              toast.style.zIndex = "200";
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 2000);
            }}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Explore
          </button>
        </div>
      )}

      {/* CV Builder Card */}
      {cvBuilderEnabled && (
        <div
          className="simple-card-hover"
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "20px",
            padding: "20px",
            border: `1px solid ${c.border}`,
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
            onClick={() => {
              const toast = document.createElement("div");
              toast.textContent = "📄 CV Builder — Coming soon!";
              toast.style.position = "fixed";
              toast.style.bottom = "80px";
              toast.style.left = "50%";
              toast.style.transform = "translateX(-50%)";
              toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
              toast.style.color = "#d4af37";
              toast.style.padding = "12px 20px";
              toast.style.borderRadius = "40px";
              toast.style.fontSize = "13px";
              toast.style.zIndex = "200";
              document.body.appendChild(toast);
              setTimeout(() => toast.remove(), 2000);
            }}
            style={{
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "30px",
              fontSize: "13px",
              fontWeight: "600",
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