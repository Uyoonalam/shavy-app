"use client";

import { useState, useEffect, useRef } from "react";

interface AuditUIProps {
  theme: "dark" | "light";
}

// GOOD COMPANIES DETAILS DATA
const goodCompaniesDetails = {
  "Amazon Logistics": {
    general: {
      name: "Amazon Logistics",
      taxId: "88-1234567",
      registrationNumber: "AMZN-IL-1994-001",
      founded: 1994,
      ceo: "Andy Jassy",
      headquarters: "Seattle, Washington, USA",
      employees: "1,500,000+",
      website: "https://www.amazon.jobs",
      stockSymbol: "NASDAQ: AMZN",
    },
    financial: {
      stockPrice: "$178.50",
      marketCap: "$1.85T",
      revenue: "$574.8B",
      operatingIncome: "$48.8B",
      netIncome: "$37.3B",
      profitMargin: "6.5%",
      totalAssets: "$527.9B",
      totalLiabilities: "$325.9B",
      shareholderEquity: "$202.0B",
      debtToEquity: "0.61",
      peRatio: "48.2",
      eps: "$3.56",
    },
    controversies: [
      { title: "Antitrust Investigations (2023)", summary: "FTC lawsuit alleging monopolistic practices", link: "#", severity: "Medium" },
      { title: "Unionization Efforts (2024)", summary: "Multiple warehouse unionization drives", link: "#", severity: "Low" },
      { title: "Warehouse Safety Concerns (2022)", summary: "OSHA citations for safety violations", link: "#", severity: "Medium" },
    ],
    exEmployeeRating: {
      overall: 4.2,
      workLifeBalance: 3.8,
      compensation: 4.5,
      careerGrowth: 4.3,
      management: 4.0,
      benefits: 4.4,
      culture: 4.1,
      totalReviews: 12500,
      recentTrend: "+5%",
    },
    aiGeneratedDescription: "Amazon Logistics is a global leader in supply chain and last-mile delivery. With $574B+ in annual revenue, they have successfully integrated AI-driven warehouse automation and predictive logistics. Their financial health is excellent, with consistent year-over-year growth. Employee ratings are high for compensation and career growth, though work-life balance remains a concern. Recent antitrust scrutiny has not materially impacted operations.",
    trustScore: 94,
    verificationBadge: "🥇 Gold",
    trendData: [88, 89, 90, 91, 91, 92, 92, 93, 93, 94, 94, 94],
  },
  "DHL Supply Chain": {
    general: {
      name: "DHL Supply Chain",
      taxId: "36-1234567",
      registrationNumber: "DHL-EU-1969-002",
      founded: 1969,
      ceo: "Tobias Meyer",
      headquarters: "Bonn, Germany",
      employees: "590,000+",
      website: "https://www.dhl.com/careers",
      stockSymbol: "ETR: DHL",
    },
    financial: {
      stockPrice: "€42.30",
      marketCap: "€50.2B",
      revenue: "€94.4B",
      operatingIncome: "€8.5B",
      netIncome: "€5.6B",
      profitMargin: "5.9%",
      totalAssets: "€68.2B",
      totalLiabilities: "€42.1B",
      shareholderEquity: "€26.1B",
      debtToEquity: "0.52",
      peRatio: "15.4",
      eps: "€2.75",
    },
    controversies: [
      { title: "Price-Fixing Investigation (2022)", summary: "EU antitrust fine for price-fixing in logistics", link: "#", severity: "Low" },
      { title: "Labor Disputes (2023)", summary: "German worker strikes over pay conditions", link: "#", severity: "Low" },
    ],
    exEmployeeRating: {
      overall: 4.0,
      workLifeBalance: 4.0,
      compensation: 4.1,
      careerGrowth: 4.2,
      management: 3.9,
      benefits: 4.2,
      culture: 4.0,
      totalReviews: 8700,
      recentTrend: "+2%",
    },
    aiGeneratedDescription: "DHL Supply Chain is the world's leading logistics provider, operating in 220+ countries. They have pioneered green logistics initiatives and digital transformation in warehousing. Financially stable with strong European market presence. Employee satisfaction scores are above industry average, particularly in international assignments.",
    trustScore: 87,
    verificationBadge: "🥇 Gold",
    trendData: [85, 86, 86, 87, 87, 87, 86, 86, 87, 87, 87, 87],
  },
  "UPS": {
    general: {
      name: "UPS",
      taxId: "76-1234567",
      registrationNumber: "UPS-USA-1907-003",
      founded: 1907,
      ceo: "Carol Tomé",
      headquarters: "Atlanta, Georgia, USA",
      employees: "500,000+",
      website: "https://www.ups.com/careers",
      stockSymbol: "NYSE: UPS",
    },
    financial: {
      stockPrice: "$156.20",
      marketCap: "$134.5B",
      revenue: "$100.3B",
      operatingIncome: "$13.4B",
      netIncome: "$9.1B",
      profitMargin: "9.1%",
      totalAssets: "$71.1B",
      totalLiabilities: "$45.2B",
      shareholderEquity: "$25.9B",
      debtToEquity: "0.58",
      peRatio: "14.8",
      eps: "$10.55",
    },
    controversies: [
      { title: "Teamsters Contract Negotiations (2023)", summary: "Strike threat and tense labor negotiations", link: "#", severity: "Low" },
      { title: "Driver Classification Lawsuit (2021)", summary: "Classification of drivers as employees vs contractors", link: "#", severity: "Low" },
    ],
    exEmployeeRating: {
      overall: 3.9,
      workLifeBalance: 3.7,
      compensation: 4.2,
      careerGrowth: 3.9,
      management: 3.8,
      benefits: 4.3,
      culture: 3.9,
      totalReviews: 15200,
      recentTrend: "-1%",
    },
    aiGeneratedDescription: "UPS is America's largest parcel delivery company with over 100 years of operational excellence. Under CEO Carol Tomé's leadership, UPS has focused on profitability over volume. Financially strong with industry-leading 9.1% profit margins. Employee satisfaction is mixed — strong benefits and compensation offset by demanding work conditions.",
    trustScore: 91,
    verificationBadge: "🥇 Gold",
    trendData: [90, 91, 91, 91, 90, 90, 91, 91, 91, 91, 91, 91],
  },
};

// MID COMPANIES DETAILS DATA
const midCompaniesDetails = {
  "FedEx Corp": {
    general: { name: "FedEx Corp", taxId: "62-1234567", registrationNumber: "FDX-TN-1971-004", founded: 1971, ceo: "Raj Subramaniam", headquarters: "Memphis, Tennessee, USA", employees: "500,000+", website: "https://www.fedex.com/careers", stockSymbol: "NYSE: FDX" },
    financial: { stockPrice: "$289.50", marketCap: "$72.1B", revenue: "$87.7B", operatingIncome: "$5.8B", netIncome: "$3.9B", profitMargin: "4.4%", totalAssets: "$82.5B", totalLiabilities: "$58.2B", shareholderEquity: "$24.3B", debtToEquity: "0.69", peRatio: "18.5", eps: "$15.65" },
    controversies: [
      { title: "DOJ Criminal Indictment (2014-2020)", summary: "Charged with distributing controlled substances for illegal pharmacies (later dismissed)", link: "#", severity: "Medium" },
      { title: "Italy Labor Investigation (2024)", summary: "Under investigation for labor/tax fraud schemes", link: "#", severity: "Medium" },
    ],
    exEmployeeRating: { overall: 3.7, workLifeBalance: 3.4, compensation: 3.8, careerGrowth: 3.6, management: 3.5, benefits: 4.0, culture: 3.6, totalReviews: 15800, recentTrend: "-2%" },
    aiGeneratedDescription: "FedEx is a global logistics giant with significant legal challenges. Financially stable but showing lower margins than UPS. Employee reviews cite demanding work conditions.",
    trustScore: 71,
    verificationBadge: "✅ Verified",
    trendData: [75, 74, 73, 72, 72, 71, 71, 70, 70, 71, 71, 71],
  },
  "XPO Logistics": {
    general: { name: "XPO Logistics", taxId: "82-1234567", registrationNumber: "XPO-CT-2000-005", founded: 2000, ceo: "Mario Harik", headquarters: "Greenwich, Connecticut, USA", employees: "40,000+", website: "https://www.xpo.com/careers", stockSymbol: "NYSE: XPO" },
    financial: { stockPrice: "$112.30", marketCap: "$13.2B", revenue: "$7.7B", operatingIncome: "$0.42B", netIncome: "$0.28B", profitMargin: "3.6%", totalAssets: "$7.2B", totalLiabilities: "$5.3B", shareholderEquity: "$1.9B", debtToEquity: "1.08", peRatio: "42.1", eps: "$2.67" },
    controversies: [
      { title: "Con-way Legacy Lawsuits", summary: "Inherited environmental lawsuits from Con-way acquisition", link: "#", severity: "Medium" },
      { title: "DOJ Settlement (2016)", summary: "Paid $10M to settle overcharging claims", link: "#", severity: "Low" },
    ],
    exEmployeeRating: { overall: 3.5, workLifeBalance: 3.3, compensation: 3.4, careerGrowth: 3.7, management: 3.4, benefits: 3.6, culture: 3.5, totalReviews: 3200, recentTrend: "-1%" },
    aiGeneratedDescription: "XPO Logistics is a less-than-truckload carrier with a history of aggressive acquisitions. Margins remain thin compared to industry leaders.",
    trustScore: 58,
    verificationBadge: "⏳ Pending",
    trendData: [62, 61, 60, 59, 59, 58, 58, 57, 57, 58, 58, 58],
  },
  "J.B. Hunt Transport": {
    general: { name: "J.B. Hunt Transport", taxId: "71-1234567", registrationNumber: "JBHT-AR-1961-006", founded: 1961, ceo: "Shelley Simpson", headquarters: "Lowell, Arkansas, USA", employees: "34,000+", website: "https://www.jbhunt.com/careers", stockSymbol: "NASDAQ: JBHT" },
    financial: { stockPrice: "$165.80", marketCap: "$17.1B", revenue: "$12.9B", operatingIncome: "$1.1B", netIncome: "$0.78B", profitMargin: "6.0%", totalAssets: "$8.5B", totalLiabilities: "$4.8B", shareholderEquity: "$3.7B", debtToEquity: "0.42", peRatio: "21.9", eps: "$7.57" },
    controversies: [
      { title: "Fatal Crash Lawsuit (2023)", summary: "Lawsuit over fatal Arizona crash caused by driver attempting illegal pass", link: "#", severity: "High" },
      { title: "Broker vs Carrier Liability Dispute", summary: "Ongoing insurance lawsuit over liability classification", link: "#", severity: "Medium" },
    ],
    exEmployeeRating: { overall: 3.6, workLifeBalance: 3.5, compensation: 3.7, careerGrowth: 3.6, management: 3.5, benefits: 3.8, culture: 3.6, totalReviews: 4100, recentTrend: "0%" },
    aiGeneratedDescription: "J.B. Hunt specializes in intermodal freight. The company faces a serious lawsuit over a fatal 2023 accident. Financially stable with moderate profit margins.",
    trustScore: 62,
    verificationBadge: "⏳ Pending",
    trendData: [65, 64, 64, 63, 63, 62, 62, 61, 61, 62, 62, 62],
  },
};

// BAD COMPANIES DETAILS DATA
const badCompaniesDetails = {
  "Yellow Freight (Defunct)": {
    general: { name: "Yellow Freight (Defunct)", taxId: "48-1234567", registrationNumber: "YELL-KS-1924-007", founded: 1924, ceo: "Darren Hawkins (final)", headquarters: "Overland Park, Kansas, USA", employees: "30,000 (at closure)", website: "Defunct", stockSymbol: "NASDAQ: YELL (delisted)" },
    financial: { stockPrice: "$0.00", marketCap: "$0", revenue: "$5.2B", operatingIncome: "-$0.5B", netIncome: "-$1.2B", profitMargin: "-23%", totalAssets: "$2.8B", totalLiabilities: "$3.5B", shareholderEquity: "-$0.7B", debtToEquity: "Negative", peRatio: "N/A", eps: "-$35.00" },
    controversies: [
      { title: "Chapter 11 Bankruptcy (2023)", summary: "Filed for bankruptcy, abandoned 30,000 workers", link: "#", severity: "Critical" },
      { title: "U.S. Treasury Default", summary: "Still owes $700+ million from COVID-era loan", link: "#", severity: "Critical" },
    ],
    exEmployeeRating: { overall: 1.8, workLifeBalance: 2.0, compensation: 1.5, careerGrowth: 1.2, management: 1.5, benefits: 1.3, culture: 2.0, totalReviews: 2300, recentTrend: "-45%" },
    aiGeneratedDescription: "Yellow Freight was a century-old American trucking company that filed for Chapter 11 bankruptcy in 2023, abandoning 30,000 workers.",
    trustScore: 22,
    verificationBadge: "❌ Not Verified",
    trendData: [45, 42, 38, 35, 32, 28, 25, 23, 22, 22, 22, 22],
  },
  "Trucking Nation LLC": {
    general: { name: "Trucking Nation LLC", taxId: "84-1234567", registrationNumber: "TRN-USA-2015-008", founded: 2015, ceo: "Unknown", headquarters: "Unknown", employees: "15-50", website: "No public presence", stockSymbol: "Private" },
    financial: { stockPrice: "Private", marketCap: "Unknown", revenue: "Undisclosed", operatingIncome: "Unknown", netIncome: "Unknown", profitMargin: "Unknown", totalAssets: "Unknown", totalLiabilities: "Unknown", shareholderEquity: "Unknown", debtToEquity: "Unknown", peRatio: "N/A", eps: "N/A" },
    controversies: [
      { title: "No Public News Record", summary: "Company operates without public scrutiny or regulatory filings", link: "#", severity: "Medium" },
      { title: "Unverified Status", summary: "No tax or registration documents available", link: "#", severity: "High" },
    ],
    exEmployeeRating: { overall: 2.5, workLifeBalance: 2.5, compensation: 2.3, careerGrowth: 2.0, management: 2.5, benefits: 2.0, culture: 2.8, totalReviews: 45, recentTrend: "-15%" },
    aiGeneratedDescription: "Trucking Nation LLC is a small regional operator with no public presence. Lack of transparency makes verification impossible.",
    trustScore: 31,
    verificationBadge: "❌ Not Verified",
    trendData: [38, 37, 36, 35, 34, 33, 32, 32, 31, 31, 31, 31],
  },
  "Speedy Freight Solutions": {
    general: { name: "Speedy Freight Solutions", taxId: "45-1234567", registrationNumber: "SFS-NV-2018-009", founded: 2018, ceo: "Unknown", headquarters: "Las Vegas, Nevada (alleged)", employees: "10-30", website: "Defunct", stockSymbol: "Private" },
    financial: { stockPrice: "Private", marketCap: "Unknown", revenue: "<$1M", operatingIncome: "Unknown", netIncome: "Unknown", profitMargin: "Unknown", totalAssets: "Unknown", totalLiabilities: "Unknown", shareholderEquity: "Unknown", debtToEquity: "Unknown", peRatio: "N/A", eps: "N/A" },
    controversies: [
      { title: "Wage Theft Confirmed (2023)", summary: "Court-ordered to pay $4,509 in unpaid wages", link: "#", severity: "High" },
      { title: "Deceptive Practices", summary: "Director falsely claimed driver 'never showed up'", link: "#", severity: "High" },
    ],
    exEmployeeRating: { overall: 1.5, workLifeBalance: 1.8, compensation: 1.0, careerGrowth: 1.0, management: 1.2, benefits: 1.0, culture: 1.5, totalReviews: 12, recentTrend: "-60%" },
    aiGeneratedDescription: "Speedy Freight Solutions is a confirmed wage theft operator. A Canadian tribunal ordered them to pay unpaid wages to a driver.",
    trustScore: 28,
    verificationBadge: "❌ Not Verified",
    trendData: [42, 40, 38, 36, 34, 32, 30, 29, 28, 28, 28, 28],
  },
};

// Improved Trend Chart Component
const TrendChart = ({ data, theme, companyName }: { data: number[]; theme: "dark" | "light"; companyName: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxScore = 100;
  const height = 100;
  
  const colors = theme === "dark" 
    ? { bar: "#d4af37", barHover: "#f0c74a", text: "#e2e8f0", textMuted: "#94a3b8", grid: "#334155", label: "#62748c" }
    : { bar: "#b8860b", barHover: "#d4af37", text: "#0f172a", textMuted: "#64748b", grid: "#e2e8f0", label: "#94a3b8" };
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const getBarHeight = (score: number) => (score / maxScore) * height;
  
  // Find min and max for better visualization
  const minScore = Math.min(...data);
  const maxScoreData = Math.max(...data);
  const isImproving = data[data.length - 1] > data[0];
  const isDeclining = data[data.length - 1] < data[0];
  
  return (
    <div style={{ marginTop: "20px", padding: "16px", backgroundColor: theme === "dark" ? "#1F1C18" : "#f8fafc", borderRadius: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>📈</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: colors.text }}>Trust Score Trend</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          backgroundColor: isImproving ? "rgba(34,197,94,0.15)" : isDeclining ? "rgba(239,68,68,0.15)" : "rgba(212,175,55,0.15)",
        }}>
          <span style={{ fontSize: "10px", color: isImproving ? "#22c55e" : isDeclining ? "#ef4444" : "#eab308" }}>
            {isImproving ? "↑ Improving" : isDeclining ? "↓ Declining" : "→ Stable"}
          </span>
        </div>
      </div>
      
      <div style={{ position: "relative", height: `${height + 30}px` }}>
        {/* Grid lines */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 25, pointerEvents: "none" }}>
          {[0, 25, 50, 75, 100].map((line) => (
            <div key={line} style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(1 - line / 100) * height}px`,
              borderTop: `1px solid ${colors.grid}`,
              opacity: 0.3,
            }}>
              <span style={{
                position: "absolute",
                right: -20,
                top: -6,
                fontSize: "8px",
                color: colors.textMuted,
              }}>{line}%</span>
            </div>
          ))}
        </div>
        
        {/* Bars */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: `${height}px`, gap: "3px" }}>
          {data.map((score, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${getBarHeight(score)}px`,
                backgroundColor: hoveredIndex === idx ? colors.barHover : colors.bar,
                borderRadius: "6px 6px 0 0",
                transition: "all 0.2s ease",
                cursor: "pointer",
                position: "relative",
                minWidth: "20px",
                opacity: hoveredIndex === null || hoveredIndex === idx ? 1 : 0.6,
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === idx && (
                <div style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "8px",
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: colors.text,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  border: `1px solid ${colors.bar}`,
                }}>
                  {months[idx]}: {score}%
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Month Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", gap: "3px" }}>
          {months.map((month, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                fontSize: "8px",
                color: colors.label,
                textAlign: "center",
                minWidth: "20px",
                fontWeight: hoveredIndex === idx ? "600" : "400",
              }}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats summary */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginTop: "16px", 
        paddingTop: "12px", 
        borderTop: `1px solid ${colors.grid}`,
        fontSize: "10px",
        color: colors.textMuted,
      }}>
        <div>Start: <strong style={{ color: colors.text }}>{data[0]}%</strong></div>
        <div>Highest: <strong style={{ color: "#22c55e" }}>{maxScoreData}%</strong></div>
        <div>Current: <strong style={{ color: colors.text }}>{data[data.length - 1]}%</strong></div>
        <div style={{ color: isImproving ? "#22c55e" : isDeclining ? "#ef4444" : "#eab308" }}>
          {isImproving ? `▲ +${data[data.length - 1] - data[0]}` : 
           isDeclining ? `▼ ${data[data.length - 1] - data[0]}` : "→ 0"}
        </div>
      </div>
    </div>
  );
};

export default function AuditUI({ theme }: AuditUIProps) {
  const [resumeScanned, setResumeScanned] = useState(false);
  const [viewingCompany, setViewingCompany] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const detailsTopRef = useRef<HTMLDivElement>(null);
  
  // NEW STATES for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");

  useEffect(() => {
    if (viewingCompany && detailsTopRef.current) {
      detailsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [viewingCompany]);

  useEffect(() => {
    const scanned = localStorage.getItem("shavy_resumeScanned");
    setResumeScanned(scanned === "true");
  }, []);

  const colors = {
    dark: {
      cardBg: "#2A2622",
      border: "#3a3a3a",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
      cardHover: "#3a3a3a",
      secondaryBg: "#1F1C18",
      goldAccent: "#d4af37",
    },
    light: {
      cardBg: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      textMuted: "#64748b",
      cardHover: "#f8fafc",
      secondaryBg: "#f1f5f9",
      goldAccent: "#b8860b",
    },
  };

  const currentColors = colors[theme];

  const companies = [
    { name: "Amazon Logistics", score: 94, status: "verified", controversies: 8, finance: 92, employee: 91, type: "good", role: "Director of Operations" },
    { name: "DHL Supply Chain", score: 87, status: "verified", controversies: 12, finance: 85, employee: 84, type: "good", role: "Regional Ops Director" },
    { name: "UPS", score: 91, status: "verified", controversies: 6, finance: 89, employee: 88, type: "good", role: "Operations Director" },
    { name: "FedEx Corp", score: 71, status: "verified", controversies: 28, finance: 68, employee: 72, type: "mid", role: "Operations Manager" },
    { name: "XPO Logistics", score: 58, status: "pending", controversies: 35, finance: 62, employee: 55, type: "mid", role: "Supply Chain Manager" },
    { name: "J.B. Hunt Transport", score: 62, status: "pending", controversies: 22, finance: 65, employee: 58, type: "mid", role: "Operations Supervisor" },
    { name: "Yellow Freight (Defunct)", score: 22, status: "not_verified", controversies: 78, finance: 18, employee: 25, type: "bad", role: "Former Operations Role" },
    { name: "Trucking Nation LLC", score: 31, status: "not_verified", controversies: 65, finance: 28, employee: 32, type: "bad", role: "Logistics Coordinator" },
    { name: "Speedy Freight Solutions", score: 28, status: "not_verified", controversies: 72, finance: 24, employee: 29, type: "bad", role: "Fleet Manager" },
  ];

  // FILTER COMPANIES
  let filteredCompanies = [...companies];
  
  if (searchQuery) {
    filteredCompanies = filteredCompanies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (filterType !== "all") {
    filteredCompanies = filteredCompanies.filter(company => company.type === filterType);
  }
  
  // SORT COMPANIES
  filteredCompanies.sort((a, b) => {
    switch (sortBy) {
      case "score-desc": return b.score - a.score;
      case "score-asc": return a.score - b.score;
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      default: return b.score - a.score;
    }
  });

  const getScoreColor = (score: number) => {
    if (score < 33) return "#ef4444";
    if (score <= 66) return "#eab308";
    return "#22c55e";
  };

  const getStatusText = (status: string) => {
    if (status === "verified") return "✅ Verified";
    if (status === "pending") return "⏳ Pending";
    return "❌ Not Verified";
  };

  const getCompanyDetails = (companyName: string) => {
    if (goodCompaniesDetails[companyName as keyof typeof goodCompaniesDetails]) {
      return goodCompaniesDetails[companyName as keyof typeof goodCompaniesDetails];
    }
    if (midCompaniesDetails[companyName as keyof typeof midCompaniesDetails]) {
      return midCompaniesDetails[companyName as keyof typeof midCompaniesDetails];
    }
    if (badCompaniesDetails[companyName as keyof typeof badCompaniesDetails]) {
      return badCompaniesDetails[companyName as keyof typeof badCompaniesDetails];
    }
    return null;
  };

  const handleViewDetails = (company: any) => {
    const details = getCompanyDetails(company.name);
    if (details) {
      setViewingCompany({ ...company, details });
      setTimeout(() => {
        const scrollContainer = document.querySelector('[style*="overflow-y: auto"]');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        } else {
          window.scrollTo(0, 0);
        }
      }, 10);
    }
  };

  if (!resumeScanned) {
    return (
      <div
        style={{
          backgroundColor: currentColors.cardBg,
          borderRadius: "24px",
          padding: "48px 24px",
          border: `1px solid ${currentColors.border}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "16px", opacity: 0.7 }}>📭</div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, marginBottom: "8px" }}>
          No resume scanned yet
        </h3>
        <p style={{ fontSize: "13px", color: currentColors.textMuted, marginBottom: "24px" }}>
          Upload and scan your resume on the Home tab first
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("switchTab", { detail: "home" }))}
          style={{
            background: "linear-gradient(135deg, #d4af37, #b8860b)",
            border: "none",
            padding: "10px 28px",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "40px",
            color: "#111827",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (viewingCompany) {
    const details = viewingCompany.details;
    
    return (
      <div ref={detailsTopRef}>
        <button
          onClick={() => setViewingCompany(null)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            color: theme === "dark" ? "#94a3b8" : "#6b7280",
            padding: "8px 0",
            marginBottom: "16px",
            transition: "color 0.2s ease, transform 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#d4af37";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme === "dark" ? "#94a3b8" : "#6b7280";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          ← Back
        </button>

        <div
          style={{
            backgroundColor: currentColors.cardBg,
            borderRadius: "24px",
            border: `1px solid ${currentColors.border}`,
            overflow: "hidden",
          }}
        >
          <div style={{
            padding: "20px",
            borderBottom: `1px solid ${currentColors.border}`,
            backgroundColor: currentColors.cardBg,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: currentColors.text }}>
                {viewingCompany.name}
              </h2>
              <span style={{ fontSize: "28px", fontWeight: "800", color: getScoreColor(viewingCompany.score) }}>
                {viewingCompany.score}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: currentColors.textMuted }}>
                {viewingCompany.type === "good" && "🟢 High Match"}
                {viewingCompany.type === "mid" && "🟡 Medium Match"}
                {viewingCompany.type === "bad" && "🔴 Low Match"}
              </span>
              <span style={{ 
                fontSize: "12px", 
                padding: "4px 10px", 
                borderRadius: "20px",
                backgroundColor: details.verificationBadge === "🥇 Gold" ? "rgba(212, 175, 55, 0.15)" : "transparent",
                color: details.verificationBadge === "🥇 Gold" ? "#d4af37" : currentColors.textMuted,
                fontWeight: "500",
              }}>
                {details.verificationBadge === "🥇 Gold" ? "🥇 Gold" : details.verificationBadge}
              </span>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            {/* Improved Trend Chart */}
            {details.trendData && (
              <TrendChart data={details.trendData} theme={theme} companyName={viewingCompany.name} />
            )}
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "24px",
              marginTop: "24px",
              padding: "16px",
              backgroundColor: currentColors.secondaryBg,
              borderRadius: "16px",
            }}>
              <div>
                <div style={{ fontSize: "10px", color: currentColors.textMuted, letterSpacing: "0.5px", marginBottom: "4px" }}>FOUNDED</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.general.founded}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: currentColors.textMuted, letterSpacing: "0.5px", marginBottom: "4px" }}>EMPLOYEES</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.general.employees}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: currentColors.textMuted, letterSpacing: "0.5px", marginBottom: "4px" }}>CEO</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.general.ceo}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: currentColors.textMuted, letterSpacing: "0.5px", marginBottom: "4px" }}>STOCK</div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.general.stockSymbol}</div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ fontSize: "18px" }}>💰</span>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text, margin: 0 }}>Financial Health</h3>
              </div>
              <div style={{
                backgroundColor: currentColors.secondaryBg,
                borderRadius: "16px",
                padding: "16px",
              }}>
                {[
                  { label: "Revenue", value: details.financial.revenue, icon: "📊" },
                  { label: "Net Income", value: details.financial.netIncome, icon: "💵" },
                  { label: "Profit Margin", value: details.financial.profitMargin, icon: "📈" },
                  { label: "Market Cap", value: details.financial.marketCap, icon: "🏦" },
                  { label: "Debt/Equity", value: details.financial.debtToEquity, icon: "⚖️" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < 4 ? "12px" : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px" }}>{item.icon}</span>
                      <span style={{ fontSize: "12px", color: currentColors.textMuted }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: currentColors.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text, margin: 0 }}>Ex-Employee Rating</h3>
              </div>
              <div style={{
                backgroundColor: currentColors.secondaryBg,
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "34px", fontWeight: "800", color: currentColors.goldAccent }}>{details.exEmployeeRating.overall}</span>
                  <span style={{ fontSize: "14px", color: currentColors.textMuted }}>/ 5.0</span>
                </div>
                <div style={{ fontSize: "11px", color: currentColors.textMuted, marginBottom: "16px" }}>
                  Based on {details.exEmployeeRating.totalReviews.toLocaleString()} reviews
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left" }}>
                  <div><div style={{ fontSize: "10px", color: currentColors.textMuted }}>⚖️ Work/Life</div><div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.exEmployeeRating.workLifeBalance}</div></div>
                  <div><div style={{ fontSize: "10px", color: currentColors.textMuted }}>💰 Compensation</div><div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.exEmployeeRating.compensation}</div></div>
                  <div><div style={{ fontSize: "10px", color: currentColors.textMuted }}>📈 Career Growth</div><div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.exEmployeeRating.careerGrowth}</div></div>
                  <div><div style={{ fontSize: "10px", color: currentColors.textMuted }}>👔 Management</div><div style={{ fontSize: "15px", fontWeight: "600", color: currentColors.text }}>{details.exEmployeeRating.management}</div></div>
                </div>
              </div>
            </div>

            {details.controversies && details.controversies.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "18px" }}>⚠️</span>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, margin: 0 }}>Controversies</h3>
                </div>
                {details.controversies.map((c: any, i: number) => (
                  <div key={i} style={{
                    backgroundColor: currentColors.secondaryBg,
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: i < details.controversies.length - 1 ? "10px" : 0,
                    borderLeft: `3px solid ${c.severity === "Critical" ? "#ef4444" : c.severity === "High" ? "#f97316" : "#eab308"}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: currentColors.text }}>{c.title}</span>
                      <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "20px", backgroundColor: c.severity === "Critical" ? "#ef4444" : c.severity === "High" ? "#f97316" : "#eab308", color: "#fff" }}>{c.severity}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: currentColors.textMuted, marginBottom: "8px" }}>{c.summary}</p>
                    <a href={c.link} style={{ fontSize: "10px", color: currentColors.goldAccent, textDecoration: "none" }}>Read more →</a>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ fontSize: "18px" }}>🤖</span>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: currentColors.text, margin: 0 }}>AI Analysis</h3>
              </div>
              <div style={{
                backgroundColor: currentColors.secondaryBg,
                borderRadius: "14px",
                padding: "16px",
                borderLeft: `1px solid ${currentColors.goldAccent}`,
              }}>
                <p style={{ fontSize: "12px", color: currentColors.textMuted, lineHeight: "1.5", margin: 0 }}>
                  {details.aiGeneratedDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-scroll-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Search and Filter Bar */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "4px",
      }}>
        {/* Search Bar with clear button */}
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: theme === "dark" ? "#1F1C18" : "#f8fafc",
          borderRadius: "40px",
          transition: "all 0.2s ease",
        }}>
          <span style={{ fontSize: "16px", marginRight: "8px", opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder=" Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderRadius: "50px",
              padding: "10px 6px",
              color: currentColors.text,
              fontSize: "14px",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                color: currentColors.textMuted,
                padding: "4px",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? "#3a3a3a" : "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter and Sort Row - IMPROVED with Sort Pills */}
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}}>
  {/* Type Filter - Pill Button Style */}
  <div style={{
    display: "flex",
    background: theme === "dark" ? "#1F1C18" : "#f8fafc",
    border: `1px solid ${currentColors.border}`,
    borderRadius: "40px",
    padding: "3px",
    gap: "4px",
  }}>
    {[
      { id: "all", label: "🏢 All" },
      { id: "good", label: "🟢 Good" },
      { id: "mid", label: "🟡 Mid" },
      { id: "bad", label: "🔴 Bad" },
    ].map((option) => (
      <button
        key={option.id}
        onClick={() => setFilterType(option.id)}
        style={{
          padding: "6px 16px",
          borderRadius: "32px",
          fontSize: "12px",
          fontWeight: "500",
          background: filterType === option.id 
            ? `linear-gradient(135deg, ${currentColors.goldAccent}, ${currentColors.goldAccent}80)`
            : "transparent",
          color: filterType === option.id ? "#111827" : currentColors.text,
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (filterType !== option.id) {
            e.currentTarget.style.background = theme === "dark" ? "#3a3a3a" : "#e2e8f0";
          }
        }}
        onMouseLeave={(e) => {
          if (filterType !== option.id) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {option.label}
      </button>
    ))}
  </div>

  {/* Sort By - Pill Buttons for Trust Score & Name */}
  <div style={{
    display: "flex",
    background: theme === "dark" ? "#1F1C18" : "#f8fafc",
    border: `1px solid ${currentColors.border}`,
    borderRadius: "40px",
    padding: "3px",
    gap: "4px",
  }}>
    {[
      { id: "score-desc", label: " Trust Ascending" },
      { id: "score-asc", label: " Trust Descending" },
      { id: "name-asc", label: " Name Ascending" },
      { id: "name-desc", label: " Name Descending" },
    ].map((option) => (
      <button
        key={option.id}
        onClick={() => setSortBy(option.id)}
        style={{
          padding: "6px 14px",
          borderRadius: "32px",
          fontSize: "11px",
          fontWeight: "500",
          background: sortBy === option.id 
            ? `linear-gradient(135deg, ${currentColors.goldAccent}, ${currentColors.goldAccent}80)`
            : "transparent",
          color: sortBy === option.id ? "#111827" : currentColors.text,
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (sortBy !== option.id) {
            e.currentTarget.style.background = theme === "dark" ? "#3a3a3a" : "#e2e8f0";
          }
        }}
        onMouseLeave={(e) => {
          if (sortBy !== option.id) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>
      </div>

      {/* Results Count */}
      <p style={{
        fontSize: "11px",
        color: currentColors.textMuted,
        paddingLeft: "4px",
        marginTop: "4px",
      }}>
        Found {filteredCompanies.length} company{filteredCompanies.length !== 1 ? 'ies' : ''}
      </p>
      
      {/* Companies List */}
      {filteredCompanies.map((company, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: currentColors.cardBg,
            borderRadius: "20px",
            padding: "18px",
            border: `1px solid ${hoveredCard === idx ? currentColors.goldAccent : currentColors.border}`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            transform: hoveredCard === idx ? "translateY(-3px)" : "translateY(0)",
            boxShadow: hoveredCard === idx
              ? `0 0 0 2px ${currentColors.goldAccent}40, 0 8px 16px -4px rgba(0,0,0,0.3)`
              : "none",
          }}
          onMouseEnter={() => setHoveredCard(idx)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: currentColors.text, letterSpacing: "-0.3px" }}>
                {company.name}
              </h2>
              <div style={{ fontSize: "12px", color: currentColors.textMuted, marginTop: "4px" }}>
                {company.type === "good" && "🟢 High Match"}
                {company.type === "mid" && "🟡 Medium Match"}
                {company.type === "bad" && "🔴 Low Match"}
                <span style={{ marginLeft: "8px" }}>• {company.role}</span>
              </div>
            </div>
            <span style={{ fontSize: "26px", fontWeight: "800", color: getScoreColor(company.score) }}>
              {company.score}%
            </span>
          </div>

          <div style={{
            fontSize: "12px",
            color: currentColors.textMuted,
            marginBottom: "16px",
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            backgroundColor: theme === "dark" ? "#3a3a3a" : "#f1f5f9",
          }}>
            {getStatusText(company.status)}
          </div>

          {[
            { label: "Controversies", value: company.controversies, color: "#ef4444" },
            { label: "Financial Health", value: company.finance, color: "#eab308" },
            { label: "Ex-Employee Rating", value: company.employee, color: "#22c55e" },
          ].map((metric, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? "14px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "500", color: currentColors.textMuted, marginBottom: "6px" }}>
                <span>{metric.label}</span>
                <span style={{ color: currentColors.text, fontWeight: "600" }}>{metric.value}%</span>
              </div>
              <div style={{ height: "6px", backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${metric.value}%`, height: "100%", backgroundColor: metric.color, borderRadius: "10px" }} />
              </div>
            </div>
          ))}

          <button
            onClick={() => handleViewDetails(company)}
            style={{
              background: "transparent",
              border: `1px solid ${theme === "dark" ? "#d4af37" : "#b8860b"}40`,
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "500",
              borderRadius: "30px",
              color: currentColors.goldAccent,
              cursor: "pointer",
              marginTop: "8px",
              transition: "all 0.2s ease",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(212, 175, 55, 0.1)`;
              e.currentTarget.style.border = `1px solid ${currentColors.goldAccent}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.border = `1px solid ${theme === "dark" ? "#d4af37" : "#b8860b"}40`;
            }}
          >
            View Details →
          </button>
        </div>
      ))}

      {/* No results message */}
      {filteredCompanies.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: currentColors.cardBg,
          borderRadius: "20px",
          border: `1px solid ${currentColors.border}`,
        }}>
          <span style={{ fontSize: "48px", opacity: 0.5 }}>🔍</span>
          <p style={{ fontSize: "14px", color: currentColors.textMuted, marginTop: "12px" }}>
            No companies found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setSortBy("score-desc");
            }}
            style={{
              marginTop: "16px",
              background: "transparent",
              border: `1px solid ${currentColors.goldAccent}`,
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "12px",
              color: currentColors.goldAccent,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}