"use client";

import { useState } from "react";

interface VaultPINModalProps {
  theme: "dark" | "light";
  onSuccess: () => void;
  onClose: () => void;
}

export default function VaultPINModal({ theme, onSuccess, onClose }: VaultPINModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [isShaking, setIsShaking] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  const colors = {
    dark: {
      bg: "#1e293b",
      cardBg: "#2a2a2a",
      border: "#3a3a3a",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
      error: "#ef4444",
    },
    light: {
      bg: "#ffffff",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      textMuted: "#64748b",
      error: "#ef4444",
    },
  };

  const c = colors[theme];

  const handleSubmit = () => {
    if (attempts <= 0) {
      setError("Too many failed attempts. Redirecting to sign in...");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("forceLogout"));
        onClose();
      }, 1500);
      return;
    }

    const savedPin = localStorage.getItem("shavy_vault_pin");
    if (pin === savedPin) {
      onSuccess();
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts > 0) {
        setError(`Wrong PIN. ${newAttempts} attempt${newAttempts !== 1 ? 's' : ''} remaining.`);
      } else {
        setError(`Wrong PIN. No attempts left. Redirecting to sign in...`);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("forceLogout"));
          onClose();
        }, 1500);
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin("");
    }
  };

  const handleForgotSubmit = () => {
    if (supportEmail) {
      setSupportSent(true);
      setTimeout(() => {
        setShowForgot(false);
        setSupportSent(false);
        setSupportEmail("");
      }, 2000);
    }
  };

  if (showForgot) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: c.cardBg,
            borderRadius: "24px",
            padding: "28px",
            width: "300px",
            maxWidth: "calc(100% - 40px)",
            border: `1px solid ${c.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🆘</div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: c.text, marginBottom: "8px" }}>
            Forgot PIN?
          </h3>
          {!supportSent ? (
            <>
              <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "20px" }}>
                Enter your email address. We'll send a one-time verification key.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: `1px solid ${c.border}`,
                  backgroundColor: c.bg,
                  color: c.text,
                  fontSize: "14px",
                  marginBottom: "16px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={handleForgotSubmit}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #d4af37, #b8860b)",
                  border: "none",
                  padding: "12px",
                  borderRadius: "40px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer",
                  marginTop: 0,
                  marginBottom: "12px",
                }}
              >
                Send Recovery Email
              </button>
            </>
          ) : (
            <div style={{ padding: "20px" }}>
              <p style={{ fontSize: "14px", color: "#22c55e", marginBottom: "16px" }}>
                ✅ Recovery email sent to {supportEmail}
              </p>
              <p style={{ fontSize: "12px", color: c.textMuted }}>
                Check your inbox for the one-time pass key.
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setShowForgot(false);
              setSupportSent(false);
              setSupportEmail("");
            }}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "10px",
              fontSize: "13px",
              color: c.textMuted,
              cursor: "pointer",
              marginTop: 0,
            }}
          >
            Back to PIN entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: c.cardBg,
          borderRadius: "24px",
          padding: "28px",
          width: "300px",
          maxWidth: "calc(100% - 40px)",
          border: `1px solid ${c.border}`,
          textAlign: "center",
          animation: isShaking ? "shake 0.2s ease-in-out 0s 2" : "none",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔐</div>
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: c.text, marginBottom: "8px" }}>
          Enter Vault PIN
        </h3>
        <p style={{ fontSize: "12px", color: c.textMuted, marginBottom: "20px" }}>
          {attempts > 0 
            ? `Your vault is locked. Enter your PIN (${attempts} attempt${attempts !== 1 ? 's' : ''} remaining).`
            : "No attempts remaining. Please reset your PIN."}
        </p>
        
        <input
          type="password"
          placeholder="Enter 4-6 digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
          disabled={attempts <= 0}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: `1px solid ${error ? c.error : c.border}`,
            backgroundColor: c.bg,
            color: c.text,
            fontSize: "16px",
            textAlign: "center",
            letterSpacing: "4px",
            marginBottom: "16px",
            boxSizing: "border-box",
            opacity: attempts <= 0 ? 0.5 : 1,
          }}
        />
        
        {error && (
          <p style={{ fontSize: "12px", color: c.error, marginBottom: "16px" }}>
            {error}
          </p>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={attempts <= 0}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #d4af37, #b8860b)",
            border: "none",
            padding: "12px",
            borderRadius: "40px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
            cursor: attempts <= 0 ? "not-allowed" : "pointer",
            opacity: attempts <= 0 ? 0.5 : 1,
            marginTop: 0,
            marginBottom: "12px",
          }}
        >
          Unlock Vault
        </button>
        
        {attempts > 0 && (
          <button
            onClick={() => setShowForgot(true)}
            style={{
              background: "transparent",
              border: "none",
              padding: "8px",
              fontSize: "12px",
              color: "#d4af37",
              cursor: "pointer",
              marginTop: 0,
              textDecoration: "underline",
            }}
          >
            Forgot PIN?
          </button>
        )}
        
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "10px",
            fontSize: "13px",
            color: c.textMuted,
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Cancel
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}