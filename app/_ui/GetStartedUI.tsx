"use client";

export default function GetStartedUI({ setScreen, theme, setTheme }: any) {
  return (
    <main 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: "40px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: theme === "dark" 
          ? "linear-gradient(145deg, #1a1f2e 0%, #0f1118 100%)"
          : "linear-gradient(145deg, #fefcf5 0%, #fff9e8 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-30%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
        animation: "float 8s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-30%",
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
        animation: "float 10s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme === "dark" ? "rgba(212,175,55,0.3)" : "rgba(212,175,55,0.2)"}`,
          borderRadius: "40px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "500",
          color: theme === "dark" ? "#fefefe" : "#1f2937",
          cursor: "pointer",
          transition: "all 0.2s",
          zIndex: 20,
          marginTop: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.borderColor = "#d4af37";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = theme === "dark" ? "rgba(212,175,55,0.3)" : "rgba(212,175,55,0.2)";
        }}
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* Logo */}
      <div
        style={{
          position: "relative",
          marginBottom: "32px",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0) 70%)",
          filter: "blur(25px)",
          animation: "pulseGlow 2s ease-in-out infinite",
        }} />
        <div style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: `4px solid ${theme === "dark" ? "rgba(212,175,55,0.6)" : "rgb(212,175,55)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          boxShadow: theme === "dark"
            ? "0 0 50px rgba(212,175,55,0.3), inset 0 0 25px rgba(0,0,0,0.2)"
            : "0 30px 45px -12px rgba(0,0,0,0.2), inset 0 1px 0 0 rgba(255,255,255,0.8)",
          position: "relative",
          zIndex: 10,
        }}>
          <img 
            src="/ShavyNew.png" 
            alt="Shavy Logo" 
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: theme === "dark" ? "brightness(1.1)" : "none",
            }}
          />
        </div>
      </div>

      {/* Brand Name */}
      <h1 
        key={theme}
        style={{
          fontSize: "48px",
          fontWeight: "800",
          letterSpacing: "-1.5px",
          background: theme === "dark"
            ? "linear-gradient(135deg, #fefefe 0%, #d4af37 100%)"
            : "linear-gradient(135deg, #1f2937 0%, #b8860b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "12px",
        }}
      >
        Shavy
      </h1>

      {/* Tagline */}
      <p 
        key={`tagline-${theme}`}
        style={{
          fontSize: "20px",
          maxWidth: "340px",
          marginBottom: "40px",
          lineHeight: "1.4",
          background: theme === "dark"
            ? "linear-gradient(135deg, #fefefe 0%, #d4af37 100%)"
            : "linear-gradient(135deg, #1f2937 0%, #b8860b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Illuminate your path
      </p>

      {/* CTA Button with side-to-side sweep */}
      <button
  onClick={() => setScreen("signin")}  // or "app" for SignIn/SignUp
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
  Get Started →
</button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </main>
  );
}