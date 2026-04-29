"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ResumeBuilderProps {
  theme: "dark" | "light";
  onBack: () => void;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

const SectionCard = ({ title, icon, children, colors }: any) => (
  <div
    style={{
      backgroundColor: colors.cardBg,
      borderRadius: "14px",
      padding: "16px",
      border: `1px solid ${colors.border}`,
      marginBottom: "16px",
      transition: "all 0.2s ease",
    }}
  >
    <h3
      style={{
        fontSize: "15px",
        fontWeight: "600",
        color: colors.text,
        marginBottom: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

export default function ResumeBuilder({ theme, onBack }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [isDownloading, setIsDownloading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Personal Info
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [workCompany, setWorkCompany] = useState("");
  const [workPosition, setWorkPosition] = useState("");
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [workCurrent, setWorkCurrent] = useState(false);

  // Education
  const [educations, setEducations] = useState<Education[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showCertForm, setShowCertForm] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  useEffect(() => {
    const savedSkills = JSON.parse(localStorage.getItem("shavy_skills") || "[]");
    if (savedSkills.length > 0) setSkills(savedSkills);
    
    const savedCerts = JSON.parse(localStorage.getItem("shavy_extracted_certifications") || "[]");
    if (savedCerts.length > 0) {
      setCertifications(savedCerts.map((cert: string, i: number) => ({
        id: Date.now().toString() + i,
        name: cert,
        issuer: "",
      })));
    }
    
    const savedName = localStorage.getItem("shavy_extracted_name") || "";
    const savedEmail = localStorage.getItem("shavy_extracted_email") || "";
    const savedPhone = localStorage.getItem("shavy_extracted_phone") || "";
    const savedAddress = localStorage.getItem("shavy_extracted_address") || "";
    const savedExperience = localStorage.getItem("shavy_extracted_experience") || "";
    const savedEducation = localStorage.getItem("shavy_extracted_education") || "";
    
    if (savedName) setFullName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
    if (savedAddress) setAddress(savedAddress);
    if (savedExperience) setSummary(savedExperience);
    if (savedEducation) {
      setEducations([{
        id: Date.now().toString(),
        institution: savedEducation.split(",")[0] || "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      }]);
    }
  }, []);

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            bg: "#1F1C18",
            cardBg: "#2A2622",
            border: "#3d3a35",
            text: "#e2e8f0",
            textMuted: "#94a3b8",
            gold: "#d4af37",
            inputBg: "#29241d",
            inputBorder: "#3d3a35",
            accent: "#d4af37",
            cardHover: "#342e26",
          }
        : {
            bg: "#f0f2f5",
            cardBg: "#ffffff",
            border: "#e2e8f0",
            text: "#1a202c",
            textMuted: "#64748b",
            gold: "#d4af37",
            inputBg: "#ffffff",
            inputBorder: "#e2e8f0",
            accent: "#d4af37",
            cardHover: "#f8f9fa",
          },
    [theme]
  );

  const inputStyle = useMemo(
    () => ({
      width: "100%",
      padding: "10px 12px",
      borderRadius: "10px",
      border: `1px solid ${colors.inputBorder}`,
      background: colors.inputBg,
      color: colors.text,
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box" as const,
      transition: "all 0.2s ease",
    }),
    [colors]
  );

  const textareaStyle = useMemo(
    () => ({
      ...inputStyle,
      resize: "none" as const,
      fontFamily: "inherit",
      minHeight: "100px",
    }),
    [inputStyle]
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "80px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = theme === "dark" ? "#2A2622" : "#ffffff";
    toast.style.color = colors.gold;
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "40px";
    toast.style.fontSize = "12px";
    toast.style.zIndex = "300";
    toast.style.border = `1px solid ${colors.border}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const fillDemoData = () => {
    setFullName("Sarah Michelle Johnson");
    setTitle("Senior Product Manager");
    setEmail("sarah.johnson@example.com");
    setPhone("(555) 123-4567");
    setAddress("San Francisco, CA");
    setLinkedin("linkedin.com/in/sarahjohnson");
    setSummary("Results-driven Product Manager with 8+ years of experience in SaaS and e-commerce. Led cross-functional teams to launch successful products generating $15M+ in revenue. Expert in Agile methodologies and data-driven decision making.");
    setProfilePhoto("/baji.jpg");
    
    setSkills(["Product Strategy", "Agile/Scrum", "User Research", "Data Analytics", "Roadmap Planning", "Stakeholder Management"]);
    
    setWorkExperiences([
      {
        id: Date.now().toString(),
        company: "TechCorp Inc.",
        position: "Senior Product Manager",
        startDate: "Jan 2021",
        endDate: "Present",
        description: "Led product strategy for flagship platform, increasing user engagement by 45%. Managed roadmap for 3 product lines.",
        current: true,
      },
      {
        id: (Date.now() + 1).toString(),
        company: "StartupX",
        position: "Product Manager",
        startDate: "Jun 2018",
        endDate: "Dec 2020",
        description: "Launched MVP that acquired 50,000 users in first 6 months. Defined product requirements and prioritized features.",
        current: false,
      },
    ]);
    
    setEducations([
      {
        id: Date.now().toString(),
        institution: "Stanford University",
        degree: "MBA",
        field: "Product Management",
        startDate: "2014",
        endDate: "2016",
      },
      {
        id: (Date.now() + 1).toString(),
        institution: "UC Berkeley",
        degree: "BS",
        field: "Computer Science",
        startDate: "2010",
        endDate: "2014",
      },
    ]);
    
    setCertifications([
      { id: Date.now().toString(), name: "Certified Scrum Product Owner", issuer: "Scrum Alliance" },
      { id: (Date.now() + 1).toString(), name: "Google Project Management", issuer: "Google" },
    ]);
    
    setProjects([
      {
        id: Date.now().toString(),
        name: "AI Analytics Dashboard",
        technologies: "React, Python, TensorFlow",
        description: "Built analytics platform that reduced customer churn by 25%.",
      },
    ]);
    
    showToast("✅ Demo data loaded!");
  };

  const clearAllData = () => {
    setFullName("");
    setTitle("");
    setEmail("");
    setPhone("");
    setAddress("");
    setLinkedin("");
    setSummary("");
    setSkills([]);
    setWorkExperiences([]);
    setEducations([]);
    setCertifications([]);
    setProjects([]);
    setProfilePhoto(null);
    showToast("🗑️ All data cleared");
  };

  const setToPresent = () => {
    setWorkEnd("Present");
    setWorkCurrent(true);
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    
    const element = document.createElement("div");
    element.innerHTML = generateResumeHTML();
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.top = "-9999px";
    element.style.width = "800px";
    element.style.padding = "30px";
    element.style.backgroundColor = "#ffffff";
    element.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    document.body.appendChild(element);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2.5,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`${fullName.replace(/\s/g, "_") || "resume"}.pdf`);
      showToast("✅ Resume downloaded!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast("❌ Failed to generate PDF");
    }
    
    document.body.removeChild(element);
    setIsDownloading(false);
  };

  // Add/Remove functions
  const addSkill = useCallback(() => {
    if (!skillInput.trim()) return;
    setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput("");
  }, [skillInput]);

  const removeSkill = useCallback((index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addWork = useCallback(() => {
    if (!workCompany || !workPosition) return;
    setWorkExperiences((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        company: workCompany,
        position: workPosition,
        startDate: workStart,
        endDate: workCurrent ? "Present" : workEnd,
        description: workDesc,
        current: workCurrent,
      },
    ]);
    setWorkCompany("");
    setWorkPosition("");
    setWorkStart("");
    setWorkEnd("");
    setWorkDesc("");
    setWorkCurrent(false);
    setShowWorkForm(false);
    showToast("✅ Work experience added");
  }, [workCompany, workPosition, workStart, workEnd, workDesc, workCurrent]);

  const removeWork = useCallback((id: string) => {
    setWorkExperiences((prev) => prev.filter((w) => w.id !== id));
    showToast("🗑️ Work experience removed");
  }, []);

  const addEducation = useCallback(() => {
    if (!eduInstitution) return;
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        institution: eduInstitution,
        degree: eduDegree,
        field: eduField,
        startDate: eduStart,
        endDate: eduEnd,
      },
    ]);
    setEduInstitution("");
    setEduDegree("");
    setEduField("");
    setEduStart("");
    setEduEnd("");
    setShowEduForm(false);
    showToast("✅ Education added");
  }, [eduInstitution, eduDegree, eduField, eduStart, eduEnd]);

  const removeEducation = useCallback((id: string) => {
    setEducations((prev) => prev.filter((e) => e.id !== id));
    showToast("🗑️ Education removed");
  }, []);

  const addCertification = useCallback(() => {
    if (!certName) return;
    setCertifications((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: certName,
        issuer: certIssuer,
      },
    ]);
    setCertName("");
    setCertIssuer("");
    setShowCertForm(false);
    showToast("✅ Certification added");
  }, [certName, certIssuer]);

  const removeCertification = useCallback((id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    showToast("🗑️ Certification removed");
  }, []);

  const addProject = useCallback(() => {
    if (!projectName) return;
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: projectName,
        technologies: projectTech,
        description: projectDesc,
      },
    ]);
    setProjectName("");
    setProjectTech("");
    setProjectDesc("");
    setShowProjectForm(false);
    showToast("✅ Project added");
  }, [projectName, projectTech, projectDesc]);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast("🗑️ Project removed");
  }, []);

  const generateResumeHTML = () => {
    const skillsHtml = skills.map((s) => `<span class="skill-tag">${s}</span>`).join("");
    const workHtml = workExperiences.map((w) => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title"><h3>${w.position}</h3><div class="company">${w.company}</div></div>
          <div class="date">${w.startDate} - ${w.endDate}</div>
        </div>
        <p class="work-description">${w.description}</p>
      </div>
    `).join("");
    const eduHtml = educations.map((e) => `
      <div class="edu-item">
        <div class="edu-header">
          <div class="edu-title"><h3>${e.degree}${e.field ? ` in ${e.field}` : ""}</h3><div class="institution">${e.institution}</div></div>
          <div class="date">${e.startDate} - ${e.endDate}</div>
        </div>
      </div>
    `).join("");
    const certsHtml = certifications.map((c) => `<div class="cert-item">• ${c.name}${c.issuer ? ` (${c.issuer})` : ""}</div>`).join("");
    const projectsHtml = projects.map((p) => `
      <div class="project-item">
        <div class="project-header"><h3>${p.name}</h3>${p.technologies ? `<div class="tech-stack">${p.technologies}</div>` : ""}</div>
        <p class="project-description">${p.description}</p>
      </div>
    `).join("");
    const photoHtml = profilePhoto ? `<img src="${profilePhoto}" alt="Profile" class="profile-photo"/>` : '';

    // PROFESSIONAL TEMPLATE
    const professionalTemplate = `<!DOCTYPE html>
<html>
<head><title>${fullName || "Resume"} - Professional Resume</title>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; padding: 30px; }
  .resume { max-width: 800px; margin: 0 auto; background: white; }
  .header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #d4af37; }
  .profile-photo { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #d4af37; }
  .name { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 5px; }
  .job-title { font-size: 14px; color: #d4af37; font-weight: 500; margin-bottom: 8px; }
  .contact-info { display: flex; flex-wrap: wrap; gap: 15px; font-size: 11px; color: #666; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 16px; font-weight: 700; color: #1a1a2e; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 12px; }
  .summary-text { font-size: 12px; line-height: 1.5; text-align: justify; }
  .skills-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
  .skill-tag { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; color: #333; }
  .work-item, .edu-item, .project-item { margin-bottom: 16px; }
  .work-header, .edu-header { display: flex; justify-content: space-between; margin-bottom: 5px; flex-wrap: wrap; }
  .work-title h3, .edu-title h3, .project-item h3 { font-size: 14px; font-weight: 700; color: #1a1a2e; }
  .company, .institution { font-size: 12px; color: #666; margin-top: 2px; }
  .date { font-size: 11px; color: #888; }
  .work-description, .project-description { font-size: 12px; line-height: 1.45; color: #444; margin-top: 6px; }
  .cert-item { font-size: 12px; margin-bottom: 5px; color: #444; }
  .tech-stack { font-size: 10px; color: #d4af37; margin-top: 3px; font-weight: 500; }
</style>
</head>
<body>
<div class="resume">
  <div class="header">${photoHtml ? `<div>${photoHtml}</div>` : ""}<div><div class="name">${fullName || "Your Name"}</div><div class="job-title">${title || "Professional Title"}</div><div class="contact-info"><span>✉️ ${email || "email@example.com"}</span><span>📱 ${phone || "(000) 000-0000"}</span><span>📍 ${address || "City, State"}</span>${linkedin ? `<span>🔗 ${linkedin}</span>` : ""}</div></div></div>
  ${summary ? `<div class="section"><div class="section-title">Summary</div><div class="summary-text">${summary}</div></div>` : ""}
  ${workExperiences.length ? `<div class="section"><div class="section-title">Experience</div>${workHtml}</div>` : ""}
  ${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projectsHtml}</div>` : ""}
  ${educations.length ? `<div class="section"><div class="section-title">Education</div>${eduHtml}</div>` : ""}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-container">${skillsHtml}</div></div>` : ""}
  ${certifications.length ? `<div class="section"><div class="section-title">Certifications</div><div>${certsHtml}</div></div>` : ""}
</div>
</body>
</html>`;

    // MODERN TEMPLATE
    const modernTemplate = `<!DOCTYPE html>
<html>
<head><title>${fullName || "Resume"} - Modern Resume</title>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 30px; }
  .resume { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
  .accent-bar { height: 4px; background: #d4af37; }
  .header { padding: 20px 25px; background: white; text-align: center; }
  .profile-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; border: 3px solid #d4af37; }
  .name { font-size: 26px; font-weight: 600; color: #1a1a2e; margin-bottom: 5px; }
  .job-title { font-size: 14px; color: #d4af37; font-weight: 500; margin-bottom: 10px; }
  .contact-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #666; }
  .content { padding: 20px 25px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 15px; font-weight: 600; color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 3px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .summary-text { font-size: 12px; line-height: 1.5; }
  .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: #fef3c7; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; color: #d4af37; }
  .work-item, .edu-item, .project-item { margin-bottom: 16px; }
  .work-header, .edu-header { display: flex; justify-content: space-between; margin-bottom: 5px; flex-wrap: wrap; }
  .work-title h3, .edu-title h3, .project-item h3 { font-size: 14px; font-weight: 600; color: #1a1a2e; }
  .company, .institution { font-size: 12px; color: #666; }
  .date { font-size: 11px; color: #888; }
  .work-description, .project-description { font-size: 12px; line-height: 1.45; margin-top: 5px; }
  .cert-item { font-size: 12px; margin-bottom: 5px; }
</style>
</head>
<body>
<div class="resume"><div class="accent-bar"></div>
<div class="header">${photoHtml ? `<div>${photoHtml}</div>` : ""}<div class="name">${fullName || "Your Name"}</div><div class="job-title">${title || "Professional Title"}</div><div class="contact-info"><span>✉️ ${email || "email@example.com"}</span><span>📱 ${phone || "(000) 000-0000"}</span><span>📍 ${address || "City, State"}</span></div></div>
<div class="content">
  ${summary ? `<div class="section"><div class="section-title">Summary</div><div class="summary-text">${summary}</div></div>` : ""}
  ${workExperiences.length ? `<div class="section"><div class="section-title">Experience</div>${workHtml}</div>` : ""}
  ${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projectsHtml}</div>` : ""}
  ${educations.length ? `<div class="section"><div class="section-title">Education</div>${eduHtml}</div>` : ""}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-container">${skillsHtml}</div></div>` : ""}
  ${certifications.length ? `<div class="section"><div class="section-title">Certifications</div><div>${certsHtml}</div></div>` : ""}
</div>
</div>
</body>
</html>`;

    // MINIMAL TEMPLATE
    const minimalTemplate = `<!DOCTYPE html>
<html>
<head><title>${fullName || "Resume"} - Minimal Resume</title>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', 'Times New Roman', serif; background: white; padding: 40px; }
  .resume { max-width: 700px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 25px; }
  .profile-photo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; }
  .name { font-size: 28px; font-weight: normal; letter-spacing: 1px; margin-bottom: 5px; }
  .job-title { font-size: 13px; color: #555; font-style: italic; margin-bottom: 10px; }
  .contact-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; font-size: 11px; color: #777; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 15px; font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 10px; padding-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
  .summary-text { font-size: 12px; line-height: 1.5; text-align: justify; }
  .skills-container { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { font-size: 11px; color: #444; border-right: 1px solid #ccc; padding-right: 8px; }
  .skill-tag:last-child { border-right: none; }
  .work-item, .edu-item { margin-bottom: 15px; }
  .work-header, .edu-header { display: flex; justify-content: space-between; margin-bottom: 4px; flex-wrap: wrap; }
  .work-title h3, .edu-title h3 { font-size: 13px; font-weight: bold; }
  .company, .institution { font-size: 11px; font-style: italic; color: #555; }
  .date { font-size: 10px; color: #888; }
  .work-description { font-size: 11px; line-height: 1.4; margin-top: 4px; }
  .project-item { margin-bottom: 12px; }
  .project-item h3 { font-size: 13px; font-weight: bold; margin-bottom: 3px; }
  .project-description { font-size: 11px; margin-top: 3px; }
  .tech-stack { font-size: 10px; color: #888; margin-top: 2px; }
  .cert-item { font-size: 11px; margin-bottom: 4px; }
</style>
</head>
<body>
<div class="resume">
  <div class="header">${photoHtml ? `<div>${photoHtml}</div>` : ""}<div class="name">${fullName || "Your Name"}</div><div class="job-title">${title || "Professional Title"}</div><div class="contact-info"><span>${email || "email@example.com"}</span><span>${phone || "(000) 000-0000"}</span><span>${address || "City, State"}</span></div></div>
  ${summary ? `<div class="section"><div class="section-title">Summary</div><div class="summary-text">${summary}</div></div>` : ""}
  ${workExperiences.length ? `<div class="section"><div class="section-title">Experience</div>${workHtml}</div>` : ""}
  ${projects.length ? `<div class="section"><div class="section-title">Projects</div>${projectsHtml}</div>` : ""}
  ${educations.length ? `<div class="section"><div class="section-title">Education</div>${eduHtml}</div>` : ""}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-container">${skillsHtml}</div></div>` : ""}
  ${certifications.length ? `<div class="section"><div class="section-title">Certifications</div><div>${certsHtml}</div></div>` : ""}
</div>
</body>
</html>`;

    const templates: Record<string, string> = {
      professional: professionalTemplate,
      modern: modernTemplate,
      minimal: minimalTemplate,
    };
    
    return templates[selectedTemplate] || templates.professional;
  };

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "16px",
        backgroundColor: colors.bg,
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  }}
>
  {/* Back button - LEFT SIDE */}
  <button
    onClick={() => {
      window.dispatchEvent(new CustomEvent("switchTab", { detail: "home" }));
      onBack();
    }}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      color: colors.textMuted,
      padding: "8px 12px",
      borderRadius: "10px",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = colors.gold;
      e.currentTarget.style.transform = "translateX(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = colors.textMuted;
      e.currentTarget.style.transform = "translateX(0)";
    }}
  >
    ← Back
  </button>

  {/* Action buttons - RIGHT SIDE - marginLeft: auto pushes to far right */}
  <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
    <button
      onClick={clearAllData}
      style={{
        background: "transparent",
        border: `1px solid ${colors.gold}`,
        padding: "8px 16px",
        borderRadius: "30px",
        fontSize: "12px",
        color: colors.gold,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.gold}10`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      Clear All
    </button>
    
    <button
      onClick={fillDemoData}
      style={{
        background: "transparent",
        border: `1px solid ${colors.gold}`,
        padding: "8px 16px",
        borderRadius: "30px",
        fontSize: "12px",
        fontWeight: "500",
        color: colors.gold,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.gold}15`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      ⚡ Demo
    </button>
    
    <button
      onClick={downloadAsPDF}
      disabled={isDownloading}
      style={{
        background: "transparent",
        border: `1px solid ${colors.gold}`,
        padding: "8px 20px",
        borderRadius: "30px",
        fontSize: "13px",
        fontWeight: "600",
        color: colors.gold,
        cursor: isDownloading ? "wait" : "pointer",
        opacity: isDownloading ? 0.7 : 1,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.gold}15`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {isDownloading ? "⏳" : "📥 PDF"}
    </button>
  </div>
</div>

      <h1 style={{ fontSize: "22px", fontWeight: "700", color: colors.text, marginBottom: "4px" }}>
        Resume Builder
      </h1>
      <p style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "20px" }}>
        Create a professional resume that stands out
      </p>

      {/* Photo Upload */}
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          padding: "14px",
          border: `1px solid ${colors.border}`,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${colors.gold}`,
              }}
            />
          ) : (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: `${colors.gold}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              📸
            </div>
          )}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "500", color: colors.text }}>Profile Photo</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>Add a professional photo</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: "transparent",
              border: `1px solid ${colors.gold}`,
              padding: "6px 14px",
              borderRadius: "25px",
              fontSize: "11px",
              color: colors.gold,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.gold}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Upload
          </button>
          {profilePhoto && (
            <button
              onClick={() => setProfilePhoto(null)}
              style={{
                background: "transparent",
                border: `1px solid ${colors.border}`,
                padding: "6px 14px",
                borderRadius: "25px",
                fontSize: "11px",
                color: colors.textMuted,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Template Selector */}
      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          padding: "12px",
          border: `1px solid ${colors.border}`,
          marginBottom: "20px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: colors.text, marginBottom: "12px" }}>
          Choose Template
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[
            { id: "professional", name: "Professional", icon: "💼", desc: "Standard business" },
            { id: "modern", name: "Modern", icon: "✨", desc: "Clean & stylish" },
            { id: "minimal", name: "Minimal", icon: "📄", desc: "Simple & elegant" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: selectedTemplate === t.id ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
                background: selectedTemplate === t.id ? `${colors.gold}10` : colors.cardBg,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{t.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: selectedTemplate === t.id ? "600" : "500", color: colors.text }}>
                {t.name}
              </div>
              <div style={{ fontSize: "10px", color: colors.textMuted }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Personal Information Section */}
      <SectionCard title="Personal Information" icon="👤" colors={colors}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Professional Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
        </div>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />
        <input
          type="text"
          placeholder="LinkedIn URL"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          style={{ ...inputStyle, marginTop: "10px" }}
        />
        <textarea
          placeholder="Professional Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          style={{ ...textareaStyle, marginTop: "10px" }}
        />
      </SectionCard>

      {/* Skills Section */}
      <SectionCard title="Skills" icon="🛠️" colors={colors}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {skills.map((s, i) => (
            <span
              key={i}
              style={{
                background: `${colors.gold}15`,
                padding: "6px 12px",
                borderRadius: "25px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: colors.text,
              }}
            >
              {s}
              <button
                onClick={() => removeSkill(i)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "14px" }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Add a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            style={{ flex: 1, ...inputStyle }}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
          />
          <button
            onClick={addSkill}
            style={{
              background: colors.gold,
              border: "none",
              padding: "0 16px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#111827",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </SectionCard>

      {/* Work Experience Section */}
      <SectionCard title="Work Experience" icon="💼" colors={colors}>
        {workExperiences.map((w) => (
          <div
            key={w.id}
            style={{
              marginBottom: "12px",
              padding: "12px",
              background: `${colors.gold}08`,
              borderRadius: "10px",
              border: `1px solid ${colors.gold}20`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "14px", color: colors.text }}>{w.position}</strong>
                <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "2px" }}>{w.company}</div>
                <div style={{ fontSize: "10px", color: colors.textMuted, marginTop: "2px" }}>{w.startDate} - {w.endDate}</div>
              </div>
              <button onClick={() => removeWork(w.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px" }}>🗑️</button>
            </div>
          </div>
        ))}
        {!showWorkForm ? (
          <button
            onClick={() => setShowWorkForm(true)}
            style={{
              background: "transparent",
              border: `1px dashed ${colors.gold}`,
              padding: "10px",
              borderRadius: "10px",
              fontSize: "12px",
              color: colors.gold,
              cursor: "pointer",
              width: "100%",
            }}
          >
            + Add Work Experience
          </button>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <input type="text" placeholder="Job Title" value={workPosition} onChange={(e) => setWorkPosition(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <input type="text" placeholder="Company" value={workCompany} onChange={(e) => setWorkCompany(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input type="text" placeholder="Start Date" value={workStart} onChange={(e) => setWorkStart(e.target.value)} style={inputStyle} />
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="End Date" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} style={{ flex: 1, ...inputStyle }} />
                <button
                  onClick={setToPresent}
                  style={{
                    background: `${colors.gold}15`,
                    border: `1px solid ${colors.gold}`,
                    padding: "0 12px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: colors.gold,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Present
                </button>
              </div>
            </div>
            <textarea placeholder="Description" value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} rows={2} style={{ ...textareaStyle, marginBottom: "8px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={addWork} style={{ background: colors.gold, border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Add</button>
              <button onClick={() => setShowWorkForm(false)} style={{ background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Education Section */}
      <SectionCard title="Education" icon="🎓" colors={colors}>
        {educations.map((e) => (
          <div key={e.id} style={{ marginBottom: "12px", padding: "12px", background: `${colors.gold}08`, borderRadius: "10px", border: `1px solid ${colors.gold}20` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <strong style={{ fontSize: "14px", color: colors.text }}>{e.degree || "Degree"}</strong>
                <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "2px" }}>{e.institution}</div>
                <div style={{ fontSize: "10px", color: colors.textMuted, marginTop: "2px" }}>{e.startDate} - {e.endDate}</div>
              </div>
              <button onClick={() => removeEducation(e.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px" }}>🗑️</button>
            </div>
          </div>
        ))}
        {!showEduForm ? (
          <button onClick={() => setShowEduForm(true)} style={{ background: "transparent", border: `1px dashed ${colors.gold}`, padding: "10px", borderRadius: "10px", fontSize: "12px", color: colors.gold, cursor: "pointer", width: "100%" }}>+ Add Education</button>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <input type="text" placeholder="Institution" value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <input type="text" placeholder="Degree" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <input type="text" placeholder="Field of Study" value={eduField} onChange={(e) => setEduField(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <input type="text" placeholder="Start Year" value={eduStart} onChange={(e) => setEduStart(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="End Year" value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={addEducation} style={{ background: colors.gold, border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Add</button>
              <button onClick={() => setShowEduForm(false)} style={{ background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Certifications Section */}
      <SectionCard title="Certifications" icon="📜" colors={colors}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {certifications.map((c) => (
            <span key={c.id} style={{ background: `${colors.gold}15`, padding: "6px 12px", borderRadius: "25px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", color: colors.text }}>
              {c.name}
              <button onClick={() => removeCertification(c.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "14px" }}>×</button>
            </span>
          ))}
        </div>
        {!showCertForm ? (
          <button onClick={() => setShowCertForm(true)} style={{ background: "transparent", border: `1px dashed ${colors.gold}`, padding: "10px", borderRadius: "10px", fontSize: "12px", color: colors.gold, cursor: "pointer", width: "100%" }}>+ Add Certification</button>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <input type="text" placeholder="Certification Name" value={certName} onChange={(e) => setCertName(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <input type="text" placeholder="Issuing Org" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={addCertification} style={{ background: colors.gold, border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Add</button>
              <button onClick={() => setShowCertForm(false)} style={{ background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Projects Section */}
      <SectionCard title="Projects" icon="🚀" colors={colors}>
        {projects.map((p) => (
          <div key={p.id} style={{ marginBottom: "12px", padding: "12px", background: `${colors.gold}08`, borderRadius: "10px", border: `1px solid ${colors.gold}20` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "14px", color: colors.text }}>{p.name}</strong>
                {p.technologies && <div style={{ fontSize: "10px", color: colors.gold, marginTop: "2px" }}>{p.technologies}</div>}
              </div>
              <button onClick={() => removeProject(p.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px" }}>🗑️</button>
            </div>
          </div>
        ))}
        {!showProjectForm ? (
          <button onClick={() => setShowProjectForm(true)} style={{ background: "transparent", border: `1px dashed ${colors.gold}`, padding: "10px", borderRadius: "10px", fontSize: "12px", color: colors.gold, cursor: "pointer", width: "100%" }}>+ Add Project</button>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <input type="text" placeholder="Technologies" value={projectTech} onChange={(e) => setProjectTech(e.target.value)} style={{ ...inputStyle, marginBottom: "8px" }} />
            <textarea placeholder="Description" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} rows={2} style={{ ...textareaStyle, marginBottom: "8px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={addProject} style={{ background: colors.gold, border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Add</button>
              <button onClick={() => setShowProjectForm(false)} style={{ background: "transparent", border: `1px solid ${colors.border}`, padding: "8px 16px", borderRadius: "10px", fontSize: "12px", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </SectionCard>

      <p style={{ fontSize: "10px", color: colors.textMuted, textAlign: "center", marginTop: "16px" }}>
        💡 Fill in your details, then click "PDF" to download your resume
      </p>
    </div>
  );
}