"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HomeUI from "./_ui/HomeUI";
import AuditUI from "./_ui/AuditUI";
import VaultUI from "./_ui/VaultUI";
import YouUI from "./_ui/YouUI";
import GetStartedUI from "./_ui/GetStartedUI";
import SignInUI from "./_ui/SignInUI";
import SignUpUI from "./_ui/SignUpUI";
import TopBar from "./_ui/TopBar";
import Sidebar from "./_ui/SideBar";
import PaymentUI from "./_ui/Payment";
import CoursesUI from "./_ui/Courses";

type Screen = "splash" | "getstarted" | "signin" | "signup" | "app" | "courses" | "payment";
type Tab = "home" | "audit" | "vault" | "you";
type Theme = "dark" | "light";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [wipeComplete, setWipeComplete] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ type: "course" | "founders" | "cvbuilder" | "ads"; title: string; amount: number } | null>(null);

  useEffect(() => {
    const hasSeenPrivacy = localStorage.getItem("shavy_privacy_seen");
    if (!hasSeenPrivacy) {
      setShowPrivacyModal(true);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    localStorage.setItem("shavy_privacy_seen", "true");
    setShowPrivacyModal(false);
  };

  const handlePayment = (courseTitle: string, amount: number) => {
    setPaymentDetails({ type: "course", title: courseTitle, amount });
    setShowPayment(true);
  };

  const handlePurchase = (type: "founders" | "cvbuilder" | "ads", amount: number) => {
    const title = type === "founders" ? "Founders Ecosystem" : type === "cvbuilder" ? "CV Builder" : "Remove Ads";
    setPaymentDetails({ type, title, amount });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
  setShowPayment(false);
  setPaymentDetails(null);
  // Go back to the You tab (no page reload)
  setTab("you");
  setScreen("app");
  window.dispatchEvent(new CustomEvent("showToast", { detail: "✅ Purchase completed!" }));
};

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    
    const outsideColor = theme === "light" ? "#1a1a2e" : "#e2e8f0";
    document.body.style.setProperty("background-color", outsideColor, "important");
    document.body.style.transition = "background-color 0.3s ease";
  }, [theme]);

  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => setWipeComplete(true), 1800);
      const nextScreenTimer = setTimeout(() => setScreen("getstarted"), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(nextScreenTimer);
      };
    }
  }, [screen]);

  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent) => {
      setTab(e.detail as Tab);
    };
    window.addEventListener("switchTab", handleSwitchTab as EventListener);
    return () => {
      window.removeEventListener("switchTab", handleSwitchTab as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleNavigateToCourses = () => {
      setShowCourses(true);
    };
    window.addEventListener("navigateToCourses", handleNavigateToCourses);
    return () => window.removeEventListener("navigateToCourses", handleNavigateToCourses);
  }, []);

  const darkColors = {
    bg: "#15161c",
    border: "#2a2b33",
    textMuted: "#94a3b8",
    inputBg: "#2a2a2a",
    inputBorder: "#3a3a3a",
    text: "#e2e8f0",
  };

  const lightColors = {
    bg: "#ffffff",
    border: "#e5e7eb",
    textMuted: "#6B7280",
    inputBg: "#FFFFFF",
    inputBorder: "#E5E7EB",
    text: "#111827",
  };

  const currentColors = theme === "dark" ? darkColors : lightColors;

  // ========== SCREEN RENDERING (in correct order) ==========

  // 1. Splash screen
  if (screen === "splash") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: wipeComplete ? currentColors.bg : "#1F2937",
          transition: "background-color 0.8s ease",
          color: "transparent",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "3px",
            backgroundColor: "#b0d7b2",
            pointerEvents: "none",
            zIndex: 30,
            left: "-10%",
            animation: "lineMoveLeftToRight 1.8s ease-in-out forwards",
          }}
        />
      </div>
    );
  }

  // 2. Get Started
  if (screen === "getstarted") {
    return <GetStartedUI setScreen={setScreen} theme={theme} setTheme={setTheme} />;
  }

  // 3. Sign In
  if (screen === "signin") {
    return <SignInUI setScreen={setScreen} theme={theme} />;
  }

  // 4. Sign Up
  if (screen === "signup") {
    return <SignUpUI setScreen={setScreen} theme={theme} />;
  }

  // 5. Payment screen (before courses, so it takes priority)
  if (showPayment) {
    return <PaymentUI theme={theme} paymentDetails={paymentDetails} onBack={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />;
  }

  // 6. Courses screen (with onPayment)
  if (showCourses) {
    return <CoursesUI theme={theme} onBack={() => setShowCourses(false)} onPayment={handlePayment} />;
  }

  // 7. Main App
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      backgroundColor: theme === "light" ? "#f8f9fa" : "#1F1C18",
      position: "relative",
    }}>
      <TopBar theme={theme} onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div 
        key={tab}
        className="fade-in"
        style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}
      >
        {tab === "home" && <HomeUI theme={theme} />}
        {tab === "audit" && <AuditUI theme={theme} />}
        {tab === "vault" && <VaultUI theme={theme} />}
        {tab === "you" && <YouUI theme={theme} setTheme={setTheme} onPurchase={handlePurchase} />}
      </div>

      <div style={{
        height: "65px",
        borderTop: `1px solid ${theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0)"}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: theme === "light" 
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(31, 28, 24, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "8px",
        position: "sticky",
        bottom: 0,
        zIndex: 40,
      }}>
        {["home", "audit", "vault", "you"].map((t) => {
          const icons: Record<string, string> = {
            home: "🏠",
            audit: "🔍",
            vault: "🔐",
            you: "👤",
          };
          return (
            <button
              key={t}
              onClick={() => setTab(t as Tab)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                background: "transparent",
                border: "none",
                marginTop: 0,
                padding: "6px 12px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                opacity: tab === t ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === "light" 
                  ? "rgba(0, 0, 0, 0.04)" 
                  : "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span style={{ fontSize: "22px" }}>{icons[t]}</span>
              <span style={{
                fontSize: "11px",
                fontWeight: tab === t ? "600" : "400",
                color: tab === t ? "#d4af37" : (theme === "light" ? "#5f6368" : "#94a3b8"),
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          );
        })}
      </div>

      <Sidebar theme={theme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}