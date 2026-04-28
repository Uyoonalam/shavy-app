"use client";

import { useState } from "react";

export default function SignUpUI({ setScreen, theme }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSignUp = () => {
    // Validate all fields are filled
    if (!fullName.trim()) {
      showToast("⚠️ Please enter your full name");
      return;
    }
    if (!email.trim()) {
      showToast("⚠️ Please enter your email");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      showToast("⚠️ Please enter a valid email address");
      return;
    }
    if (!password) {
      showToast("⚠️ Please enter a password");
      return;
    }
    if (password.length < 4) {
      showToast("⚠️ Password must be at least 4 characters");
      return;
    }

    // Validate PIN (optional but must match if provided)
    if (pin || confirmPin) {
      if (pin !== confirmPin) {
        showToast("⚠️ PINs do not match");
        return;
      }
      if (pin.length < 4) {
        showToast("⚠️ PIN must be at least 4 digits");
        return;
      }
      localStorage.setItem("shavy_vault_pin", pin);
    }

    // Save user info
    localStorage.setItem("shavy_user_name", fullName);
    localStorage.setItem("shavy_user_email", email);
    localStorage.setItem("shavy_user_password", password);
    
    showToast("✅ Account created successfully!");
    setTimeout(() => setScreen("app"), 1000);
  };

  const fillDemoCredentials = () => {
    setFullName("Admin User");
    setEmail("123@g.com");
    setPassword("6969");
    setPin("1010");
    setConfirmPin("1010");
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
        padding: "40px 24px",
        position: "relative",
        background: theme === "dark" 
          ? "linear-gradient(145deg, #1a1f2e 0%, #0f1118 100%)"
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
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
          Create Account
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
          Join Shavy to find trusted companies
        </p>
      </div>

      {/* Form */}
      <div style={{ width: "100%", maxWidth: "320px" }}>
        <input
          placeholder="Full Name *"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "16px",
            border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#fefefe" : "#1f2937",
            fontSize: "15px",
            marginBottom: "16px",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#d4af37";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme === "dark" ? "#374151" : "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
        <input
          placeholder="Email *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "16px",
            border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#fefefe" : "#1f2937",
            fontSize: "15px",
            marginBottom: "16px",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#d4af37";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme === "dark" ? "#374151" : "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />
        <input
          placeholder="Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "16px",
            border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#fefefe" : "#1f2937",
            fontSize: "15px",
            marginBottom: "16px",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#d4af37";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme === "dark" ? "#374151" : "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Vault PIN Setup */}
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            placeholder="Set Vault PIN (4-6 digits, optional)"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "16px",
              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1f2937",
              fontSize: "15px",
              marginBottom: "12px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Confirm Vault PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "16px",
              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1f2937",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <p style={{
          fontSize: "10px",
          color: theme === "dark" ? "#6b7280" : "#9ca3af",
          textAlign: "center",
          marginBottom: "8px",
        }}>
          💡 Quick demo: Click "⚡ Demo Fill" (Email: 123@g.com, Password: 6969, PIN: 1010)
        </p>

        <button
          onClick={handleSignUp}
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
            animation: "sweepingBorderGlow 10s linear infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Sign Up
        </button>

        <p style={{
          textAlign: "center",
          fontSize: "13px",
          color: theme === "dark" ? "#9ca3af" : "#6b7280",
          marginTop: "24px",
        }}>
          Already have an account?{" "}
          <span
            onClick={() => setScreen("signin")}
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
            Sign In
          </span>
        </p>
      </div>
    </main>
  );
}