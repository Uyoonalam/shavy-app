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
import OnboardingTour from "./_ui/OnboardingTour";

type Screen = "splash" | "getstarted" | "signin" | "signup" | "app" | "courses" | "payment";
type Tab = "home" | "audit" | "vault" | "you";
type Theme = "dark" | "light";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [wipeComplete, setWipeComplete] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ type: "course" | "founders" | "cvbuilder" | "ads"; title: string; amount: number } | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [startSplash, setStartSplash] = useState(false);
  
  // Store random positions in state to avoid hydration mismatch
  const [particles, setParticles] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);

  // Delay splash screen start by 500ms
  useEffect(() => {
    const timer = setTimeout(() => setStartSplash(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsClient(true);
    // Generate particles only on client side
    const newParticles = Array.from({ length: 80 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 5 + 1,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, []);

  // Trigger animation when screen/tab changes
  useEffect(() => {
    setTransitionKey(prev => prev + 1);
  }, [screen, tab]);

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
    setTab("you");
    setScreen("app");
    window.dispatchEvent(new CustomEvent("showToast", { detail: "✅ Purchase completed!" }));
  };

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    
    // Outside color opposite of inside theme
    const outsideColor = theme === "light" ? "#0a0a0a" : "#f0f0f0";
    document.body.style.setProperty("background-color", outsideColor, "important");
    document.body.style.transition = "background-color 0.3s ease";
  }, [theme]);

  useEffect(() => {
    if (screen === "splash" && startSplash) {
      const timer = setTimeout(() => setWipeComplete(true), 3500);
      const nextScreenTimer = setTimeout(() => setScreen("getstarted"), 3800);
      return () => {
        clearTimeout(timer);
        clearTimeout(nextScreenTimer);
      };
    }
  }, [screen, startSplash]);

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

  useEffect(() => {
    const handleForceLogout = () => {
      setScreen("signin");
      setShowPayment(false);
      setShowCourses(false);
      sessionStorage.removeItem("shavy_vault_unlocked");
      window.dispatchEvent(new CustomEvent("showToast", { detail: "Session expired. Please sign in again." }));
    };
    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, []);

  // Onboarding - Show ONCE when user first logs in
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("shavy_onboarding_completed");
    if (!hasSeenOnboarding && screen === "app") {
      setTimeout(() => setShowOnboarding(true), 1500);
    }
  }, [screen]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("shavy_onboarding_completed", "true");
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop === 0 && e.touches[0].clientY - touchStart > 60 && !isRefreshing) {
      setIsRefreshing(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const darkColors = {
    bg: "#1F1C18",
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

  // Don't render splash until startSplash is true
  if (!startSplash) {
    return <div style={{ backgroundColor: "#1F170F", height: "100%" }} />;
  }

  // ========== SCREEN RENDERING ==========

  if (screen === "splash") {
    return (
      <div
        key={`splash-${transitionKey}`}
        suppressHydrationWarning
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: wipeComplete ? currentColors.bg : "#1F170F",
          transition: "background-color 0.8s ease",
        }}
      >
        {/* Animated particles background - only render on client */}
        {isClient && particles.length > 0 && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {particles.map((particle, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: "#d4af37",
                  borderRadius: "50%",
                  opacity: 0,
                  animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated Logo with Shimmer */}
        <div
          style={{
            position: "relative",
            marginBottom: "24px",
            animation: "logoReveal 1s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards",
            transform: "scale(0.9)",
            opacity: 0.5,
          }}
        >
          <div style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "50%",
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: `3px solid rgba(212, 175, 55, 0.6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#1F1C18",
            }}>
              <img 
                src="/ShavyNew.png" 
                alt="Shavy Logo" 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Shimmer effect - loops twice during splash */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
                animation: "shimmer 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 
          style={{
            fontSize: "42px",
            fontWeight: "800",
            letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #fefefe 0%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
            animation: "fadeInText 1s ease-out 0.2s both",
          }}
        >
          Shavy
        </h1>

        {/* Tagline */}
        <p 
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            letterSpacing: "1px",
            animation: "fadeInText 1s ease-out 0.5s both",
          }}
        >
          Illuminate your path
        </p>

        {/* Progress line at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "20%",
            right: "20%",
            height: "2px",
            backgroundColor: "rgba(212,175,55,0.15)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #d4af37, #b8860b)",
              borderRadius: "2px",
              transform: "translateX(-100%)",
              animation: "loadingProgress 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          />
        </div>

        <style>{`
          @keyframes logoReveal {
            0% { opacity: 0.3; transform: scale(0.85); }
            40% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 200%; }
          }
          
          @keyframes fadeInText {
            0% { opacity: 0; transform: translateY(15px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(-20%); }
            100% { transform: translateX(0); }
          }
          
          @keyframes floatParticle {
            0% { opacity: 0; transform: translateY(0) scale(0); }
            15% { opacity: 0.7; transform: scale(1); }
            85% { opacity: 0.4; }
            100% { opacity: 0; transform: translateY(-80px) scale(0); }
          }
        `}</style>
      </div>
    );
  }

  if (screen === "getstarted") {
    return (
      <div key={`getstarted-${transitionKey}`} style={{ animation: "fadeInScale 0.3s ease-out", height: "100%" }}>
        <GetStartedUI setScreen={setScreen} theme={theme} setTheme={setTheme} />
      </div>
    );
  }

  if (screen === "signin") {
    return (
      <div key={`signin-${transitionKey}`} style={{ animation: "fadeInScale 0.3s ease-out", height: "100%" }}>
        <SignInUI setScreen={setScreen} theme={theme} />
      </div>
    );
  }

  if (screen === "signup") {
    return (
      <div key={`signup-${transitionKey}`} style={{ animation: "fadeInScale 0.3s ease-out", height: "100%" }}>
        <SignUpUI setScreen={setScreen} theme={theme} />
      </div>
    );
  }

  if (showPayment) {
    return (
      <div key={`payment-${transitionKey}`} style={{ animation: "fadeInScale 0.3s ease-out", height: "100%" }}>
        <PaymentUI theme={theme} paymentDetails={paymentDetails} onBack={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      </div>
    );
  }

  if (showCourses) {
    return (
      <div key={`courses-${transitionKey}`} style={{ animation: "fadeInScale 0.3s ease-out", height: "100%" }}>
        <CoursesUI theme={theme} onBack={() => setShowCourses(false)} onPayment={handlePayment} />
      </div>
    );
  }

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
        key={`app-${tab}-${transitionKey}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ 
          flex: 1, 
          padding: "20px 16px", 
          overflowY: "auto",
          animation: "fadeInScale 0.25s ease-out",
          position: "relative",
        }}
      >
        {isRefreshing && (
          <div style={{ textAlign: "center", padding: "10px", position: "sticky", top: 0, zIndex: 10 }}>
            <div style={{ 
              display: "inline-block", 
              width: "24px", 
              height: "24px", 
              border: "2px solid #d4af37", 
              borderTopColor: "transparent", 
              borderRadius: "50%", 
              animation: "spin 0.6s linear infinite" 
            }} />
          </div>
        )}
        
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
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
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

      <Sidebar
        theme={theme}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onThemeToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
      />

      {showOnboarding && (
        <OnboardingTour
          theme={theme}
          onComplete={handleOnboardingComplete}
        />
      )}

      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}