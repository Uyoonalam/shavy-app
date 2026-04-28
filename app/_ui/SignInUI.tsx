"use client";

import { useState } from "react";

export default function SignInUI({ setScreen, theme }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSignIn = () => {
  // Demo credentials check
  if (email === "demo@shavy.com" && password === "demo123") {
    localStorage.setItem("shavy_user_email", email);
    localStorage.setItem("shavy_user_password", password);
    // PIN is already set from signup, no need to set again
    showToast("✅ Welcome back!");
    setTimeout(() => setScreen("app"), 500);
    return;
  }
  
  // Regular validation
  const savedEmail = localStorage.getItem("shavy_user_email");
  const savedPassword = localStorage.getItem("shavy_user_password");
  
  if (!email || !password) {
    showToast("⚠️ Please enter email and password");
    return;
  }
  
  if (email === savedEmail && password === savedPassword) {
    // PIN is already in localStorage from signup
    // No need to do anything with PIN here
    showToast("✅ Login successful!");
    setTimeout(() => setScreen("app"), 500);
  } else {
    showToast("❌ Invalid email or password");
  }
};

  const fillDemoCredentials = () => {
    setEmail("demo@shavy.com");
    setPassword("demo123");
    showToast("✅ Demo credentials loaded!");
  };

  return (
    <main 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "20px 24px",
        position: "relative",
        background: theme === "dark" 
          ? "linear-gradient(145deg, #1a1918 0%, #29241d 100%)"
          : "linear-gradient(145deg, #fefcf5 0%, #fff9e8 100%)",
      }}
    >
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff",
          color: "#d4af37",
          padding: "12px 20px",
          borderRadius: "40px",
          fontSize: "13px",
          fontWeight: "500",
          zIndex: 200,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: `1px solid ${theme === "dark" ? "#3a3a3a" : "#e5e7eb"}`,
        }}>
          {toast}
        </div>
      )}

      {/* Demo Quick-Fill Button */}
      <button
        onClick={fillDemoCredentials}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(212, 175, 55, 0.15)",
          border: "1px solid #d4af37",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "11px",
          fontWeight: "500",
          color: "#d4af37",
          cursor: "pointer",
          zIndex: 20,
        }}
      >
        ⚡ Demo Fill
      </button>

      <div
        onClick={() => setScreen("getstarted")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
          color: theme === "dark" ? "#9ca3af" : "#6b7280",
          transition: "color 0.2s ease, transform 0.2s ease",
          zIndex: 10,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "transparent",
          display: "inline-block",
          lineHeight: "normal",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#d4af37";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme === "dark" ? "#9ca3af" : "#6b7280";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        ← Back
      </div>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 
          key={`title-${theme}`}
          style={{
            fontSize: "32px",
            fontWeight: "800",
            letterSpacing: "-1px",
            background: theme === "dark"
              ? "linear-gradient(135deg, #fefefe 0%, #d4af37 100%)"
              : "linear-gradient(135deg, #1F170F 0%, #b8860b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "4px",
          }}
        >
          Welcome Back
        </h1>
        <p 
          key={`subtitle-${theme}`}
          style={{
            fontSize: "13px",
            background: theme === "dark"
              ? "linear-gradient(135deg, #9ca3af 0%, #d4af37 70%)"
              : "linear-gradient(135deg, #6b7280 0%, #b8860b 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Sign in to continue
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: theme === "dark" ? "#d1d5db" : "#4b5563", marginBottom: "6px" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "14px",
              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              background: theme === "dark" ? "#1F170F" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1F170F",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ position: "relative", marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: theme === "dark" ? "#d1d5db" : "#4b5563", marginBottom: "6px" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                paddingRight: "45px",
                borderRadius: "14px",
                border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                background: theme === "dark" ? "#1F170F" : "#ffffff",
                color: theme === "dark" ? "#fefefe" : "#1F170F",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: theme === "dark" ? "#94a3b8" : "#64748b",
                padding: "4px",
              }}
            >
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          style={{
            width: "100%",
            background: "transparent",
            border: "2px solid rgb(212, 175, 55)",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "700",
            borderRadius: "60px",
            color: theme === "dark" ? "#d4af37" : "#b8860b",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            marginTop: "8px",
            backgroundImage: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), rgba(212,175,55,0.8), rgba(212,175,55,0.4), transparent)",
            backgroundSize: "200% 100%",
            backgroundRepeat: "no-repeat",
            animation: "sweepingBorderGlow 10s linear infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Sign In →
        </button>

        <p style={{
          textAlign: "center",
          fontSize: "12px",
          color: theme === "dark" ? "#9ca3af" : "#6b7280",
          marginTop: "20px",
        }}>
          Don't have an account?{" "}
          <span
            onClick={() => setScreen("signup")}
            style={{
              color: "#d4af37",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(2px)";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Sign up →
          </span>
        </p>
      </div>
    </main>
  );
}