"use client";

import { useState } from "react";

export default function SignInUI({ setScreen, theme }: any) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <main 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "40px 24px",
        position: "relative",
        background: theme === "dark" 
          ? "linear-gradient(145deg, #1a1f2e 0%, #0f1118 100%)"
          : "linear-gradient(145deg, #fefcf5 0%, #fff9e8 100%)",
      }}
    >
      {/* Back button */}
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

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 
          key={`title-${theme}`}
          style={{
            fontSize: "32px",
            fontWeight: "800",
            letterSpacing: "-1px",
            background: theme === "dark"
              ? "linear-gradient(135deg, #fefefe 0%, #d4af37 100%)"
              : "linear-gradient(135deg, #1f2937 0%, #b8860b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
          }}
        >
          Welcome Back
        </h1>
        <p 
          key={`subtitle-${theme}`}
          style={{
            fontSize: "14px",
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

      {/* Form */}
      <div style={{ width: "100%", maxWidth: "320px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "500",
            color: theme === "dark" ? "#d1d5db" : "#4b5563",
            marginBottom: "8px",
          }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "16px",
              border: `1px solid ${emailFocused ? "#d4af37" : (theme === "dark" ? "#374151" : "#e5e7eb")}`,
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1f2937",
              fontSize: "15px",
              transition: "all 0.2s",
              outline: "none",
              boxShadow: emailFocused ? "0 0 0 3px rgba(212,175,55,0.1)" : "none",
              boxSizing: "border-box",
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "500",
            color: theme === "dark" ? "#d1d5db" : "#4b5563",
            marginBottom: "8px",
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "16px",
              border: `1px solid ${passwordFocused ? "#d4af37" : (theme === "dark" ? "#374151" : "#e5e7eb")}`,
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1f2937",
              fontSize: "15px",
              transition: "all 0.2s",
              outline: "none",
              boxShadow: passwordFocused ? "0 0 0 3px rgba(212,175,55,0.1)" : "none",
              boxSizing: "border-box",
            }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </div>

        {/* Sign In Button */}
        <button
  onClick={() => setScreen("app")}  // or "app" for SignIn/SignUp
  style={{
    width: "100%",
    maxWidth: "320px",
    background: "transparent",
    border: "2px solid rgb(212, 175, 55)",
    padding: "16px",
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
    backgroundPosition: "0% 50%",
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
          fontSize: "13px",
          color: theme === "dark" ? "#9ca3af" : "#6b7280",
          marginTop: "24px",
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