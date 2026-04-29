"use client";

import { useState, useEffect } from "react";

interface CoursesUIProps {
  theme: "dark" | "light";
  onBack: () => void;
  onPayment: (courseTitle: string, amount: number) => void;
}

export default function CoursesUI({ theme, onBack, onPayment }: CoursesUIProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  // Load from localStorage and close expanded if enrolled
  useEffect(() => {
    const saved = localStorage.getItem("shavy_enrolled_courses");
    if (saved) {
      const enrolled = JSON.parse(saved);
      setEnrolledCourses(enrolled);
      setExpandedCourse(prev => (prev !== null && enrolled.includes(prev) ? null : prev));
    }
  }, []);

  // Listen for refresh events (after payment)
  useEffect(() => {
    const handleRefresh = () => {
      const saved = localStorage.getItem("shavy_enrolled_courses");
      if (saved) {
        const enrolled = JSON.parse(saved);
        setEnrolledCourses(enrolled);
        setExpandedCourse(prev => (prev !== null && enrolled.includes(prev) ? null : prev));
      }
    };
    window.addEventListener("refreshEnrolledCourses", handleRefresh);
    return () => window.removeEventListener("refreshEnrolledCourses", handleRefresh);
  }, []);

  const saveEnrolledCourses = (courses: number[]) => {
    localStorage.setItem("shavy_enrolled_courses", JSON.stringify(courses));
    setEnrolledCourses(courses);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const darkColors = {
    bg: "#1F1C18",
    cardBg: "#2A2622",
    border: "#3a3a3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    hoverBg: "#3a3a3a",
    instructorBg: "#322c25",
  };

  const lightColors = {
    bg: "#f8fafc",
    cardBg: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    hoverBg: "#f1f5f9",
    instructorBg: "#f1f5f9",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  const courses = [
    { id: 0, level: "Beginner", price: "Free", priceValue: 0, title: "Resume Writing Masterclass", shortDesc: "Learn to craft compelling resumes that get noticed.", fullDesc: "Master the art of resume writing with proven templates and strategies.", duration: "1 hour", instructor: "Sarah Chen", qualification: "Career Coach, ex-Google Recruiter", icon: "🎓" },
    { id: 1, level: "Beginner", price: "Free", priceValue: 0, title: "Job Search Fundamentals", shortDesc: "Build a strategic job search framework.", fullDesc: "Learn how to identify target companies and track applications.", duration: "1.5 hours", instructor: "Marcus Thompson", qualification: "Career Strategist", icon: "🎓" },
    { id: 2, level: "Beginner", price: "Free", priceValue: 0, title: "Interview Preparation 101", shortDesc: "Master common interview questions.", fullDesc: "Behavioral interview techniques and STAR method mastery.", duration: "2 hours", instructor: "Dr. Emily Rodriguez", qualification: "HR Psychology Specialist", icon: "🎓" },
    { id: 3, level: "Intermediate", price: "$20", priceValue: 20, title: "Advanced Negotiation Masterclass", shortDesc: "Master salary negotiation.", fullDesc: "Learn proven negotiation tactics for job offers.", duration: "3 hours", instructor: "David Kim", qualification: "Negotiation Expert", icon: "⭐" },
    { id: 4, level: "Intermediate", price: "$20", priceValue: 20, title: "Professional Identity Development", shortDesc: "Build your brand and stand out.", fullDesc: "Develop your unique value proposition.", duration: "2.5 hours", instructor: "Jessica Wu", qualification: "Brand Strategist", icon: "⭐" },
    { id: 5, level: "Intermediate", price: "$20", priceValue: 20, title: "Networking & Relationship Building", shortDesc: "Learn proven networking strategies.", fullDesc: "Build meaningful professional relationships.", duration: "2 hours", instructor: "Michael Brooks", qualification: "Networking Coach", icon: "⭐" },
    { id: 6, level: "Advanced", price: "$40", priceValue: 40, title: "Strategic Leadership Masterclass", shortDesc: "Develop executive presence.", fullDesc: "Emotional intelligence and delegation strategies.", duration: "5 hours", instructor: "Dr. Angela Hayes", qualification: "Leadership Psychologist", icon: "👑" },
    { id: 7, level: "Advanced", price: "$40", priceValue: 40, title: "Strategic Career Planning", shortDesc: "Map out your career roadmap.", fullDesc: "Define your career vision and skill gaps.", duration: "4 hours", instructor: "Robert Vance", qualification: "Executive Coach", icon: "👑" },
    { id: 8, level: "Advanced", price: "$40", priceValue: 40, title: "Executive Communication", shortDesc: "Master persuasive communication.", fullDesc: "Boardroom presentations and stakeholder management.", duration: "3.5 hours", instructor: "Patricia Chen", qualification: "Communications Director", icon: "👑" },
  ];

 const handleEnroll = (course: any) => {
  if (course.priceValue === 0) {
    const newEnrolled = [...enrolledCourses, course.id];
    saveEnrolledCourses(newEnrolled);
    setExpandedCourse(null);
    showToast(`✅ Enrolled in "${course.title}" — Free`);
  } else {
    onPayment(course.title, course.priceValue);
  }
};

  const toggleExpand = (id: number) => {
    if (enrolledCourses.includes(id)) return;
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "#22c55e";
      case "Intermediate": return "#d4af37";
      case "Advanced": return "#f97316";
      default: return "#6b7280";
    }
  };

  const isEnrolled = (id: number) => enrolledCourses.includes(id);

  return (
    <div style={{ 
      minHeight: "100%", 
      paddingBottom: "32px",
      paddingLeft: "16px",
      paddingRight: "16px",
      backgroundColor: c.bg,
    }}>
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: theme === "dark" ? c.cardBg : "#ffffff",
          color: theme === "dark" ? "#d4af37" : "#b8860b",
          padding: "12px 20px",
          borderRadius: "40px",
          fontSize: "13px",
          fontWeight: "500",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: `1px solid ${c.border}`,
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}

      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          padding: "8px 0",
          marginTop: "8px",
          marginBottom: "24px",
          transition: "color 0.2s ease, transform 0.2s ease",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#d4af37";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme === "dark" ? "#94a3b8" : "#64748b";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: c.text, marginBottom: "8px" }}>📚 Courses</h1>
        <p style={{ fontSize: "13px", color: c.textMuted }}>Level up your career with expert-led courses</p>
      </div>

      {["Beginner", "Intermediate", "Advanced"].map((level) => {
        const levelCourses = courses.filter(c => c.level === level);
        const levelColor = getLevelColor(level);
        
        return (
          <div key={level} style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: levelColor }} />
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text, margin: 0 }}>{level}</h3>
              <span style={{ fontSize: "12px", color: c.textMuted }}>
                {level === "Beginner" ? "Free" : level === "Intermediate" ? "$20 each" : "$40 each"}
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {levelCourses.map((course) => {
                const enrolled = isEnrolled(course.id);
                return (
                  <div key={course.id} style={{ backgroundColor: c.cardBg, borderRadius: "20px", border: `1px solid ${c.border}`, overflow: "hidden", transition: "all 0.2s ease" }}>
                    <div onClick={() => toggleExpand(course.id)} style={{ padding: "18px", cursor: enrolled ? "default" : "pointer", transition: "background 0.2s ease", opacity: enrolled ? 0.7 : 1 }}
                      onMouseEnter={(e) => { if (!enrolled) e.currentTarget.style.backgroundColor = c.hoverBg; }}
                      onMouseLeave={(e) => { if (!enrolled) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "32px" }}>{course.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "17px", fontWeight: "600", color: c.text }}>{course.title}</span>
                            <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "12px", backgroundColor: getLevelColor(course.level), color: "#fff", fontWeight: "500" }}>{course.level}</span>
                          </div>
                          <p style={{ fontSize: "13px", color: c.textMuted, marginBottom: "10px", lineHeight: "1.4" }}>{course.shortDesc}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <span style={{ fontSize: "11px", color: c.textMuted }}>⏱️ {course.duration}</span>
  {enrolled ? <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "500" }}>✅ Enrolled</span> : <span style={{ fontSize: "12px", color: "#d4af37", fontWeight: "500" }}></span>}
</div>
                        </div>
                      </div>
                    </div>

                    {!enrolled && expandedCourse === course.id && (
  <div style={{ padding: "0 18px 18px 18px", borderTop: `0px solid ${c.border}`, backgroundColor: c.cardBg }}>
                        <div style={{ marginBottom: "16px", marginTop: "16px" }}>
                          <p style={{ fontSize: "13px", color: c.textMuted, lineHeight: "1.5", margin: 0 }}>{course.fullDesc}</p>
                        </div>
                        <div style={{ backgroundColor: c.instructorBg, borderRadius: "12px", padding: "12px", marginBottom: "16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: c.text, marginBottom: "4px" }}>👨‍🏫 {course.instructor}</div>
                          <div style={{ fontSize: "11px", color: c.textMuted }}>{course.qualification}</div>
                        </div>
                        <button onClick={() => handleEnroll(course)} style={{ width: "100%", background: course.priceValue === 0 ? "transparent" : "linear-gradient(135deg, #d4af37, #b8860b)", border: course.priceValue === 0 ? "1.5px solid #d4af37" : "none", padding: "12px", borderRadius: "40px", fontSize: "14px", fontWeight: "600", color: course.priceValue === 0 ? "#d4af37" : "#111827", cursor: "pointer", transition: "all 0.2s ease", marginTop: "4px" }}
                          onMouseEnter={(e) => { if (course.priceValue === 0) e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)"; else e.currentTarget.style.transform = "scale(1.01)"; }}
                          onMouseLeave={(e) => { if (course.priceValue === 0) e.currentTarget.style.background = "transparent"; else e.currentTarget.style.transform = "scale(1)"; }}
                        >{course.price === "Free" ? "Enroll Now — Free" : `Enroll Now — ${course.price}`}</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}