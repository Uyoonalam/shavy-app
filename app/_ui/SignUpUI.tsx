"use client";

import { useState } from "react";

export default function SignUpUI({ setScreen, theme }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

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

  // Validate PIN - MANDATORY
  if (!pin || !confirmPin) {
    showToast("⚠️ Please set a 4-digit Vault PIN");
    return;
  }
  if (pin !== confirmPin) {
    showToast("⚠️ PINs do not match");
    return;
  }
  if (pin.length !== 4) {
    showToast("⚠️ PIN must be exactly 4 digits");
    return;
  }
  
  // SAVE PIN TO LOCALSTORAGE - MAKE SURE THIS LINE EXISTS
  localStorage.setItem("shavy_vault_pin", pin);
  console.log("PIN saved:", pin);  // Debug log

  // Save user info
  localStorage.setItem("shavy_user_name", fullName);
  localStorage.setItem("shavy_user_email", email);
  localStorage.setItem("shavy_user_password", password);
  
  showToast("✅ Account created successfully!");
  setTimeout(() => setScreen("app"), 1000);
};

  const fillDemoCredentials = () => {
  setFullName("Demo User");
  setEmail("demo@shavy.com");
  setPassword("demo123");
  setPin("1111");
  setConfirmPin("1111");
  localStorage.setItem("shavy_vault_pin", "1111");  // Add this line
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
              : "linear-gradient(135deg, #1F1C18 0%, #b8860b 100%)",
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
            background: theme === "dark" ? "#1F170F" : "#ffffff",
            color: theme === "dark" ? "#fefefe" : "#1F170F",
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
            background: theme === "dark" ? "#1F170F" : "#ffffff",
            color: theme === "dark" ? "#fefefe" : "#1F170F",
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
        
        {/* Password with Show/Hide */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 18px",
              paddingRight: "45px",
              borderRadius: "16px",
              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              background: theme === "dark" ? "#1F170F" : "#ffffff",
              color: theme === "dark" ? "#fefefe" : "#1F170F",
              fontSize: "15px",
              outline: "none",
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
            }}
          >
            {showPassword ? "👁️" : "🔒"}
          </button>
        </div>

        {/* Vault PIN Setup */}
        <div style={{ marginBottom: "16px" }}>
          {/* Set PIN */}
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <input
              type={showPin ? "text" : "password"}
              placeholder="Set Your 4 Digit Vault PIN *"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              style={{
                width: "100%",
                padding: "14px 18px",
                paddingRight: "45px",
                borderRadius: "16px",
                border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                background: theme === "dark" ? "#1F170F" : "#ffffff",
                color: theme === "dark" ? "#fefefe" : "#1F170F",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
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
              }}
            >
              {showPin ? "👁️" : "🔒"}
            </button>
          </div>

          {/* Confirm PIN */}
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPin ? "text" : "password"}
              placeholder="Confirm Vault PIN *"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              style={{
                width: "100%",
                padding: "14px 18px",
                paddingRight: "45px",
                borderRadius: "16px",
                border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                background: theme === "dark" ? "#1F170F" : "#ffffff",
                color: theme === "dark" ? "#fefefe" : "#1F170F",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
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
              }}
            >
              {showConfirmPin ? "👁️" : "🔒"}
            </button>
          </div>
        </div>

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