"use client";

import { useState } from "react";

interface OnboardingTourProps {
  theme: "dark" | "light";
  onComplete: () => void;
}

export default function OnboardingTour({ theme, onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { title: "📄 Upload Your Resume", message: "Start by uploading your CV. Our AI will extract your skills, experience, and education automatically.", emoji: "📄" },
    { title: "🛠️ Manage Your Skills", message: "View, add, edit, or delete your skills. Set proficiency levels from Beginner to Expert to track your growth.", emoji: "🛠️" },
    { title: "📊 Profile Summary", message: "See your experience level, top skills, and suggested job roles based on your resume.", emoji: "📊" },
    { title: "📝 Professional Summary", message: "View and edit your professional summary - the AI generates this from your resume.", emoji: "📝" },
    { title: "🔍 Audit Companies", message: "Research companies before applying. See trust scores, controversies, financial health, and ex-employee reviews.", emoji: "🔍" },
    { title: "📈 Trust Score Trends", message: "Track how company trust scores change over 12 months. Green means improving, red means declining.", emoji: "📈" },
    { title: "📚 Free Courses", message: "Level up with our courses - Beginner (Free), Intermediate ($20), Advanced ($40). Paid courses give you certificates.", emoji: "📚" },
  ];

  const colors = theme === "dark" 
    ? { cardBg: "#2A2622", border: "#3a3a3a", text: "#e2e8f0", textMuted: "#94a3b8", gold: "#d4af37" }
    : { cardBg: "#ffffff", border: "#e2e8f0", text: "#0f172a", textMuted: "#64748b", gold: "#b8860b" };

  const handleNext = () => {
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      backdropFilter: "none",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: colors.cardBg,
        borderRadius: "28px",
        padding: "28px 24px",
        width: "300px",
        maxWidth: "calc(100% - 40px)",
        textAlign: "center",
        border: `2px solid ${colors.gold}`,
        animation: "bounceIn 0.3s ease-out",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>
          {steps[step].emoji}
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.gold, marginBottom: "10px" }}>
          {steps[step].title}
        </h3>
        <p style={{ fontSize: "13px", color: colors.textMuted, marginBottom: "24px", lineHeight: "1.5" }}>
          {steps[step].message}
        </p>
        
        {/* Progress indicator */}
        <div style={{
          width: "100%",
          height: "4px",
          backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
          borderRadius: "10px",
          marginBottom: "20px",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${((step + 1) / steps.length) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #d4af37, #b8860b)",
            borderRadius: "10px",
            transition: "width 0.3s ease",
          }} />
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleNext}
            style={{
              flex: 2,
              background: "linear-gradient(135deg, #d4af37, #b8860b)",
              border: "none",
              padding: "12px",
              borderRadius: "40px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {step + 1 === steps.length ? "🎉 Get Started" : "Next →"}
          </button>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              background: "transparent",
              border: `1px solid ${colors.border}`,
              padding: "12px",
              borderRadius: "40px",
              fontSize: "13px",
              fontWeight: "500",
              color: colors.textMuted,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.gold;
              e.currentTarget.style.color = colors.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = colors.textMuted;
            }}
          >
            Skip
          </button>
        </div>
        
        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "16px", flexWrap: "wrap" }}>
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setStep(idx)}
              style={{
                width: idx === step ? "8px" : "6px",
                height: idx === step ? "8px" : "6px",
                borderRadius: "50%",
                backgroundColor: idx === step ? colors.gold : colors.textMuted,
                opacity: idx === step ? 1 : 0.4,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}