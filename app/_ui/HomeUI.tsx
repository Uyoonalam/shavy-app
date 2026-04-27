"use client";

import { useState, useEffect } from "react";

interface HomeUIProps {
  theme: "dark" | "light";
}

export default function HomeUI({ theme }: HomeUIProps) {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [showAds, setShowAds] = useState(true);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showEditSkill, setShowEditSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillProficiency, setEditSkillProficiency] = useState(50);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState(50);
  const [skillsExpanded, setSkillsExpanded] = useState(false);

  const colors = {
    dark: {
      cardBg: "#2A2622",
      border: "#3a3a3a",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
      goldAccent: "#d4af37",
    },
    light: {
      cardBg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      textMuted: "#64748b",
      goldAccent: "#d4af37",
    },
  };

  const currentColors = colors[theme];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const getLevelColor = (percentage: number) => {
    if (percentage < 50) return "#ef4444";
    if (percentage < 70) return "#f97316";
    if (percentage < 85) return "#eab308";
    return "#22c55e";
  };

  const getLevelText = (percentage: number) => {
    if (percentage < 50) return "Beginner";
    if (percentage < 70) return "Intermediate";
    if (percentage < 85) return "Advanced";
    return "Expert";
  };

  // Load ad preference and listen for ads removed event
  useEffect(() => {
    const adsRemoved = localStorage.getItem("shavy_ads_removed");
    if (adsRemoved === "true") {
      setShowAds(false);
    }
    
    const savedAdSetting = localStorage.getItem("shavy_hide_ads");
    if (savedAdSetting === "true") {
      setShowAds(false);
    }
    
    const handleAdsRemoved = () => {
      setShowAds(false);
      showToast("🛡️ Ads removed! Enjoy an ad-free experience.");
    };
    
    window.addEventListener("adsRemoved", handleAdsRemoved);
    return () => window.removeEventListener("adsRemoved", handleAdsRemoved);
  }, []);

  useEffect(() => {
    const scanned = localStorage.getItem("shavy_resumeScanned");
    if (scanned === "true") {
      const savedSkills = JSON.parse(localStorage.getItem("shavy_skills") || "[]");
      const savedDesc = localStorage.getItem("shavy_description") || "";
      const savedLevels = JSON.parse(localStorage.getItem("shavy_skill_levels") || "{}");
      if (savedSkills.length > 0) {
        setSkills(savedSkills);
        setDescription(savedDesc);
        setResumeUploaded(true);
        setExperienceLevel("Director (12+ years)");
        setTopSkills(savedSkills.slice(0, 3));
        setSuggestedRoles([
          "Director of Operations",
          "Supply Chain Director",
          "Operations Consultant"
        ]);
        setSkillLevels(savedLevels);
      }
    }
  }, []);

  const saveToLocalStorage = (newSkills: string[], newDesc: string, newLevels: Record<string, number>) => {
    localStorage.setItem("shavy_resumeScanned", "true");
    localStorage.setItem("shavy_skills", JSON.stringify(newSkills));
    localStorage.setItem("shavy_description", newDesc);
    localStorage.setItem("shavy_skill_levels", JSON.stringify(newLevels));
  };

  const handleFakeScan = (isReupload: boolean = false) => {
    setIsScanning(true);
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < 7) {
        const steps = [
          { message: "📄 Reading your resume...", progress: 10 },
          { message: "🔍 Extracting contact information...", progress: 25 },
          { message: "🛠️ Looking into skills...", progress: 40 },
          { message: "🎓 Checking education background...", progress: 55 },
          { message: "💼 Analyzing work experience...", progress: 70 },
          { message: "📊 Generating skill profile...", progress: 85 },
          { message: "✅ Finalizing your profile!", progress: 100 },
        ];
        setScanMessage(steps[stepIndex].message);
        setScanProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
        
        const newSkills = [
          "Lean Six Sigma (Black Belt)",
          "SAP S/4HANA",
          "Oracle NetSuite",
          "Microsoft Power BI",
          "Inventory Control",
          "Fleet Management",
          "Procurement & Sourcing",
          "Change Management",
          "Budgeting & Forecasting"
        ];

        const newDescription = "Operations Director with 12+ years in supply chain. Cut costs 18% across 3 plants. Led warehouse automation saving $240k annually and maintained 98% on-time delivery. Expert in Lean Six Sigma and ERP implementation.";
        
        const levels: Record<string, number> = {
          "Lean Six Sigma (Black Belt)": 95,
          "SAP S/4HANA": 88,
          "Oracle NetSuite": 72,
          "Microsoft Power BI": 68,
          "Inventory Control": 91,
          "Fleet Management": 65,
          "Procurement & Sourcing": 78,
          "Change Management": 83,
          "Budgeting & Forecasting": 87
        };
        
        setSkills(newSkills);
        setDescription(newDescription);
        setExperienceLevel("Director (12+ years)");
        setTopSkills([newSkills[0], newSkills[1], newSkills[4]]);
        setSuggestedRoles([
          "Director of Operations",
          "Supply Chain Director",
          "Operations Manager"
        ]);
        setSkillLevels(levels);
        
        setResumeUploaded(true);
        setIsScanning(false);
        setScanMessage("");
        setScanProgress(0);
        
        saveToLocalStorage(newSkills, newDescription, levels);
        showToast("✅ Resume scanned successfully!");
      }
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFakeScan(false);
    }
  };

  const handleReuploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFakeScan(true);
    }
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const updatedSkills = [...skills, newSkillName.trim()];
      const updatedLevels = { ...skillLevels, [newSkillName.trim()]: newSkillProficiency };
      setSkills(updatedSkills);
      setSkillLevels(updatedLevels);
      setTopSkills(updatedSkills.slice(0, 3));
      saveToLocalStorage(updatedSkills, description, updatedLevels);
      showToast(`✅ Added "${newSkillName}" at ${newSkillProficiency}% proficiency`);
      setNewSkillName("");
      setNewSkillProficiency(50);
      setShowAddSkill(false);
    }
  };

  const handleEditSkill = () => {
    if (editingSkill && editSkillName.trim()) {
      const updatedSkills = skills.map(s => s === editingSkill ? editSkillName.trim() : s);
      const updatedLevels = { ...skillLevels };
      delete updatedLevels[editingSkill];
      updatedLevels[editSkillName.trim()] = editSkillProficiency;
      setSkills(updatedSkills);
      setSkillLevels(updatedLevels);
      setTopSkills(updatedSkills.slice(0, 3));
      saveToLocalStorage(updatedSkills, description, updatedLevels);
      showToast(`✏️ Updated "${editingSkill}" → "${editSkillName}" at ${editSkillProficiency}%`);
      setShowEditSkill(false);
      setEditingSkill(null);
      setEditSkillName("");
      setEditSkillProficiency(50);
    }
  };

  const handleDeleteSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    const updatedLevels = { ...skillLevels };
    delete updatedLevels[skill];
    setSkills(updatedSkills);
    setSkillLevels(updatedLevels);
    setTopSkills(updatedSkills.slice(0, 3));
    saveToLocalStorage(updatedSkills, description, updatedLevels);
    showToast(`🗑️ Removed "${skill}"`);
  };

  const openEditModal = (skill: string) => {
    setEditingSkill(skill);
    setEditSkillName(skill);
    setEditSkillProficiency(skillLevels[skill] || 75);
    setShowEditSkill(true);
  };

  // Top 3 skills for collapsed view
  const topThreeSkills = skills.slice(0, 3).map(skill => ({
    name: skill,
    level: skillLevels[skill] || 75
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {toast && <div className="toast">{toast}</div>}

      {/* Resume Upload Section */}
      <div
        className="simple-card-hover"
        style={{
          backgroundColor: currentColors.cardBg,
          borderRadius: "20px",
          padding: "20px",
          border: `1px solid ${currentColors.border}`,
          textAlign: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "#d4af37";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = currentColors.border;
        }}
      >
        {!resumeUploaded && !isScanning && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "12px", animation: "pulse 2s ease-in-out infinite" }}>📄</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, marginBottom: "8px" }}>
              No resume uploaded yet
            </h3>
            <p style={{ fontSize: "13px", color: currentColors.textMuted, marginBottom: "20px" }}>
              Upload your CV to get personalized job matches and skill analysis
            </p>
            <label
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                border: "none",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "40px",
                color: "#111827",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(212, 175, 55, 0.3)",
                animation: "pulse 2s ease-in-out infinite",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 175, 55, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(212, 175, 55, 0.3)";
              }}
            >
              Upload Resume
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
            <p style={{ fontSize: "12px", color: currentColors.textMuted, marginTop: "16px" }}>
              ⚡ AI will extract skills, experience, and education
            </p>
          </>
        )}

        {isScanning && (
          <div>
            <div style={{ fontSize: "48px", marginBottom: "12px", animation: "pulse 1s infinite" }}>🤖</div>
            <p style={{ fontSize: "15px", fontWeight: "500", color: currentColors.text, marginBottom: "12px" }}>
              {scanMessage}
            </p>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: theme === "light" ? "#E5E7EB" : "#3a3a3a",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  width: `${scanProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #d4af37, #b8860b)",
                  borderRadius: "10px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", color: currentColors.textMuted, marginTop: "12px" }}>
              Please wait while we analyze your profile...
            </p>
          </div>
        )}

        {resumeUploaded && !isScanning && (
          <div>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#22c55e", marginBottom: "12px" }}>
              Resume scanned successfully!
            </p>
            <p style={{ fontSize: "12px", color: currentColors.textMuted, marginBottom: "16px" }}>
              Want to upload a different resume?
            </p>
            <label
              style={{
                display: "inline-block",
                background: "transparent",
                border: "1.5px solid #d4af37",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "40px",
                color: "#d4af37",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Upload New Resume
              <input
                id="reupload-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleReuploadFile}
                style={{ display: "none" }}
              />
            </label>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {resumeUploaded && !isScanning && (
        <>
          <div
            className="simple-card-hover"
            style={{
              backgroundColor: currentColors.cardBg,
              borderRadius: "20px",
              padding: "20px",
              border: `1px solid ${currentColors.border}`,
              cursor: "pointer",
            }}
            onClick={() => setSkillsExpanded(!skillsExpanded)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#d4af37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = currentColors.border;
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: currentColors.text, margin: 0 }}>
                🛠️ Skills & Proficiency
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddSkill(true);
                  }}
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8860b)",
                    border: "none",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#111827",
                    cursor: "pointer",
                    marginTop: 0,
                  }}
                >
                  + Add
                </button>
                <span style={{ fontSize: "12px", color: currentColors.textMuted }}>
                  {skillsExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {!skillsExpanded && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {topThreeSkills.map((skill, idx) => {
                  const level = skill.level;
                  return (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: currentColors.text }}>{skill.name}</span>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: getLevelColor(level) }}>{level}%</span>
                      </div>
                      <div style={{ height: "6px", backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                        <div style={{ width: `${level}%`, height: "100%", backgroundColor: getLevelColor(level), borderRadius: "10px" }} />
                      </div>
                    </div>
                  );
                })}
                {skills.length > 3 && (
                  <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: currentColors.textMuted }}>
                    +{skills.length - 3} more skills (tap to expand)
                  </div>
                )}
              </div>
            )}

            {skillsExpanded && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {skills.map((skill, idx) => {
                    const level = skillLevels[skill] || 75;
                    return (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "500", color: currentColors.text }}>{skill}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "10px", color: getLevelColor(level) }}>{getLevelText(level)}</span>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: getLevelColor(level) }}>{level}%</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(skill);
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                fontSize: "12px",
                                cursor: "pointer",
                                color: "#d4af37",
                                padding: "2px",
                                marginTop: 0,
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkill(skill);
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                fontSize: "14px",
                                cursor: "pointer",
                                color: "#ef4444",
                                padding: "2px",
                                marginTop: 0,
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div style={{ height: "6px", backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ width: `${level}%`, height: "100%", backgroundColor: getLevelColor(level), borderRadius: "10px" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Add Skill Modal */}
          {showAddSkill && (
            <>
              <div
                onClick={() => setShowAddSkill(false)}
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
                  width: "280px",
                  maxWidth: "calc(100% - 40px)",
                  backgroundColor: currentColors.cardBg,
                  borderRadius: "20px",
                  padding: "20px",
                  zIndex: 101,
                  border: `1px solid ${currentColors.border}`,
                  boxSizing: "border-box",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, marginBottom: "16px" }}>
                  Add New Skill
                </h3>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${currentColors.border}`,
                    backgroundColor: currentColors.cardBg,
                    color: currentColors.text,
                    marginBottom: "16px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: currentColors.textMuted, marginBottom: "8px", display: "block" }}>
                    Proficiency: {newSkillProficiency}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(parseInt(e.target.value))}
                    style={{ width: "100%", margin: "0" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleAddSkill}
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
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: `1px solid ${currentColors.border}`,
                      padding: "10px",
                      borderRadius: "40px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: currentColors.textMuted,
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

          {/* Edit Skill Modal */}
          {showEditSkill && editingSkill && (
            <>
              <div
                onClick={() => setShowEditSkill(false)}
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
                  width: "280px",
                  maxWidth: "calc(100% - 40px)",
                  backgroundColor: currentColors.cardBg,
                  borderRadius: "20px",
                  padding: "20px",
                  zIndex: 101,
                  border: `1px solid ${currentColors.border}`,
                  boxSizing: "border-box",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, marginBottom: "16px" }}>
                  Edit Skill
                </h3>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={editSkillName}
                  onChange={(e) => setEditSkillName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${currentColors.border}`,
                    backgroundColor: currentColors.cardBg,
                    color: currentColors.text,
                    marginBottom: "16px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: currentColors.textMuted, marginBottom: "8px", display: "block" }}>
                    Proficiency: {editSkillProficiency}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={editSkillProficiency}
                    onChange={(e) => setEditSkillProficiency(parseInt(e.target.value))}
                    style={{ width: "100%", margin: "0" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleEditSkill}
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
                    onClick={() => setShowEditSkill(false)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: `1px solid ${currentColors.border}`,
                      padding: "10px",
                      borderRadius: "40px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: currentColors.textMuted,
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

          {/* Profile Summary */}
          <div
            className="simple-card-hover"
            style={{
              backgroundColor: currentColors.cardBg,
              borderRadius: "20px",
              padding: "20px",
              border: `1px solid ${currentColors.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#d4af37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = currentColors.border;
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: currentColors.text, marginBottom: "12px" }}>
              📊 Profile Summary
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "13px", color: currentColors.textMuted }}>Experience Level:</span>
                <p style={{ fontSize: "15px", fontWeight: "500", color: currentColors.text, marginTop: "4px" }}>{experienceLevel}</p>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: currentColors.textMuted }}>Top Skills:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {topSkills.map((skill, idx) => (
                    <span key={idx} style={{ background: "rgba(212, 175, 55, 0.2)", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "500", color: "#d4af37" }}>{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: currentColors.textMuted }}>Suggested Roles:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {suggestedRoles.map((role, idx) => (
                    <span key={idx} style={{ background: theme === "light" ? "#f3f4f6" : "#3a3a3a", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", color: currentColors.text }}>{role}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div
            className="simple-card-hover"
            style={{
              backgroundColor: currentColors.cardBg,
              borderRadius: "20px",
              padding: "20px",
              border: `1px solid ${currentColors.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#d4af37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = currentColors.border;
            }}
          >
            <div onClick={() => setShowDescription(!showDescription)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: currentColors.text }}>📝 Professional Summary</h3>
              <span style={{ fontSize: "18px", color: currentColors.textMuted }}>{showDescription ? "▲" : "▼"}</span>
            </div>
            {showDescription && <p style={{ fontSize: "14px", color: currentColors.textMuted, marginTop: "16px", lineHeight: "1.5" }}>{description}</p>}
          </div>

          {/* Courses CTA */}
          <div
            onClick={() => window.dispatchEvent(new CustomEvent("navigateToCourses"))}
            className="simple-card-hover"
            style={{
              backgroundColor: currentColors.cardBg,
              borderRadius: "20px",
              padding: "20px",
              border: `1px solid ${currentColors.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#d4af37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = currentColors.border;
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "12px" }}><span style={{ fontSize: "32px" }}>📚</span></div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: currentColors.text, textAlign: "center", marginBottom: "8px" }}>Want to make this resume even better?</h3>
            <p style={{ fontSize: "12px", color: currentColors.textMuted, textAlign: "center", marginBottom: "16px" }}>Try our courses — Beginner (Free), Intermediate ($20), Advanced ($40)</p>
            <div style={{ textAlign: "center" }}><span style={{ fontSize: "14px", color: "#d4af37", fontWeight: "500" }}>Browse Courses →</span></div>
          </div>

          {/* Ad Banner - only shows if showAds is true */}
          {showAds && (
            <div
              style={{
                backgroundColor: theme === "light" ? "#fef9e8" : "#2A2622",
                borderRadius: "12px",
                padding: "12px 16px",
                border: `1px solid ${theme === "light" ? "#fde68a" : "#3a3a3a"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>📢</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: currentColors.text }}>Sponsored</div>
                  <div style={{ fontSize: "11px", color: currentColors.textMuted }}>Master supply chain — Course on sale!</div>
                </div>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("openAdSettings"))}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: currentColors.textMuted,
                }}
              >
                ⋯
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
      `}</style>
    </div>
  );
}