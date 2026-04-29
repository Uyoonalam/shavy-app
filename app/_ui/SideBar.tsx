"use client";

import { useState, useEffect, useRef } from "react";
import InviteUI from "./InviteUI";

interface SidebarProps {
  theme: "dark" | "light";
  isOpen: boolean;
  onClose: () => void;
  onThemeToggle: () => void;
}

export default function Sidebar({ theme, isOpen, onClose, onThemeToggle }: SidebarProps) {
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    exchanges: false,
    regulators: false,
    tax: false,
    central: false,
    business: false,
    labor: false,
    trade: false,
    realestate: false,
    consumer: false,
    economic: false,
    crypto: false,
    legal: false,
  });

  useEffect(() => {
    const name = localStorage.getItem("shavy_user_name") || localStorage.getItem("shavy_extracted_name") || "Guest User";
    const email = localStorage.getItem("shavy_user_email") || localStorage.getItem("shavy_extracted_email") || "";
    const photo = localStorage.getItem("shavy_profile_photo");
    
    setUserName(name);
    setUserEmail(email);
    if (photo) setProfilePhoto(photo);
  }, []);

  useEffect(() => {
  const handleStorageChange = () => {
    const photo = localStorage.getItem("shavy_profile_photo");
    if (photo) setProfilePhoto(photo);
  };
  
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

  if (!isOpen) return null;

  const darkColors = {
    bg: "#1F1C18",
    border: "rgba(255,255,255,0.08)",
    text: "#e2e8f0",
    textMuted: "#94a3b8",
    goldAccent: "#d4af37",
    hoverBg: "rgba(212, 175, 55, 0.1)",
  };

  const lightColors = {
    bg: "#ffffff",
    border: "rgba(0,0,0,0.06)",
    text: "#0f172a",
    textMuted: "#64748b",
    goldAccent: "#b8860b",
    hoverBg: "rgba(184, 134, 11, 0.08)",
  };

  const c = theme === "dark" ? darkColors : lightColors;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem("shavy_profile_photo", base64String);
        const toast = document.createElement("div");
        toast.textContent = "📸 Profile photo updated!";
        toast.style.position = "fixed";
        toast.style.bottom = "80px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
        toast.style.color = "#d4af37";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "40px";
        toast.style.fontSize = "13px";
        toast.style.zIndex = "300";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate shareable profile link
  const shareableLink = `https://shavy-app.vercel.app/share/${encodeURIComponent(userName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = () => {
    setShowShareModal(true);
  };

  const handleInviteFriends = () => {
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  const handleThemeToggleWithAnimation = () => {
    setIsToggling(true);
    setTimeout(() => {
      onThemeToggle();
      setTimeout(() => setIsToggling(false), 300);
    }, 150);
  };

  // Accordion toggle - only one section open at a time
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      // If clicking the already open section, close it
      if (prev[sectionId]) {
        return { ...prev, [sectionId]: false };
      }
      // Otherwise, open this section and close all others
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        newState[key] = false;
      });
      newState[sectionId] = true;
      return newState;
    });
  };

  const sections = [
    { id: "exchanges", title: " Global Stock Exchanges", icon: "🌍", links: [
      { flag: "🇺🇸", name: "NYSE", desc: "New York Stock Exchange", url: "https://www.nyse.com" },
      { flag: "🇬🇧", name: "London Stock Exchange (LSE)", desc: "FTSE 100, UK stocks", url: "https://www.londonstockexchange.com" },
      { flag: "🇯🇵", name: "Nikkei 225", desc: "Japan stock market index", url: "https://www.nikkei.co.jp/nikkeiindex/en/" },
      { flag: "🇦🇺", name: "Australian Securities Exchange (ASX)", desc: "Australian stocks", url: "https://www.asx.com.au" },
      { flag: "🇩🇪", name: "Deutsche Börse", desc: "German stock exchange (DAX)", url: "https://www.deutsche-boerse.com" },
      { flag: "🇫🇷", name: "Euronext", desc: "European stock exchange", url: "https://www.euronext.com" },
      { flag: "🇭🇰", name: "Hong Kong Stock Exchange (HKEX)", desc: "Asian markets", url: "https://www.hkex.com.hk" },
      { flag: "🇮🇳", name: "BSE India", desc: "Bombay Stock Exchange", url: "https://www.bseindia.com" },
      { flag: "🇨🇳", name: "Shanghai Stock Exchange", desc: "Chinese stocks (SSE)", url: "http://www.sse.com.cn" },
    ] },
    { id: "regulators", title: "Global Financial Regulators", icon: "🏦", links: [
      { flag: "🇺🇸", name: "SEC (USA)", desc: "Securities and Exchange Commission", url: "https://www.sec.gov" },
      { flag: "🇬🇧", name: "FCA (UK)", desc: "Financial Conduct Authority", url: "https://www.fca.org.uk" },
      { flag: "🇪🇺", name: "ESMA (EU)", desc: "European Securities and Markets Authority", url: "https://www.esma.europa.eu" },
      { flag: "🇵🇰", name: "SECP Pakistan", desc: "Securities and Exchange Commission of Pakistan", url: "https://www.secp.gov.pk" },
      { flag: "🇮🇳", name: "SEBI India", desc: "Securities and Exchange Board of India", url: "https://www.sebi.gov.in" },
      { flag: "🇦🇪", name: "DFSA (Dubai)", desc: "Dubai Financial Services Authority", url: "https://www.dfsa.ae" },
    ] },
    { id: "tax", title: "Global Tax Authorities", icon: "💰", links: [
      { flag: "🇬🇧", name: "HMRC (UK)", desc: "UK tax rates & regulations", url: "https://www.gov.uk/government/organisations/hm-revenue-customs" },
      { flag: "🇨🇦", name: "CRA (Canada)", desc: "Canada Revenue Agency", url: "https://www.canada.ca/en/revenue-agency.html" },
      { flag: "🇦🇺", name: "ATO (Australia)", desc: "Australian Taxation Office", url: "https://www.ato.gov.au" },
      { flag: "🇵🇰", name: "FBR Pakistan", desc: "Income tax rates, sales tax", url: "https://www.fbr.gov.pk" },
      { flag: "🇮🇳", name: "Income Tax India", desc: "Indian tax department", url: "https://www.incometaxindia.gov.in" },
      { flag: "🇸🇬", name: "IRAS (Singapore)", desc: "Inland Revenue Authority", url: "https://www.iras.gov.sg" },
    ] },
    { id: "central", title: "Global Central Banks", icon: "🏛️", links: [
      { flag: "🇺🇸", name: "Federal Reserve (USA)", desc: "US monetary policy, interest rates", url: "https://www.federalreserve.gov" },
      { flag: "🇪🇺", name: "European Central Bank (ECB)", desc: "Eurozone monetary policy", url: "https://www.ecb.europa.eu" },
      { flag: "🇬🇧", name: "Bank of England", desc: "UK interest rates", url: "https://www.bankofengland.co.uk" },
      { flag: "🇯🇵", name: "Bank of Japan", desc: "Japanese monetary policy", url: "https://www.boj.or.jp/en/" },
      { flag: "🇵🇰", name: "State Bank of Pakistan", desc: "Exchange rates, monetary policy", url: "https://www.sbp.org.pk" },
      { flag: "🇮🇳", name: "RBI (India)", desc: "Reserve Bank of India", url: "https://www.rbi.org.in" },
      { flag: "🇨🇳", name: "People's Bank of China", desc: "Chinese monetary policy", url: "http://www.pbc.gov.cn" },
    ] },
    { id: "business", title: "Global Business & Company Data", icon: "🏢", links: [
      { flag: "📊", name: "Bloomberg", desc: "Financial news, market data", url: "https://www.bloomberg.com" },
      { flag: "📰", name: "Reuters", desc: "Global business news", url: "https://www.reuters.com" },
      { flag: "📈", name: "Wall Street Journal", desc: "Business & financial news", url: "https://www.wsj.com" },
      { flag: "📘", name: "Financial Times", desc: "Global economy & markets", url: "https://www.ft.com" },
      { flag: "🇵🇰", name: "PSX", desc: "Pakistan Stock Exchange", url: "https://www.psx.com.pk" },
    ] },
    { id: "trade", title: "International Trade & Tariffs", icon: "🌐", links: [
      { flag: "🌍", name: "World Trade Organization (WTO)", desc: "Trade policies, tariffs", url: "https://www.wto.org" },
      { flag: "🇺🇸", name: "ITA (US)", desc: "International Trade Administration", url: "https://www.trade.gov" },
      { flag: "🇨🇦", name: "Global Affairs Canada", desc: "Canadian trade agreements", url: "https://www.tradecommissioner.gc.ca" },
      { flag: "🇪🇺", name: "EU Trade", desc: "European Union trade policy", url: "https://ec.europa.eu/trade" },
    ] },
    { id: "realestate", title: "Real Estate & Property Data", icon: "🏠", links: [
      { flag: "🇺🇸", name: "Zillow", desc: "US property values, rent data", url: "https://www.zillow.com" },
      { flag: "🇬🇧", name: "Rightmove", desc: "UK property market data", url: "https://www.rightmove.co.uk" },
      { flag: "🇦🇪", name: "Property Finder", desc: "Middle East property", url: "https://www.propertyfinder.ae" },
    ] },
    { id: "consumer", title: "Global Consumer Protection", icon: "🛡️", links: [
      { flag: "✅", name: "Better Business Bureau (BBB)", desc: "Business complaints & ratings", url: "https://www.bbb.org" },
      { flag: "🇪🇺", name: "EU Consumer Protection", desc: "European consumer rights", url: "https://ec.europa.eu/consumers/odr/main/" },
      { flag: "🇬🇧", name: "UK Consumer Protection", desc: "UK consumer rights", url: "https://www.gov.uk/consumer-protection" },
      { flag: "🇵🇰", name: "DRAP Pakistan", desc: "Drug Regulatory Authority", url: "https://www.drap.gov.pk" },
    ] },
    { id: "economic", title: "Global Economic Data & Statistics", icon: "📈", links: [
      { flag: "🌍", name: "World Bank", desc: "Economic indicators", url: "https://www.worldbank.org" },
      { flag: "📘", name: "OECD", desc: "Economic outlook", url: "https://www.oecd.org" },
      { flag: "🏦", name: "International Monetary Fund (IMF)", desc: "Global economic outlook", url: "https://www.imf.org" },
      { flag: "🇺🇸", name: "Federal Reserve Economic Data (FRED)", desc: "US economic data", url: "https://fred.stlouisfed.org" },
    ] },
    { id: "crypto", title: "Cryptocurrency & Blockchain Data", icon: "₿", links: [
      { flag: "₿", name: "CoinGecko", desc: "Cryptocurrency prices, market cap", url: "https://www.coingecko.com" },
      { flag: "📊", name: "CoinMarketCap", desc: "Crypto market data", url: "https://coinmarketcap.com" },
      { flag: "🔗", name: "Chainalysis", desc: "Blockchain analytics", url: "https://www.chainalysis.com" },
    ] },
    { id: "legal", title: "International Legal Databases", icon: "⚖️", links: [
      { flag: "⚖️", name: "World Legal Information Institute", desc: "Global legal resources", url: "https://www.worldlii.org" },
      { flag: "🇺🇸", name: "Cornell LII", desc: "US legal information", url: "https://www.law.cornell.edu" },
      { flag: "🇬🇧", name: "BAILII", desc: "British and Irish legal info", url: "https://www.bailii.org" },
    ] },
  ];


  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "none",
          zIndex: 100,
          borderRadius: "44px",
        }}
      />
      
      {/* Sidebar Panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          backgroundColor: c.bg,
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.25s ease-out",
          borderRadius: "0 24px 24px 0",
          borderRight: `1px solid ${c.border}`,
          boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 0 0" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: c.textMuted,
              padding: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.color = c.goldAccent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = c.textMuted;
            }}
          >
            ✕
          </button>
        </div>

        {/* Profile Section with Upload */}
        <div style={{ textAlign: "center", padding: "8px 20px 20px 20px", borderBottom: `1px solid ${c.border}` }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: profilePhoto ? "transparent" : `linear-gradient(135deg, ${c.goldAccent}, ${c.goldAccent}80)`,
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              overflow: "hidden",
              border: `2px solid ${c.goldAccent}`,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "👤"
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "4px" }}>
            <span style={{ fontSize: "10px", color: c.textMuted }}>Tap to change photo</span>
            <span style={{ fontSize: "10px" }}>📸</span>
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text, marginBottom: "4px", marginTop: "8px" }}>
            {userName.length > 20 ? userName.substring(0, 20) + "..." : userName}
          </h3>
          {userEmail && (
            <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "8px" }}>
              {userEmail.length > 25 ? userEmail.substring(0, 25) + "..." : userEmail}
            </p>
          )}
        </div>

        {/* Theme Toggle - Slider Switch */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${c.border}` }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>{theme === "dark" ? "🌙" : "☀️"}</span>
              <span style={{ fontSize: "13px", fontWeight: "500", color: c.text }}>
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            
            {/* Slider Toggle */}
            <button
              onClick={handleThemeToggleWithAnimation}
              disabled={isToggling}
              style={{
                width: "52px",
                height: "28px",
                backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
                borderRadius: "34px",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.3s ease",
                padding: "2px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#d4af37",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: theme === "dark" ? "26px" : "2px",
                  transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "12px" }}>{theme === "dark" ? "🌙" : "☀️"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: "16px 12px", flex: 1 }}>
          {/* Invite Friends */}
          <button
            onClick={handleInviteFriends}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>👥</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Invite Friends</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Earn rewards</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>

          {/* Share Profile */}
          <button
            onClick={handleShareProfile}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              marginTop: "4px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>📤</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Share Profile</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Get your shareable link</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>

          {/* Legal Sources */}
          <button
            onClick={() => setShowLegalModal(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              marginTop: "4px",
              background: "transparent",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = c.hoverBg;
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <span style={{ fontSize: "20px", opacity: 0.7 }}>⚖️</span>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500", color: c.text }}>Legal Sources</div>
              <div style={{ fontSize: "11px", color: c.textMuted }}>Data & research references</div>
            </div>
            <span style={{ fontSize: "12px", color: c.textMuted }}>→</span>
          </button>
        </div>

        {/* Bottom Section - Version */}
        <div style={{ padding: "16px", borderTop: `1px solid ${c.border}`, textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: c.textMuted, opacity: 0.6 }}>Shavy v1.0.0</p>
          <p style={{ fontSize: "9px", color: c.textMuted, opacity: 0.4, marginTop: "4px" }}>
            🔒 Privacy-first career platform
          </p>
        </div>
      </div>

      {/* Share Profile Modal */}
      {showShareModal && (
        <>
          <div onClick={() => setShowShareModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "260px", backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff", borderRadius: "20px", padding: "20px", zIndex: 201, border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: c.text }}>📤 Share Profile</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: c.textMuted }}>✕</button>
            </div>
            <p style={{ fontSize: "11px", color: c.textMuted, marginBottom: "12px", textAlign: "center" }}>
              Share your profile link
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                readOnly
                value={shareableLink}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: `1px solid ${c.border}`,
                  backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
                  color: c.text,
                  fontSize: "10px",
                  fontFamily: "monospace",
                }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: "8px 12px",
                  background: "linear-gradient(135deg, #d4af37, #b8860b)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Legal Sources Modal - Collapsible Sections (Accordion) */}
      {showLegalModal && (
        <>
          <div onClick={() => setShowLegalModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "none", zIndex: 200 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "280px", maxHeight: "380px", overflowY: "auto", backgroundColor: theme === "dark" ? "#2A2622" : "#ffffff", borderRadius: "20px", padding: "20px", zIndex: 201, border: `1px solid ${c.border}` }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: c.text }}>⚖️ Legal & Data Sources</h3>
              <button onClick={() => setShowLegalModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: c.textMuted }}>✕</button>
            </div>
            
            <div style={{ fontSize: "11px", color: c.textMuted, marginBottom: "16px", lineHeight: "1.4" }}>
              Shavy references data from these trusted sources:
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sections.map((section) => (
                <div key={section.id} style={{ marginBottom: "8px" }}>
                  <div 
                    onClick={() => toggleSection(section.id)}
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      cursor: "pointer",
                      padding: "8px 0",
                      borderBottom: `1px solid ${c.border}`,
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: "600", color: c.goldAccent }}>
                      <span style={{ marginRight: "6px" }}>{section.icon}</span>
                      {section.title}
                    </div>
                    <span style={{ fontSize: "12px", color: c.textMuted }}>{openSections[section.id] ? "−" : "+"}</span>
                  </div>
                  
                  {openSections[section.id] && (
                    <div style={{ marginTop: "8px", marginBottom: "4px" }}>
                      {section.links.map((link, idx) => (
                        <a 
                          key={idx}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            padding: "8px 10px", 
                            background: "transparent",
                            borderRadius: "10px", 
                            textDecoration: "none",
                            marginBottom: "4px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = c.hoverBg;
                            e.currentTarget.style.transform = "translateX(2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <span style={{ fontSize: "16px", opacity: 0.8 }}>{link.flag}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: "500", color: c.text }}>
                              {link.name}
                            </div>
                            <div style={{ fontSize: "9px", color: c.textMuted }}>
                              {link.desc}
                            </div>
                          </div>
                          <span style={{ fontSize: "11px", color: c.textMuted, opacity: 0.6 }}>🔗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <p style={{ fontSize: "9px", color: c.textMuted, textAlign: "center", marginTop: "16px", paddingTop: "12px", borderTop: `1px solid ${c.border}` }}>
              Data is aggregated from public sources for research purposes.
            </p>
          </div>
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteUI 
          theme={theme} 
          onClose={handleCloseInviteModal} 
          onUnlockCVBuilder={() => {
            window.dispatchEvent(new CustomEvent("showToast", { detail: "🎉 CV Builder unlocked! Check your Vault tab." }));
            handleCloseInviteModal();
          }}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}