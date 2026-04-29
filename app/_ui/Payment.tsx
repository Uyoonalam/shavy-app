"use client";

import { useState } from "react";

interface PaymentUIProps {
  theme: "dark" | "light";
  paymentDetails: { type: "course" | "founders" | "cvbuilder" | "ads"; title: string; amount: number } | null;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PaymentUI({ theme, paymentDetails, onBack, onSuccess }: PaymentUIProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [demoFilled, setDemoFilled] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1500);
  };

  const fillDemoPayment = () => {
  setName("John Doe");
  setCardNumber("4242 4242 4242 4242");
  setExpiry("12/28");
  setCvv("123");
  setDemoFilled(true);
  showToast("💳 Demo payment details filled!");
};

  const triggerConfetti = () => {
  // Find the phone frame container
  const phoneFrame = document.querySelector('[style*="border-radius: 44px"]') as HTMLElement;
  const container = phoneFrame || document.body;
  
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000";
  canvas.style.borderRadius = "44px";
  canvas.style.overflow = "hidden";
  container.style.position = "relative";
  container.appendChild(canvas);
  
  const ctx = canvas.getContext("2d");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  
  const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
  const colors = ["#d4af37", "#b8860b", "#ffd700", "#daa520", "#f5e050"];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 6,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  
  let animationId: number;
  let startTime = Date.now();
  
  const animate = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allFinished = true;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      
      if (p.y < canvas.height + 50 && p.x > -50 && p.x < canvas.width + 50) {
        allFinished = false;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }
    
    if (allFinished || Date.now() - startTime > 2000) {
      cancelAnimationFrame(animationId);
      container.removeChild(canvas);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  };
  
  animate();
};

  const darkColors = {
    bg: "#1F1C18",
    cardBg: "#2A2622",
    border: "#3a3a3a",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    inputBg: "#2A2622",
  };

  const lightColors = {
    bg: "#f8fafc",
    cardBg: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    textMuted: "#64748b",
    inputBg: "#ffffff",
  };

  const currentColors = theme === "dark" ? darkColors : lightColors;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) {
      showToast("⚠️ Please fill in all payment details");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      if (paymentDetails) {
        if (paymentDetails.type === "course") {
          const saved = localStorage.getItem("shavy_enrolled_courses");
          const enrolled = saved ? JSON.parse(saved) : [];
          const courseIdMap: Record<string, number> = {
            "Advanced Negotiation": 3,
            "Personal Branding": 4,
            "Strategic Networking": 5,
            "Leadership Masterclass": 6,
            "Strategic Career Planning": 7,
            "Executive Communication": 8,
          };
          const courseId = courseIdMap[paymentDetails.title];
          if (courseId !== undefined && !enrolled.includes(courseId)) {
            enrolled.push(courseId);
            localStorage.setItem("shavy_enrolled_courses", JSON.stringify(enrolled));
          }
          showToast(`✅ Successfully enrolled in "${paymentDetails.title}"!`);
          triggerConfetti();
        } else if (paymentDetails.type === "founders") {
          localStorage.setItem("shavy_founders_enabled", "true");
          showToast(`✅ Founders Ecosystem enabled! Check your Vault tab.`);
          triggerConfetti();
        } else if (paymentDetails.type === "cvbuilder") {
          localStorage.setItem("shavy_cvbuilder_enabled", "true");
          showToast(`✅ CV Builder enabled! Check your Vault tab.`);
          triggerConfetti();
        } else if (paymentDetails.type === "ads") {
          localStorage.setItem("shavy_ads_removed", "true");
          window.dispatchEvent(new CustomEvent("adsRemoved"));
          showToast(`✅ Ads removed! Enjoy an ad-free experience.`);
          triggerConfetti();
        }
      }
      
      setTimeout(() => onSuccess(), 750);
    }, 1500);
  };

  if (!paymentDetails) return null;

  const getDisplayTitle = () => {
    if (paymentDetails.type === "course") return paymentDetails.title;
    if (paymentDetails.type === "founders") return "Founders Ecosystem";
    if (paymentDetails.type === "cvbuilder") return "CV Builder";
    return "Remove Ads";
  };

  const getDisplaySubtitle = () => {
    if (paymentDetails.type === "course") return "One-time payment • Lifetime access";
    if (paymentDetails.type === "founders") return "Monthly subscription • Cancel anytime";
    if (paymentDetails.type === "cvbuilder") return "One-time payment • Lifetime access";
    return "One-time payment • Ad-free experience";
  };

  return (
    <div style={{ 
      minHeight: "100%", 
      paddingBottom: "32px",
      paddingLeft: "16px",
      paddingRight: "16px",
      backgroundColor: currentColors.bg,
    }}>
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff",
          color: theme === "dark" ? "#d4af37" : "#b8860b",
          padding: "12px 20px",
          borderRadius: "40px",
          fontSize: "13px",
          fontWeight: "500",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: `1px solid ${theme === "dark" ? "#3a3a3a" : "#e5e7eb"}`,
        }}>
          {toast}
        </div>
      )}

      <button
        onClick={fillDemoPayment}
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
        onMouseEnter={(e) => { e.currentTarget.style.color = "#d4af37"; e.currentTarget.style.transform = "translateX(-4px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = theme === "dark" ? "#94a3b8" : "#64748b"; e.currentTarget.style.transform = "translateX(0)"; }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: currentColors.text, marginBottom: "8px" }}>💳 Payment</h1>
        <p style={{ fontSize: "13px", color: currentColors.textMuted }}>Complete your purchase securely</p>
      </div>

      <div style={{ backgroundColor: currentColors.cardBg, borderRadius: "20px", padding: "20px", border: `1px solid ${currentColors.border}`, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", fontWeight: "600", color: currentColors.text }}>Item</span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: currentColors.text }}>Amount</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${currentColors.border}` }}>
          <div>
            <span style={{ fontSize: "16px", fontWeight: "600", color: currentColors.text }}>{getDisplayTitle()}</span>
            <div style={{ fontSize: "11px", color: currentColors.textMuted, marginTop: "4px" }}>{getDisplaySubtitle()}</div>
          </div>
          <span style={{ fontSize: "24px", fontWeight: "700", color: "#d4af37" }}>${paymentDetails.amount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: currentColors.text, marginBottom: "8px" }}>Cardholder Name</label>
          <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.inputBg, color: currentColors.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => e.target.style.borderColor = "#d4af37"} onBlur={(e) => e.target.style.borderColor = currentColors.border} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: currentColors.text, marginBottom: "8px" }}>Card Number</label>
          <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.inputBg, color: currentColors.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => e.target.style.borderColor = "#d4af37"} onBlur={(e) => e.target.style.borderColor = currentColors.border} />
        </div>

        <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: currentColors.text, marginBottom: "8px" }}>Expiry (MM/YY)</label>
            <input type="text" placeholder="12/28" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.inputBg, color: currentColors.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#d4af37"} onBlur={(e) => e.target.style.borderColor = currentColors.border} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: currentColors.text, marginBottom: "8px" }}>CVV</label>
            <input type="password" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.inputBg, color: currentColors.text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#d4af37"} onBlur={(e) => e.target.style.borderColor = currentColors.border} />
          </div>
        </div>

        <button type="submit" disabled={isProcessing} style={{ width: "100%", background: isProcessing ? "rgba(212, 175, 55, 0.5)" : "linear-gradient(135deg, #d4af37, #b8860b)", backdropFilter: "none", border: "none", padding: "16px", borderRadius: "40px", fontSize: "16px", fontWeight: "600", color: "#111827", cursor: isProcessing ? "wait" : "pointer", opacity: isProcessing ? 0.7 : 1, transition: "all 0.2s ease", marginTop: "8px", boxShadow: isProcessing ? "none" : "0 4px 12px rgba(212, 175, 55, 0.3)" }}
          onMouseEnter={(e) => { if (!isProcessing) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(212, 175, 55, 0.4)"; } }}
          onMouseLeave={(e) => { if (!isProcessing) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(212, 175, 55, 0.3)"; } }}
        >{isProcessing ? "Processing..." : `Pay $${paymentDetails.amount}`}</button>

        <p style={{ textAlign: "center", fontSize: "11px", color: currentColors.textMuted, marginTop: "20px" }}>🔒 Secure payment</p>
      </form>
    </div>
  );
}