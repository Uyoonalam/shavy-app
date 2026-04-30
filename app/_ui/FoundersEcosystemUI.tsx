"use client";

import { useState, useEffect, useRef } from "react";

interface Founder {
  id: number;
  name: string;
  role: string;
  company: string;
  industries: string[];
  location: string;
  bio: string;
  longBio?: string;
  avatarInitials: string;
  avatarColor: string;
  image?: string;
  founded?: string;
  portfolio?: string[];
  investmentInterests?: string[];
  posts?: Post[];
  founderSpecificResponses?: Record<string, string>;
  verified?: boolean;
  topFounder?: boolean;
  awardWinner?: boolean;
  followers?: number;
}

interface Post {
  id: number;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  likedByUser?: boolean;
  dislikedByUser?: boolean;
  comments: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
  avatarInitials?: string;
  isEditing?: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "founder";
  timestamp: Date;
  seen?: boolean;
  reaction?: "👍" | "❤️" | "😂" | "🎉" | null;
  isEditing?: boolean;
}

interface ChatHistory {
  founderId: number;
  messages: Message[];
}

interface FoundersEcosystemUIProps {
  theme: "dark" | "light";
  onBack: () => void;
}

export default function FoundersEcosystemUI({ theme, onBack }: FoundersEcosystemUIProps) {
  // ========== ALL useState HOOKS FIRST ==========
  const [activeTab, setActiveTab] = useState<"discover" | "network" | "posts" | "chat">("discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [sortBy, setSortBy] = useState<"name" | "recent" | "connections">("name");
  const [locationFilter, setLocationFilter] = useState<"all" | "near">("all");
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [pendingConnectId, setPendingConnectId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingDisconnectId, setPendingDisconnectId] = useState<number | null>(null);
  const [activePostTab, setActivePostTab] = useState<"all" | "following">("all");
  const [expandedComments, setExpandedComments] = useState<{ postId: number; founderId: number } | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<{ commentId: number; postId: number; founderId: number; text: string } | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isFounderTyping, setIsFounderTyping] = useState(false);
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null);
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [showPresets, setShowPresets] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(30);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  let particleId = 0;

  // ========== ALL useEffect HOOKS ==========
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isFounderTyping, isTypingResponse, displayedResponse]);

  // Load data from localStorage - runs once on mount
  useEffect(() => {
    console.log("Loading data from localStorage...");
    
    const savedConnections = localStorage.getItem("shavy_connected_founders");
    if (savedConnections) {
      try {
        const parsed = JSON.parse(savedConnections);
        setConnectedIds(parsed.ids || []);
        setConnectedCount(parsed.count || 0);
      } catch (e) {}
    }
    
    const savedFollowing = localStorage.getItem("shavy_following_founders");
    if (savedFollowing) {
      try {
        setFollowingIds(JSON.parse(savedFollowing));
      } catch (e) {}
    }
    
    const savedChats = localStorage.getItem("shavy_chat_histories");
    if (savedChats) {
      try {
        setChatHistories(JSON.parse(savedChats));
      } catch (e) {}
    }
    
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("shavy_connected_founders", JSON.stringify({
      ids: connectedIds,
      count: connectedCount
    }));
  }, [connectedIds, connectedCount]);

  useEffect(() => {
    localStorage.setItem("shavy_following_founders", JSON.stringify(followingIds));
  }, [followingIds]);

  useEffect(() => {
    if (chatHistories.length > 0) {
      localStorage.setItem("shavy_chat_histories", JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  useEffect(() => {
    if (tabsContainerRef.current && activeTab) {
      const activeTabElement = tabsContainerRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeTab]);

  // ========== ALL 16 FOUNDERS WITH COMPLETE DATA ==========
const founders: Founder[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder & CEO",
    company: "AI Insights",
    industries: ["AI/ML", "SaaS", "Venture Capital"],
    location: "San Francisco, CA",
    bio: "Serial entrepreneur with 3 exits. Previously founded DataCrunch (acquired by Google). Passionate about ethical AI and founder mentorship.",
    longBio: "Started my first company at 22, sold it at 25. Then built DataCrunch from 0 to $50M ARR before Google acquisition. Now helping AI founders scale responsibly. Board member at Women in AI. Angel investor in 20+ startups.",
    avatarInitials: "SC",
    avatarColor: "#d4af37",
    image: "/sarah.png",
    founded: "2018",
    portfolio: ["DataCrunch (acq Google)", "AI Insights", "Ethical AI Foundation"],
    investmentInterests: ["Early-stage AI", "Ethical tech", "Women founders"],
    verified: true,
    topFounder: true,
    awardWinner: true,
    followers: 1234,
    founderSpecificResponses: {
      first_customers: "I literally DM'd 500 people on LinkedIn. My first customer was a friend's friend who needed AI for their startup — I gave them a huge discount just to get the case study.",
      industry_break: "AI moves FAST. I'd pick ONE sub-niche (like AI for legal docs) and become the absolute expert. Go to every conference and write every blog post you can.",
      biggest_mistake: "Pivoting too late. We spent 6 months building a feature nobody asked for. Now I ship weekly and let data decide what to keep or kill.",
      funding_advice: "Bootstrapped to $1M ARR before raising. Investors love traction over ideas, so prove demand first then ask for money.",
      hiring_tip: "Hire for attitude, train for skill. Our best hires had less experience but more hunger and curiosity than anyone else.",
      culture_building: "Remote-first works if you over-communicate. We have 3 stand-ups weekly and a 'wins' channel to celebrate small victories.",
      product_launch: "Launch to a small group first. Our beta testers gave us crucial feedback that saved us from building the wrong features.",
      marketing_strategy: "Content marketing worked for us. Write about what you're building — people love to follow the journey, not just the destination.",
      sales_advice: "Sell the outcome, not the features. Customers don't care about your tech stack — they care about saving time and making money.",
      leadership_lesson: "Your team looks at you during crisis. Stay calm, lead by example, and never blame individuals — blame the system."
    },
    posts: [
      { id: 1, content: "Just closed a $5M Series A! Excited to scale AI Insights globally 🚀", date: "2024-03-15", likes: 234, dislikes: 12, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "Congratulations Sarah! Well deserved!", author: "Mike Chen", date: "Mar 15", avatarInitials: "MC" },
        { id: 2, text: "Love what you're building in ethical AI", author: "Jessica Wu", date: "Mar 16", avatarInitials: "JW" },
        { id: 3, text: "Would love to connect and learn more", author: "Alex Kim", date: "Mar 16", avatarInitials: "AK" }
      ] },
      { id: 2, content: "Looking for a Head of Engineering. DM if interested!", date: "2024-03-10", likes: 89, dislikes: 3, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "What's the tech stack?", author: "David Park", date: "Mar 10", avatarInitials: "DP" }
      ] },
      { id: 3, content: "Ethical AI isn't optional. It's the future.", date: "2024-03-05", likes: 456, dislikes: 8, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "100% agree. We need more leaders speaking up", author: "Rachel Green", date: "Mar 5", avatarInitials: "RG" },
        { id: 2, text: "How do you implement it practically?", author: "Sam Taylor", date: "Mar 6", avatarInitials: "ST" }
      ] },
    ]
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Co-Founder",
    company: "FinTech Solutions",
    industries: ["FinTech", "Blockchain", "Banking"],
    location: "New York, NY",
    bio: "Ex-Goldman VP. Built payment infrastructure processing $2B+ annually.",
    longBio: "Spent 10 years at Goldman Sachs before jumping into fintech. Built a cross-border payment system that now processes $2B+ yearly.",
    avatarInitials: "MW",
    avatarColor: "#b8860b",
    image: "/marcus.png",
    founded: "2019",
    portfolio: ["FinTech Solutions", "PayFast (exited)"],
    investmentInterests: ["FinTech", "Blockchain infrastructure", "LatAm markets"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 892,
    founderSpecificResponses: {
      first_customers: "Walked into 50 banks with a demo. Got 3 'maybes', one said yes — that first bank gave us the credibility we needed.",
      industry_break: "FinTech is regulated. Learn compliance FIRST, then find a real pain point. Don't build another neo-bank — that ship has sailed.",
      biggest_mistake: "Ignored compliance too long. Got fined $50k. Now we have a full-time compliance officer and sleep much better at night.",
      funding_advice: "Banks have money. Pitch to strategic investors who can also be customers — they care about product, not just returns.",
      hiring_tip: "FinTech needs compliance experts early. Don't wait until you're audited to hire them — that's a mistake we made.",
      culture_building: "We're hybrid. Office for collaboration, remote for deep work. FinTech requires face time with legal and compliance teams.",
      product_launch: "Start with one payment corridor. Master it, then expand. Trying to launch globally from day one would have killed us.",
      marketing_strategy: "Partnerships with existing platforms worked better than direct sales. Integrate with Stripe, Shopify, or WooCommerce.",
      sales_advice: "Sell to CFOs, not founders. They control the budget in fintech and care about ROI, risk, and compliance.",
      leadership_lesson: "Regulation is not your enemy. Embrace it as a moat against competitors — once you're licensed, others can't easily copy you."
    },
    posts: [
      { id: 1, content: "Blockchain is revolutionizing cross-border payments. Huge opportunity ahead.", date: "2024-03-14", likes: 167, dislikes: 5, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "Which chain do you think wins long term?", author: "CryptoNick", date: "Mar 14", avatarInitials: "CN" }
      ] },
      { id: 2, content: "Open to mentoring early-stage fintech founders. DM me!", date: "2024-03-08", likes: 92, dislikes: 2, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "Just sent you a DM!", author: "NewFounder", date: "Mar 9", avatarInitials: "NF" }
      ] },
    ]
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Founder",
    company: "Green Energy Labs",
    industries: ["CleanTech", "Energy", "Hardware"],
    location: "Austin, TX",
    bio: "MIT PhD. Scaling renewable energy solutions across North America.",
    longBio: "PhD in Materials Science from MIT. Spent 5 years in R&D before founding Green Energy Labs.",
    avatarInitials: "ER",
    avatarColor: "#22c55e",
    image: "/elena.png",
    founded: "2020",
    portfolio: ["Green Energy Labs", "SolarGrid (venture)"],
    investmentInterests: ["CleanTech", "Hardware", "Climate tech"],
    verified: true,
    topFounder: true,
    awardWinner: false,
    followers: 2341,
    founderSpecificResponses: {
      first_customers: "Hospitals! They have huge energy bills and sustainability goals. Our first pilot was a children's hospital — saved them $200k/year.",
      industry_break: "Hardware is HARD. I'd start with software for energy management. Lower risk, faster iteration, then pivot to hardware later.",
      biggest_mistake: "Over-engineered our first product. Added features nobody used. Now we ship Minimum Viable Product and iterate based on feedback.",
      funding_help: "Climate tech investors care about impact AND returns. Show both metrics in your pitch deck — don't focus on just one.",
      manufacturing_tips: "Find a contract manufacturer early. Don't try to build your own factory — that's a trap for early-stage hardware startups.",
      team_building: "Hardware needs electrical, mechanical, and software engineers. Hard to find, so hire a head of engineering who understands all three.",
      customer_validation: "Get letters of intent before building. Prove demand exists with non-binding commitments from potential customers.",
      scaling_advice: "Start with one region. Master the local supply chain first, then expand. Don't try to go national from day one.",
      sustainability_tips: "Circular economy is real. Design for recyclability from day one — it's a selling point for ESG-conscious customers.",
      leadership_lesson: "Hardware delays are inevitable. Build buffer into every timeline — we add 50% to every estimate now."
    },
    posts: [
      { id: 1, content: "Our solar tech just hit 40% efficiency! Big breakthrough 🌞", date: "2024-03-12", likes: 342, dislikes: 4, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "That's incredible! What's next?", author: "ClimateFan", date: "Mar 12", avatarInitials: "CF" }
      ] }
    ]
  },
  {
    id: 4,
    name: "David Kim",
    role: "CEO & Founder",
    company: "DevForge",
    industries: ["DevTools", "Open Source", "SaaS"],
    location: "Seattle, WA",
    bio: "Built DevForge from 0 to 50k users. YC alum.",
    longBio: "YC W21 graduate. Bootstrapped DevForge to $2M ARR before raising.",
    avatarInitials: "DK",
    avatarColor: "#f97316",
    image: "/david.png",
    founded: "2020",
    portfolio: ["DevForge", "OpenSource Collective"],
    investmentInterests: ["DevTools", "Open source", "SaaS"],
    verified: true,
    topFounder: false,
    awardWinner: true,
    followers: 3456,
    founderSpecificResponses: {
      first_customers: "Reddit! Posted our tool in r/programming. Got 500 upvotes and first 100 customers overnight — product-led growth works.",
      industry_break: "Build something YOU need as a developer. Dogfood your product daily. Developers smell BS from miles away.",
      biggest_mistake: "Pricing too low. We doubled prices and lost 10% of customers but revenue increased 80% — know your value.",
      product_market_fit: "Talk to 100 developers before writing code. Find the common pain point they all share — that's your product.",
      open_source_strategy: "Open source core, paid enterprise features. Best of both worlds — community love and enterprise revenue.",
      hiring_engineers: "Look for curiosity, not just credentials. The best devs love to learn — ask about their side projects.",
      community_building: "Slack/Discord communities drive adoption. Be present daily — answer questions, share tips, build trust.",
      investor_relations: "YC network is gold. Leverage alumni for intros — warm intros close 10x faster than cold emails.",
      scaling_infra: "Plan for 10x growth. Technical debt compounds exponentially — pay it down early before it kills you.",
      leadership_lesson: "Your first hire sets the culture. Choose wisely — one bad apple can spoil the whole team's morale."
    },
    posts: [
      { id: 1, content: "DevForge just hit 100k users! Free tier for open source", date: "2024-03-13", likes: 567, dislikes: 6, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "Huge milestone!", author: "DevUser", date: "Mar 13", avatarInitials: "DU" }
      ] }
    ]
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Founder & CTO",
    company: "HealthIQ",
    industries: ["HealthTech", "AI", "Data Analytics"],
    location: "Bangalore, India",
    bio: "Ex-Google Health. Building AI-powered diagnostics for rural healthcare.",
    longBio: "Led AI teams at Google Health for 6 years. Founded HealthIQ to bring diagnostic AI to rural India.",
    avatarInitials: "PS",
    avatarColor: "#ec4898",
    image: "/priya.png",
    founded: "2021",
    portfolio: ["HealthIQ", "Rural Health Initiative"],
    investmentInterests: ["HealthTech", "AI for good", "Impact investing"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 5678,
    founderSpecificResponses: {
      first_customers: "Partnered with a rural hospital chain. They gave us access to patient data in exchange for free diagnostics — win-win.",
      industry_break: "Healthcare is SLOW. Build relationships with hospital admins first. Product second — trust is everything here.",
      biggest_mistake: "Built for doctors, not patients. Patients are the real users — now we design for both and test with actual patients.",
      regulatory_advice: "HIPAA compliance isn't optional. Budget for legal early — fines are massive and reputation damage is worse.",
      data_privacy: "Patient data is sacred. Anonymize everything, even internally. Trust is the currency of healthcare.",
      hospital_sales: "Sales cycles are 12-18 months. Have enough runway — we raised a bridge round to survive the slow cycle.",
      ai_ethics: "Explainable AI is mandatory in healthcare. No black boxes — doctors need to understand why your AI made a diagnosis.",
      team_expansion: "Hire clinicians to guide product decisions. Domain experts matter more than engineers in healthcare.",
      fundraising_impact: "Impact investors are more patient than VCs. Choose wisely — they understand the mission, not just the metrics.",
      leadership_lesson: "Patient outcomes > profit margins. Remember why you started — we post patient stories on our office wall."
    },
    posts: [
      { id: 1, content: "HealthIQ diagnosed 10,000 patients last month. Making healthcare accessible!", date: "2024-03-11", likes: 423, dislikes: 2, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "This is amazing work Priya", author: "Dr. Singh", date: "Mar 11", avatarInitials: "DS" }
      ] }
    ]
  },
  {
    id: 6,
    name: "James O'Connor",
    role: "Founder",
    company: "EcoLogix",
    industries: ["Logistics", "Sustainability", "Supply Chain"],
    location: "Dublin, Ireland",
    bio: "Reducing carbon footprint in last-mile delivery.",
    longBio: "Former logistics director at DHL. Founded EcoLogix to decarbonize delivery.",
    avatarInitials: "JO",
    avatarColor: "#06b6d4",
    image: "/james.png",
    founded: "2019",
    portfolio: ["EcoLogix", "GreenRoutes"],
    investmentInterests: ["Logistics tech", "Sustainability", "Climate"],
    verified: false,
    topFounder: false,
    awardWinner: false,
    followers: 789,
    founderSpecificResponses: {
      first_customers: "Local delivery companies! Showed them our AI routing could save 30% fuel — one trial led to 10 contracts.",
      industry_break: "Logistics runs on relationships. Go to industry events. Meet fleet managers — understand their daily pain points.",
      biggest_mistake: "Sold to the wrong person. Always sell to the decision maker with budget — won't make that mistake again.",
      supply_chain_tips: "Fuel prices are volatile. Hedge your operational costs — we buy fuel futures to lock in prices.",
      sustainability_metrics: "Measure carbon per package. Investors love quantifiable impact — show them the numbers.",
      fleet_management: "Telematics data is gold. Use it to optimize routes — we saved 15% on fuel just by analyzing driving patterns.",
      team_growth: "Hire operations people before engineers. Logistics is about execution — domain expertise beats coding skills.",
      customer_retention: "Show ROI in fuel savings. Numbers convince fleet managers — we guarantee 10% reduction or money back.",
      environmental_impact: "Every 1% efficiency = massive carbon reduction at scale. Small improvements add up across thousands of trucks.",
      leadership_lesson: "Climate change is urgent. Move fast but don't break relationships — partnerships take years to build."
    },
    posts: [
      { id: 1, content: "Reduced fleet emissions by 45% using AI routing. Proud moment!", date: "2024-03-10", likes: 289, dislikes: 1, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 7,
    name: "Nina Patel",
    role: "Co-Founder",
    company: "EdVance",
    industries: ["EdTech", "Mobile Learning", "Gamification"],
    location: "Toronto, Canada",
    bio: "Helping 1M+ students learn coding.",
    longBio: "Former teacher turned founder. EdVance reached 1M students in 18 months.",
    avatarInitials: "NP",
    avatarColor: "#8b5cf6",
    image: "/ahmed.png",
    founded: "2022",
    portfolio: ["EdVance", "CodeForAll"],
    investmentInterests: ["EdTech", "Mobile learning", "Gamification"],
    verified: true,
    topFounder: true,
    awardWinner: false,
    followers: 9012,
    founderSpecificResponses: {
      first_customers: "Schools! We gave away free accounts to 10 schools. Teachers loved it — word spread and now 500+ schools paid.",
      industry_break: "Teachers are gatekeepers. Build something that saves them time. Gamify for students, automate for teachers — win-win.",
      biggest_mistake: "Built for web first. Mobile is where students live — wasted 6 months on desktop app before pivoting to mobile-first.",
      product_development: "Students have short attention spans. Micro-lessons work best — 5 minutes max per lesson, then gamified quizzes.",
      teacher_feedback: "Talk to teachers weekly. They know what students need — we have a teacher advisory board that meets monthly.",
      gamification_tips: "Badges and streaks work. Leaderboards can demotivate slow learners — we use personal progress, not class rankings.",
      curriculum_design: "Align with school standards. Otherwise schools won't adopt — we mapped every lesson to provincial curriculum outcomes.",
      sales_to_schools: "District-level sales take 6-12 months. Start with individual teachers — get classroom adoption first, then go district-wide.",
      inclusive_design: "Accessibility is not optional. Build for all learning abilities — we have text-to-speech, dyslexia-friendly fonts, and high contrast modes.",
      leadership_lesson: "Education is emotional. Remember every student behind the metrics — we post student thank-you letters on our office wall."
    },
    posts: [
      { id: 1, content: "1 million students reached! EdVance is just getting started 🎓", date: "2024-03-09", likes: 789, dislikes: 3, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "Congrats Nina! Inspiring story", author: "TeacherTom", date: "Mar 9", avatarInitials: "TT" }
      ] }
    ]
  },
  {
    id: 8,
    name: "Carlos Mendez",
    role: "Founder & CEO",
    company: "PayLink",
    industries: ["FinTech", "Payments", "LatAm"],
    location: "Mexico City, Mexico",
    bio: "Building cross-border payment rails for Latin America.",
    longBio: "Raised $15M from a16z. PayLink now processes $100M monthly.",
    avatarInitials: "CM",
    avatarColor: "#f59e0b",
    image: "/carlos.png",
    founded: "2020",
    portfolio: ["PayLink", "LatAm Fund"],
    investmentInterests: ["FinTech", "LatAm markets", "Payments"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 345,
    founderSpecificResponses: {
      first_customers: "Expat freelancers! They needed to get paid from US companies. Solved real pain — got first 1000 users in 3 months.",
      industry_break: "Understand local regulations. Each country is different — Mexico is not Brazil is not Argentina. Hire local counsel everywhere.",
      biggest_mistake: "Hired too many engineers before finding product-market fit. Now I hire problem-solvers first — engineers second.",
      currency_risk: "Hedge against volatility. Local currency can devalue overnight — we keep reserves in USD and convert only for payouts.",
      banking_partnerships: "Work with local banks early. They're gatekeepers to the market — we partnered with Banco Santander before launch.",
      fraud_prevention: "LatAm has higher fraud rates. Invest in security from day one — we spent 6 months on fraud detection before launch.",
      customer_support: "Offer WhatsApp support. It's how customers communicate — 80% of our support tickets come through WhatsApp.",
      growth_strategy: "Word-of-mouth works in close-knit expat communities. Delight users — we NPS is 65 because we answer within minutes.",
      regulatory_navigation: "Hire local legal counsel in every country. Non-negotiable — we have lawyers in 12 countries.",
      leadership_lesson: "Don't copy US models. LatAm needs its own solutions — what works in San Francisco often fails in São Paulo."
    },
    posts: [
      { id: 1, content: "PayLink now processes $100M monthly! LatAm fintech is booming", date: "2024-03-08", likes: 445, dislikes: 2, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 9,
    name: "Aisha Khan",
    role: "Founder",
    company: "CloudSphere",
    industries: ["Cloud", "DevOps", "SaaS"],
    location: "Dubai, UAE",
    bio: "Making cloud infrastructure accessible to SMEs.",
    longBio: "Born in Pakistan, built in Dubai. CloudSphere helps SMEs migrate to cloud.",
    avatarInitials: "AK",
    avatarColor: "#14b8a6",
    image: "/aisha.png",
    founded: "2021",
    portfolio: ["CloudSphere", "CloudMentor"],
    investmentInterests: ["Cloud infra", "DevOps", "MENA region"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 456,
    founderSpecificResponses: {
      first_customers: "Family businesses! Convinced my uncle's company to migrate. Built case study, then sold to his competitors.",
      industry_break: "SMEs need hand-holding. Don't just sell software — sell outcomes and peace of mind. They're scared of cloud migrations.",
      biggest_mistake: "Hired salespeople without technical background. Lost deals because they couldn't answer questions. Now sales are former engineers.",
      cloud_cost_tips: "SMEs waste 30% on cloud. Show them savings, they'll buy — we guarantee 20% cost reduction or we comp their first month.",
      migration_strategy: "Lift-and-shift first, optimize later. Don't force re-architecture — that's too risky for SMEs with no cloud experience.",
      customer_support: "24/7 support is expected. Outsource to follow-the-sun model — we have teams in Dubai, India, and Philippines.",
      sales_training: "Teach sales to speak cloud. AWS/GCP/Azure terminology matters — our salespeople can pass the Cloud Practitioner exam.",
      product_pricing: "Usage-based pricing works for SMEs. Low entry barrier — pay for what you use, cancel anytime. No long-term contracts.",
      regional_expansion: "Dubai is a hub. Expand to Saudi and Egypt next — similar regulations and language, different cultures.",
      leadership_lesson: "Women in tech face extra hurdles. Build a support network — I meet monthly with 10 other female founders in MENA."
    },
    posts: [
      { id: 1, content: "CloudSphere just hit 500 enterprise customers! Cloud migration made easy", date: "2024-03-07", likes: 312, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 10,
    name: "Oliver Schmidt",
    role: "CEO",
    company: "AutoML Labs",
    industries: ["AI", "Automation", "Enterprise"],
    location: "Berlin, Germany",
    bio: "Democratizing machine learning for non-technical teams.",
    longBio: "Sold two previous startups. AutoML Labs raised €10M.",
    avatarInitials: "OS",
    avatarColor: "#3b82f6",
    image: "/olivia.png",
    founded: "2019",
    portfolio: ["AutoML Labs", "AI4All"],
    investmentInterests: ["AI", "Enterprise software", "European tech"],
    verified: true,
    topFounder: true,
    awardWinner: false,
    followers: 567,
    founderSpecificResponses: {
      first_customers: "Manufacturing companies! They needed AI but couldn't hire data scientists. Our no-code solution was perfect for them.",
      industry_break: "Enterprise sales cycles are LONG (6-12 months). Raise enough runway or start with SMBs — we did both.",
      biggest_mistake: "Built features customers didn't ask for. Now I only build what's on the signed contract — nothing more, nothing less.",
      no_code_ai: "Democratize access. Not everyone needs to know PyTorch — we abstract away the complexity so analysts can use AI.",
      european_funding: "EU grants are available. Use them for non-dilutive capital — we raised €2M in grants before any VC money.",
      enterprise_sales: "Proof of concept first. Show value before asking for budget — we offer 90-day free trials to enterprise customers.",
      team_structure: "Sales and product must sit together. No silos — we have weekly joint meetings where sales shares customer feedback.",
      data_privacy: "GDPR compliance is mandatory. Build privacy-first — we never train models on customer data without explicit consent.",
      market_strategy: "Start with one industry (manufacturing). Dominate it, then expand to logistics, then retail, then finance.",
      leadership_lesson: "European VCs are more patient than US. Choose accordingly — they take board seats but give you time to execute."
    },
    posts: [
      { id: 1, content: "AutoML Labs raised €10M to democratize AI. Let's make ML accessible!", date: "2024-03-06", likes: 567, dislikes: 1, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 11,
    name: "Mei Lin",
    role: "Founder",
    company: "StyleAI",
    industries: ["FashionTech", "AI", "E-commerce"],
    location: "Shanghai, China",
    bio: "AI-powered personal styling for global brands.",
    longBio: "Former lead data scientist at Alibaba. StyleAI uses computer vision.",
    avatarInitials: "ML",
    avatarColor: "#db2777",
    image: "/mei.png",
    founded: "2020",
    portfolio: ["StyleAI", "FashionFuture"],
    investmentInterests: ["FashionTech", "AI", "Retail"],
    verified: false,
    topFounder: false,
    awardWinner: false,
    followers: 678,
    founderSpecificResponses: {
      first_customers: "Fast fashion brands! Showed them 30% increase in add-to-cart rates. Now working with luxury brands too — slower sales but bigger contracts.",
      industry_break: "Fashion is visual. Your UI needs to be beautiful — invest in design from day one. Fashion buyers judge by appearance first.",
      biggest_mistake: "Built for desktop. Fashion is mobile-first on social media. Pivot was painful but necessary — we rebuilt entirely in 4 months.",
      fashion_ai: "Computer vision for clothing is harder than faces. Fabrics are tricky — wrinkles, folds, lighting all affect recognition.",
      brand_partnerships: "Whitelabel your tech for luxury brands. They want custom solutions — we have 5 white-label clients paying $50k/year each.",
      social_commerce: "TikTok/Instagram are where fashion lives. Integrate with them — we launched a TikTok shop integration that drove 40% of sales.",
      return_reduction: "AI styling reduces returns by 25%. That's your sales pitch — returns are a $500B problem annually for fashion retailers.",
      global_expansion: "Fashion tastes vary by region. Localize recommendations — what works in Shanghai fails in Milan. We train separate models per region.",
      team_culture: "Hire fashion people + tech people. Cross-pollination works — our best product manager has a fashion degree and coding bootcamp.",
      leadership_lesson: "Don't underestimate vanity sizing. It's a real ML challenge — a 'size 6' varies wildly across brands. We had to build brand-specific models."
    },
    posts: [
      { id: 1, content: "StyleAI partnered with 50+ fashion brands. AI is the future of retail", date: "2024-03-05", likes: 234, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 12,
    name: "Thomas Adebayo",
    role: "Co-Founder",
    company: "AfriPay",
    industries: ["FinTech", "Mobile Money", "Africa"],
    location: "Lagos, Nigeria",
    bio: "Building financial infrastructure for Africa's unbanked.",
    longBio: "Raised $8M from global investors. AfriPay serves 2M unbanked users.",
    avatarInitials: "TA",
    avatarColor: "#10b981",
    image: "/thomas.png",
    founded: "2021",
    portfolio: ["AfriPay", "AfricaFintech"],
    investmentInterests: ["FinTech", "Africa", "Financial inclusion"],
    verified: true,
    topFounder: false,
    awardWinner: true,
    followers: 7890,
    founderSpecificResponses: {
      first_customers: "Market vendors! They needed to accept digital payments. Built with them, not for them — spent 3 months selling alongside vendors.",
      industry_break: "Infrastructure is challenging — internet, power, phones. Build offline-first and work anywhere — our app works without internet.",
      biggest_mistake: "Raised too early before proving unit economics. Now I validate first, fundraise second — learned that the hard way.",
      financial_inclusion: "2 billion unbanked adults. Africa is the next frontier — mobile money penetration is higher than banking in many countries.",
      mobile_money: "M-Pesa showed the way. Build interoperable solutions — we integrate with M-Pesa, Airtel Money, and MTN Mobile Money.",
      agent_network: "Physical agents are key. Not everyone has a smartphone — we have 5000 agents across Nigeria who handle cash-in/cash-out.",
      fraud_prevention: "SIM swap fraud is real. Build layered security — we use voice biometrics plus PIN plus device fingerprinting.",
      local_partnerships: "Work with telcos, not against them. They own distribution — MTN is our biggest investor and distribution partner.",
      regulatory_tips: "Each African country has different rules. Hire local — we have country managers for Nigeria, Ghana, Kenya, and Rwanda.",
      leadership_lesson: "Don't import Silicon Valley models. Build for local realities — our UX is designed for low-bandwidth, low-literacy users."
    },
    posts: [
      { id: 1, content: "AfriPay now serves 2M unbanked users. Financial inclusion matters.", date: "2024-03-04", likes: 678, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [
        { id: 1, text: "This is huge for Africa!", author: "InvestorKen", date: "Mar 4", avatarInitials: "IK" }
      ] }
    ]
  },
  {
    id: 13,
    name: "Sophie Laurent",
    role: "Founder & CEO",
    company: "CyberShield",
    industries: ["Cybersecurity", "SaaS", "B2B"],
    location: "Paris, France",
    bio: "Protecting SMEs from cyber threats.",
    longBio: "Ex-French intelligence cyber division. Founded CyberShield after seeing SMEs get destroyed.",
    avatarInitials: "SL",
    avatarColor: "#ef4444",
    image: "/juliet.png",
    founded: "2018",
    portfolio: ["CyberShield", "EuroSecure"],
    investmentInterests: ["Cybersecurity", "SaaS", "European B2B"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 4567,
    founderSpecificResponses: {
      first_customers: "Law firms! They have sensitive data and fear breaches. One ransomware scare got us 50 contracts within a week.",
      industry_break: "Cybersecurity sells through fear and compliance. Understand GDPR, HIPAA, SOC2 — sell peace of mind, not tech specs.",
      biggest_mistake: "Sold features, not outcomes. 'We prevent breaches' vs 'We have AI detection.' Outcomes win every time.",
      ransomware_defense: "Air-gapped backups. Offline storage is your last defense — we require customers to have offline backups in our SLA.",
      sme_security: "Small businesses are targets. They have money but no IT team — we're their virtual CISO for $500/month.",
      compliance_needs: "GDPR fines are massive. Compliance drives sales — our GDPR compliance module alone brought in 200 customers.",
      product_messaging: "Don't say 'firewall.' Say 'we keep your money safe.' Speak to business outcomes, not technical features.",
      channel_partners: "MSPs are your best sales channel. They already have customer trust — we have 50 MSP partners across Europe.",
      incident_response: "Have a breach plan ready. Customers ask for it — our IR retainer is our highest-margin product.",
      leadership_lesson: "Trust is earned in drops, lost in buckets. One breach ruins reputation — we've never had a customer breach in 6 years."
    },
    posts: [
      { id: 1, content: "Cyber attacks on SMEs up 300%. CyberShield protecting 10k+ businesses", date: "2024-03-03", likes: 445, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 14,
    name: "Vikram Singh",
    role: "Founder",
    company: "AgriGrow",
    industries: ["AgriTech", "IoT", "Sustainability"],
    location: "Mumbai, India",
    bio: "Smart farming solutions for smallholder farmers.",
    longBio: "Helped 50k farmers increase yield by 30% using IoT sensors.",
    avatarInitials: "VS",
    avatarColor: "#84cc16",
    image: "/rajesh.png",
    founded: "2019",
    portfolio: ["AgriGrow", "FarmSmart"],
    investmentInterests: ["AgriTech", "IoT", "Impact investing"],
    verified: true,
    topFounder: true,
    awardWinner: false,
    followers: 2345,
    founderSpecificResponses: {
      first_customers: "Farmer cooperatives! 5000 farmers signed up after seeing neighbor's bumper crop — peer-to-peer trust works in villages.",
      industry_break: "Don't sell to individual farmers. Sell to cooperatives, NGOs, or government — distribution is key in rural India.",
      biggest_mistake: "Made the app too complex. Farmers need simple — 3 buttons max. My 70-year-old dad should be able to use it.",
      iot_sensors: "Soil sensors are expensive. Start with weather data and SMS alerts — we reached 50k farmers before deploying any hardware.",
      farmer_trust: "Word-of-mouth spreads fast in villages. Delight early adopters — we gave free sensors to 100 farmers as influencers.",
      government_partnerships: "Subsidies exist. Help farmers apply for them through your app — we integrated with 5 state subsidy programs.",
      local_languages: "UI must support local languages. English won't work — we support 12 Indian languages with voice input for illiterate farmers.",
      offline_first: "Internet is unreliable. Build offline-first with sync later — our app works without network for 7 days.",
      climate_resilience: "Farmers need weather forecasts. Provide actionable insights — we send daily SMS with planting, irrigation, harvest advice.",
      leadership_lesson: "Walking through farms taught me more than any MBA ever could — spend a week in the field every quarter."
    },
    posts: [
      { id: 1, content: "AgriGrow helped 50k farmers increase yield by 30%. Sustainable agriculture works!", date: "2024-03-02", likes: 789, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 15,
    name: "Rachel Cohen",
    role: "CEO",
    company: "MedMatch",
    industries: ["HealthTech", "Marketplace", "AI"],
    location: "Tel Aviv, Israel",
    bio: "Connecting patients with specialists in 24 hours.",
    longBio: "MedMatch raised $12M from top VCs. Reduced patient wait times from 3 months to 24 hours.",
    avatarInitials: "RC",
    avatarColor: "#a855f7",
    image: "/zara.png",
    founded: "2020",
    portfolio: ["MedMatch", "HealthConnect"],
    investmentInterests: ["HealthTech", "Marketplace", "AI"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 12345,
    founderSpecificResponses: {
      first_customers: "Private clinics! They had empty appointment slots. Filled them overnight — network effects kicked in fast.",
      industry_break: "Two-sided marketplace is HARD. Start with supply (doctors), then demand (patients). Don't do both at once.",
      biggest_mistake: "Expanded cities before dominating one. Now we own Tel Aviv before moving to Jerusalem — dominate one market first.",
      marketplace_tips: "Subsidize supply side first. Doctors won't join without patients — we paid doctors $100/slot for first 3 months.",
      patient_acquisition: "Employer benefits programs drive patient volume. Partner with HR — we have 50 corporate clients covering 200k employees.",
      doctor_retention: "Fill their empty slots. That's your only value proposition — we guarantee 80% fill rate or we waive our fee.",
      scheduling_algorithms: "Match patients to doctors based on condition, not just availability — our AI matches by specialty, language, and patient ratings.",
      telemedicine: "Post-COVID, virtual visits are expected. Build video consultations — 60% of our appointments are now virtual.",
      data_privacy: "Medical data is sensitive. HIPAA compliance is non-negotiable — we spend $500k/year on security audits.",
      leadership_lesson: "Healthcare moves slow because lives are at stake. Be patient — our first contract took 18 months to sign."
    },
    posts: [
      { id: 1, content: "MedMatch reduced patient wait times from 3 months to 24 hours. Healthcare transformed.", date: "2024-03-01", likes: 567, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
  {
    id: 16,
    name: "Kenji Tanaka",
    role: "Founder",
    company: "RoboFlow",
    industries: ["Robotics", "Automation", "Manufacturing"],
    location: "Tokyo, Japan",
    bio: "Industrial robotics for small factories.",
    longBio: "Former lead engineer at Fanuc. RoboFlow deploys affordable robotics.",
    avatarInitials: "KT",
    avatarColor: "#eab308",
    image: "/KT.png",
    founded: "2019",
    portfolio: ["RoboFlow", "JapanRobotics"],
    investmentInterests: ["Robotics", "Manufacturing", "Hardware"],
    verified: true,
    topFounder: false,
    awardWinner: false,
    followers: 678,
    founderSpecificResponses: {
      first_customers: "Small auto parts manufacturers! They couldn't afford Fanuc — our robots cost 1/3 the price. Perfect fit for their budget.",
      industry_break: "Hardware is capital intensive. Raise more than you think — delays will happen. Parts will be late. Double your runway estimate.",
      biggest_mistake: "Built robots engineers wanted, not factory workers wanted. Now I spend a day/month on the factory floor — eye-opening experience.",
      robot_safety: "Safety standards are strict. Budget for certifications early — we spent $500k on CE and UL certification before first sale.",
      manufacturing_automation: "Start with one repetitive task. Palletizing, welding, pick-and-place — master one motion, then expand.",
      customer_support: "Factories need 24/7 support. Downtime costs thousands per hour — we have Japanese-speaking engineers on call 24/7.",
      pricing_model: "Robots-as-a-service (RaaS) lowers entry barrier. Monthly subscription works — $2000/month for a $50k robot.",
      supply_chain: "Lead times for parts are 6+ months. Order ahead — we keep 12 months of inventory for critical components.",
      team_hiring: "Hardware needs mechanical, electrical, software engineers. Hard to find — we recruit from Toyota, Honda, and Fanuc.",
      leadership_lesson: "Japanese factories value reliability over features. Don't overpromise — we quote 99.5% uptime and deliver 99.9%."
    },
    posts: [
      { id: 1, content: "RoboFlow deployed 500 robots across Japan. Automation for everyone.", date: "2024-02-28", likes: 456, dislikes: 0, likedByUser: false, dislikedByUser: false, comments: [] }
    ]
  },
];

  // ========== LOAD POST INTERACTIONS FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedLikes = localStorage.getItem("shavy_post_likes");
    const savedComments = localStorage.getItem("shavy_post_comments");
    
    if (savedLikes) {
      const likesData = JSON.parse(savedLikes);
      founders.forEach(founder => {
        founder.posts?.forEach(post => {
          const key = `${founder.id}-${post.id}`;
          if (likesData[key]) {
            post.likes = likesData[key].likes;
            post.dislikes = likesData[key].dislikes || 0;
            post.likedByUser = likesData[key].likedByUser;
            post.dislikedByUser = likesData[key].dislikedByUser;
          }
        });
      });
    }
    
    if (savedComments) {
      const commentsData = JSON.parse(savedComments);
      founders.forEach(founder => {
        founder.posts?.forEach(post => {
          const key = `${founder.id}-${post.id}`;
          if (commentsData[key]) {
            post.comments = commentsData[key];
          }
        });
      });
    }
  }, []);

  // ========== SAVE POST INTERACTIONS TO LOCALSTORAGE ==========
  const savePostInteractions = () => {
    const likesData: Record<string, any> = {};
    const commentsData: Record<string, any> = {};
    
    founders.forEach(founder => {
      founder.posts?.forEach(post => {
        const key = `${founder.id}-${post.id}`;
        likesData[key] = {
          likes: post.likes,
          dislikes: post.dislikes,
          likedByUser: post.likedByUser,
          dislikedByUser: post.dislikedByUser
        };
        commentsData[key] = post.comments;
      });
    });
    
    localStorage.setItem("shavy_post_likes", JSON.stringify(likesData));
    localStorage.setItem("shavy_post_comments", JSON.stringify(commentsData));
  };

  // ========== LIKE/DISLIKE HANDLERS ==========
  const handleLike = (founderId: number, postId: number) => {
    const founder = founders.find(f => f.id === founderId);
    const post = founder?.posts?.find(p => p.id === postId);
    if (post) {
      if (post.likedByUser) {
        post.likes--;
        post.likedByUser = false;
      } else {
        post.likes++;
        post.likedByUser = true;
        if (post.dislikedByUser) {
          post.dislikes--;
          post.dislikedByUser = false;
        }
      }
      savePostInteractions();
      setActiveTab(prev => prev);
      triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
      showToast(post.likedByUser ? "👍 Liked!" : "👍 Like removed");
    }
  };

  const handleDislike = (founderId: number, postId: number) => {
    const founder = founders.find(f => f.id === founderId);
    const post = founder?.posts?.find(p => p.id === postId);
    if (post) {
      if (post.dislikedByUser) {
        post.dislikes--;
        post.dislikedByUser = false;
      } else {
        post.dislikes++;
        post.dislikedByUser = true;
        if (post.likedByUser) {
          post.likes--;
          post.likedByUser = false;
        }
      }
      savePostInteractions();
      setActiveTab(prev => prev);
      showToast(post.dislikedByUser ? "👎 Disliked!" : "👎 Dislike removed");
    }
  };

  // ========== COMMENT HANDLERS ==========
  const handleAddComment = (founderId: number, postId: number) => {
    if (!commentInput.trim()) return;
    
    const founder = founders.find(f => f.id === founderId);
    const post = founder?.posts?.find(p => p.id === postId);
    if (post) {
      const newComment: Comment = {
        id: Date.now(),
        text: commentInput,
        author: "Admin",
        date: "Just now",
        avatarInitials: "AD"
      };
      post.comments.push(newComment);
      savePostInteractions();
      setCommentInput("");
      triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
      showToast("💬 Comment added as Admin!");
      setExpandedComments(expandedComments ? { ...expandedComments } : null);
    }
  };

  const handleEditComment = (founderId: number, postId: number, commentId: number, newText: string) => {
    const founder = founders.find(f => f.id === founderId);
    const post = founder?.posts?.find(p => p.id === postId);
    const comment = post?.comments.find(c => c.id === commentId);
    if (comment && comment.author === "Admin") {
      comment.text = newText;
      comment.date = "Edited just now";
      savePostInteractions();
      setEditingCommentId(null);
      showToast("✏️ Comment edited!");
    }
  };

  const handleDeleteComment = (founderId: number, postId: number, commentId: number) => {
    const founder = founders.find(f => f.id === founderId);
    const post = founder?.posts?.find(p => p.id === postId);
    const commentIndex = post?.comments.findIndex(c => c.id === commentId);
    if (commentIndex !== undefined && commentIndex !== -1 && post?.comments[commentIndex].author === "Admin") {
      post.comments.splice(commentIndex, 1);
      savePostInteractions();
      showToast("🗑️ Comment deleted!");
    }
  };

  // ========== CHAT HISTORY FUNCTIONS ==========
  const getChatHistory = (founderId: number): Message[] => {
    const history = chatHistories.find(h => h.founderId === founderId);
    if (history) return history.messages.map(m => ({ ...m, seen: true }));
    return [];
  };

  const saveChatHistory = (founderId: number, messages: Message[]) => {
    const existingIndex = chatHistories.findIndex(h => h.founderId === founderId);
    if (existingIndex >= 0) {
      const newHistories = [...chatHistories];
      newHistories[existingIndex] = { founderId, messages };
      setChatHistories(newHistories);
    } else {
      setChatHistories([...chatHistories, { founderId, messages }]);
    }
  };

  // ========== MESSAGE REACTIONS ==========
  const addMessageReaction = (messageId: number, reaction: "👍" | "❤️" | "😂" | "🎉") => {
    const updatedMessages = chatMessages.map(msg =>
      msg.id === messageId ? { ...msg, reaction } : msg
    );
    setChatMessages(updatedMessages);
    if (selectedFounder) {
      saveChatHistory(selectedFounder.id, updatedMessages);
    }
    setShowReactionPicker(null);
    showToast(`Reacted with ${reaction}`);
  };

  // ========== CHAT MESSAGE EDIT/DELETE ==========
  const handleEditChatMessage = (messageId: number, newText: string) => {
    const updatedMessages = chatMessages.map(msg =>
      msg.id === messageId ? { ...msg, text: newText, timestamp: new Date() } : msg
    );
    setChatMessages(updatedMessages);
    if (selectedFounder) {
      saveChatHistory(selectedFounder.id, updatedMessages);
    }
    setEditingMessageId(null);
    setEditingMessageText("");
    showToast("✏️ Message edited!");
  };

  const handleDeleteChatMessage = (messageId: number) => {
    const updatedMessages = chatMessages.filter(msg => msg.id !== messageId);
    setChatMessages(updatedMessages);
    if (selectedFounder) {
      saveChatHistory(selectedFounder.id, updatedMessages);
    }
    showToast("🗑️ Message deleted!");
  };

  // ========== FOUNDER RESPONSE GENERATION ==========
  const getFounderResponse = (userMessage: string, founder: Founder, questionType: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes("first 100 customers") || (lowerMsg.includes("first") && lowerMsg.includes("customers"))) {
      return founder.founderSpecificResponses?.first_customers || `Great question! My first 100 customers came from pure hustle.`;
    }
    if ((lowerMsg.includes("congratulations") || lowerMsg.includes("success")) && (lowerMsg.includes("newbie") || lowerMsg.includes("break"))) {
      return founder.founderSpecificResponses?.industry_break || `Thank you! If I were starting from scratch in ${founder.industries[0]} today? I'd find ONE specific problem.`;
    }
    if (lowerMsg.includes("biggest mistake") || (lowerMsg.includes("mistake") && lowerMsg.includes("learn"))) {
      return founder.founderSpecificResponses?.biggest_mistake || `Biggest mistake? Hiring too fast. Now I hire slow, fire fast.`;
    }
    if (lowerMsg.includes("funding") || lowerMsg.includes("investor") || lowerMsg.includes("raise")) {
      return founder.founderSpecificResponses?.funding_advice || `Funding came after traction. We bootstrapped to $1M ARR first.`;
    }
    if (lowerMsg.includes("hiring") || lowerMsg.includes("job") || lowerMsg.includes("career")) {
      return founder.founderSpecificResponses?.hiring_tip || `We are expanding! Send me your resume!`;
    }
    if (lowerMsg.includes("partnership") || lowerMsg.includes("collaborate") || lowerMsg.includes("partner")) {
      return founder.founderSpecificResponses?.partnership_advice || `Always open to partnerships in ${founder.industries[0]}!`;
    }
    if (lowerMsg.includes("advice") || lowerMsg.includes("tip") || lowerMsg.includes("suggest")) {
      return founder.founderSpecificResponses?.leadership_lesson || `My best advice? Build something people actually want.`;
    }
    if (lowerMsg.includes("team") || lowerMsg.includes("culture")) {
      return founder.founderSpecificResponses?.culture_building || `Culture isn't ping pong tables. It's how you handle conflict.`;
    }
    if (lowerMsg.includes("product") || lowerMsg.includes("launch")) {
      return founder.founderSpecificResponses?.product_launch || `Launch to a small group first. Beta testers give crucial feedback.`;
    }
    if (lowerMsg.includes("market") || lowerMsg.includes("customers") || lowerMsg.includes("sell")) {
      return founder.founderSpecificResponses?.sales_advice || `Sell the outcome, not the features.`;
    }
    return `That's a thoughtful question. In my experience building ${founder.company}, the key is staying curious.`;
  };

  const detectQuestionType = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("first 100 customers")) return "first_customers";
    if ((lowerMsg.includes("congratulations") || lowerMsg.includes("success")) && lowerMsg.includes("newbie")) return "industry_break";
    if (lowerMsg.includes("biggest mistake")) return "biggest_mistake";
    if (lowerMsg.includes("funding") || lowerMsg.includes("investor")) return "funding";
    if (lowerMsg.includes("hiring") || lowerMsg.includes("job")) return "hiring";
    if (lowerMsg.includes("partner")) return "partnership";
    if (lowerMsg.includes("advice") || lowerMsg.includes("tip")) return "advice";
    if (lowerMsg.includes("team") || lowerMsg.includes("culture")) return "culture";
    if (lowerMsg.includes("product") || lowerMsg.includes("launch")) return "product";
    if (lowerMsg.includes("market") || lowerMsg.includes("sell")) return "market";
    return "general";
  };

  // ========== SEND CHAT MESSAGE ==========
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedFounder) return;
    
    const questionType = detectQuestionType(chatInput);
    setAskedQuestions(prev => new Set(prev).add(questionType));
    
    const userMessage: Message = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
      seen: true,
    };
    
    const currentMessages = [...chatMessages, userMessage];
    setChatMessages(currentMessages);
    saveChatHistory(selectedFounder.id, currentMessages);
    setChatInput("");
    
    await new Promise(resolve => setTimeout(resolve, 750));
    
    setIsFounderTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    setIsFounderTyping(false);
    
    const responseText = getFounderResponse(chatInput, selectedFounder, questionType);
    
    setIsTypingResponse(true);
    setDisplayedResponse("");
    for (let i = 0; i <= responseText.length; i++) {
      setDisplayedResponse(responseText.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, typingSpeed));
    }
    setIsTypingResponse(false);
    
    const founderMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      sender: "founder",
      timestamp: new Date(),
      seen: true,
    };
    
    const updatedMessages = [...currentMessages, founderMessage];
    setChatMessages(updatedMessages);
    saveChatHistory(selectedFounder.id, updatedMessages);
    setDisplayedResponse("");
  };

  // ========== FOLLOW HANDLER ==========
  const handleFollow = (founderId: number, founderName: string) => {
    if (followingIds.includes(founderId)) {
      setFollowingIds(followingIds.filter(id => id !== founderId));
      showToast(`🔕 Unfollowed ${founderName}`);
    } else {
      setFollowingIds([...followingIds, founderId]);
      showToast(`✅ Following ${founderName}`);
    }
  };

  // ========== CONNECTION HANDLERS ==========
  const handleConnectClick = (founderId: number) => {
    setPendingConnectId(founderId);
  };

  const confirmConnect = () => {
    if (pendingConnectId && !connectedIds.includes(pendingConnectId)) {
      setIsConnecting(true);
      setTimeout(() => {
        const founder = founders.find(f => f.id === pendingConnectId);
        setConnectedIds([...connectedIds, pendingConnectId]);
        setConnectedCount(connectedCount + 1);
        triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
        showToast(`✅ ${founder?.name} accepted your connection request!`);
        setIsConnecting(false);
        setPendingConnectId(null);
      }, 2000);
    }
  };

  const cancelConnect = () => {
    setPendingConnectId(null);
    setIsConnecting(false);
  };

  const handleDisconnectClick = (founderId: number) => {
    setPendingDisconnectId(founderId);
  };

  const confirmDisconnect = () => {
    if (pendingDisconnectId) {
      const founder = founders.find(f => f.id === pendingDisconnectId);
      setConnectedIds(connectedIds.filter(id => id !== pendingDisconnectId));
      setConnectedCount(connectedCount - 1);
      showToast(`❌ Disconnected from ${founder?.name}`);
      setPendingDisconnectId(null);
    }
  };

  const cancelDisconnect = () => {
    setPendingDisconnectId(null);
  };

  // ========== PROFILE & MESSAGE HANDLERS ==========
  const handleViewProfile = (founder: Founder) => {
    setSelectedFounder(founder);
    setShowProfileModal(true);
  };

  const handleMessageFounder = (founder: Founder) => {
    setSelectedFounder(founder);
    const savedMessages = getChatHistory(founder.id);
    if (savedMessages.length > 0) {
      setChatMessages(savedMessages);
    } else {
      setChatMessages([]);
    }
    setShowChatModal(true);
  };

  // ========== FILTERING AND SORTING FUNCTIONS ==========
  const getConnectedFounders = () => founders.filter(f => connectedIds.includes(f.id));
  
  const getSortedFounders = (foundersList: Founder[]) => {
    switch (sortBy) {
      case "name":
        return [...foundersList].sort((a, b) => a.name.localeCompare(b.name));
      case "recent":
        return [...foundersList].sort((a, b) => (b.followers || 0) - (a.followers || 0));
      case "connections":
        return [...foundersList].sort((a, b) => (b.followers || 0) - (a.followers || 0));
      default:
        return foundersList;
    }
  };

  const getFilteredByLocation = (foundersList: Founder[]) => {
    if (locationFilter === "near") {
      return foundersList.filter(f => 
        f.location.includes("San Francisco") || 
        f.location.includes("New York") || 
        f.location.includes("Austin") ||
        f.location.includes("Seattle")
      );
    }
    return foundersList;
  };

  const getFollowingPosts = () => {
    const posts: any[] = [];
    getConnectedFounders().forEach(founder => {
      founder.posts?.forEach(post => {
        posts.push({ ...post, founderName: founder.name, founderAvatar: founder.avatarInitials, founderId: founder.id, founderImage: founder.image });
      });
    });
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAllPosts = () => {
    const posts: any[] = [];
    founders.forEach(founder => {
      founder.posts?.forEach(post => {
        posts.push({ ...post, founderName: founder.name, founderAvatar: founder.avatarInitials, founderId: founder.id, founderImage: founder.image });
      });
    });
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const allIndustries = ["All Industries", ...new Set(founders.flatMap(f => f.industries))];

  let filteredFounders = founders.filter(founder => {
    const matchesSearch = founder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          founder.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === "All Industries" || founder.industries.includes(industryFilter);
    return matchesSearch && matchesIndustry;
  });
  
  filteredFounders = getFilteredByLocation(filteredFounders);
  filteredFounders = getSortedFounders(filteredFounders);

  const handleBackToHome = () => {
    window.dispatchEvent(new CustomEvent("switchTab", { detail: "home" }));
    onBack();
  };

  // ========== HELPER FUNCTIONS ==========
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const triggerParticleBurst = (x: number, y: number) => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        id: particleId++,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 500);
  };

  // 10 preset questions for chat
  const presetQuestions = [
    { text: "How did you get your first 100 customers?", type: "first_customers", emoji: "🎯" },
    { text: "How would you break into {industry} as a newbie?", type: "industry_break", emoji: "🚀" },
    { text: "What's the biggest mistake you've made?", type: "biggest_mistake", emoji: "💀" },
    { text: "How did you raise funding?", type: "funding", emoji: "💰" },
    { text: "What's your advice on hiring?", type: "hiring", emoji: "👥" },
    { text: "How do you find partners?", type: "partnership", emoji: "🤝" },
    { text: "What's your #1 leadership tip?", type: "advice", emoji: "👑" },
    { text: "How did you build your team culture?", type: "culture", emoji: "🏛️" },
    { text: "How did you launch your product?", type: "product", emoji: "📦" },
    { text: "How do you acquire customers?", type: "market", emoji: "📈" },
  ];

  const colors = theme === "dark" 
    ? { cardBg: "#2A2622", border: "#3a3a3a", text: "#e2e8f0", textMuted: "#94a3b8", gold: "#d4af37", bg: "#1F1C18", inputBg: "#1e293b" }
    : { cardBg: "#ffffff", border: "#e2e8f0", text: "#0f172a", textMuted: "#64748b", gold: "#b8860b", bg: "#f8fafc", inputBg: "#f1f5f9" };

  // ========== CONDITIONAL RETURN - ONLY AFTER ALL HOOKS ==========
  if (!isDataLoaded) {
    return (
      <div style={{ minHeight: "100%", padding: "16px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "30px", height: "30px", border: `2px solid ${colors.gold}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "12px", color: colors.textMuted }}>Loading your network...</p>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER RETURN ==========
  return (
    <div style={{ minHeight: "100%", padding: "16px", paddingBottom: "20px", backgroundColor: colors.bg, position: "relative" }}>
      
      {/* Particle Burst Effect */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            width: "8px",
            height: "8px",
            backgroundColor: colors.gold,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 1000,
            animation: "particleFade 0.5s ease-out forwards",
          }}
        />
      ))}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: colors.cardBg,
          color: colors.gold,
          padding: "12px 20px",
          borderRadius: "40px",
          fontSize: "13px",
          zIndex: 200,
          border: `1px solid ${colors.border}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          {toast}
        </div>
      )}

      {/* Connect Loading Modal */}
      {isConnecting && (
        <>
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "280px",
            backgroundColor: colors.cardBg,
            borderRadius: "24px",
            padding: "24px",
            zIndex: 151,
            border: `1px solid ${colors.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", animation: "pulse 1s infinite" }}>⏳</div>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>Sending connection request...</h3>
            <p style={{ fontSize: "11px", color: colors.textMuted }}>Waiting for founder to accept</p>
            <div style={{
              width: "100%",
              height: "4px",
              backgroundColor: colors.border,
              borderRadius: "10px",
              marginTop: "16px",
              overflow: "hidden",
            }}>
              <div style={{
                width: "60%",
                height: "100%",
                background: `linear-gradient(90deg, ${colors.gold}, ${colors.gold}80)`,
                borderRadius: "10px",
                animation: "loading 1s ease-in-out infinite",
              }} />
            </div>
          </div>
        </>
      )}

      {/* Confirm Connect Modal */}
      {pendingConnectId !== null && !isConnecting && (
        <>
          <div onClick={cancelConnect} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "280px",
            backgroundColor: colors.cardBg,
            borderRadius: "24px",
            padding: "24px",
            zIndex: 151,
            border: `1px solid ${colors.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤝</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>Connect with Founder?</h3>
            <p style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "20px" }}>Send a connection request to this founder.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={confirmConnect} style={{ flex: 1, background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "10px", borderRadius: "40px", fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Send Request</button>
              <button onClick={cancelConnect} style={{ flex: 1, background: "transparent", border: `1px solid ${colors.border}`, padding: "10px", borderRadius: "40px", fontSize: "13px", fontWeight: "500", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Confirm Disconnect Modal */}
      {pendingDisconnectId !== null && (
        <>
          <div onClick={cancelDisconnect} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "280px",
            backgroundColor: colors.cardBg,
            borderRadius: "24px",
            padding: "24px",
            zIndex: 151,
            border: `1px solid ${colors.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>Remove Connection?</h3>
            <p style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "20px" }}>This will remove this founder from your network.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={confirmDisconnect} style={{ flex: 1, background: "#ef4444", border: "none", padding: "10px", borderRadius: "40px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer" }}>Remove</button>
              <button onClick={cancelDisconnect} style={{ flex: 1, background: "transparent", border: `1px solid ${colors.border}`, padding: "10px", borderRadius: "40px", fontSize: "13px", fontWeight: "500", color: colors.textMuted, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Profile Modal - Expanded View */}
      {showProfileModal && selectedFounder && (
        <>
          <div onClick={() => setShowProfileModal(false)} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "340px",
            maxHeight: "85vh",
            overflowY: "auto",
            backgroundColor: colors.cardBg,
            borderRadius: "24px",
            zIndex: 151,
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${selectedFounder.avatarColor}, ${selectedFounder.avatarColor}80)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "600",
                    color: "#fff",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {selectedFounder.image ? (
                      <img src={selectedFounder.image} alt={selectedFounder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      selectedFounder.avatarInitials
                    )}
                    {selectedFounder.verified && (
                      <div style={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                        backgroundColor: "#22c55e",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        border: `2px solid ${colors.cardBg}`,
                      }}>✅</div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "700", color: colors.text, margin: 0 }}>{selectedFounder.name}</h3>
                      {selectedFounder.topFounder && <span style={{ fontSize: "12px", color: colors.gold }}>⭐ Top Founder</span>}
                      {selectedFounder.awardWinner && <span style={{ fontSize: "12px", color: "#f97316" }}>🏆 Award</span>}
                    </div>
                    <p style={{ fontSize: "13px", color: colors.gold, margin: "4px 0 0 0" }}>{selectedFounder.role} • {selectedFounder.company}</p>
                    <p style={{ fontSize: "11px", color: colors.textMuted, margin: "4px 0 0 0" }}>📍 {selectedFounder.location}</p>
                    <p style={{ fontSize: "11px", color: colors.textMuted, margin: "2px 0 0 0" }}>👥 {selectedFounder.followers || 0} followers</p>
                    {showOnlineStatus && <p style={{ fontSize: "10px", color: "#22c55e", marginTop: "4px" }}>🟢 Online now</p>}
                  </div>
                </div>
                <button onClick={() => setShowProfileModal(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: colors.textMuted }}>✕</button>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  {selectedFounder.industries.map((ind, idx) => (
                    <span key={idx} style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "20px", background: `${colors.gold}20`, color: colors.gold }}>{ind}</span>
                  ))}
                </div>
                
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>About</h4>
                  <p style={{ fontSize: "13px", color: colors.textMuted, lineHeight: "1.5" }}>{selectedFounder.longBio || selectedFounder.bio}</p>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ backgroundColor: `${colors.gold}10`, borderRadius: "12px", padding: "10px" }}>
                    <p style={{ fontSize: "10px", color: colors.textMuted, marginBottom: "4px" }}>Founded</p>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: colors.text }}>{selectedFounder.founded || "N/A"}</p>
                  </div>
                  <div style={{ backgroundColor: `${colors.gold}10`, borderRadius: "12px", padding: "10px" }}>
                    <p style={{ fontSize: "10px", color: colors.textMuted, marginBottom: "4px" }}>Location</p>
                    <p style={{ fontSize: "12px", fontWeight: "500", color: colors.text }}>{selectedFounder.location}</p>
                  </div>
                </div>
                
                {selectedFounder.portfolio && selectedFounder.portfolio.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>📁 Portfolio</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selectedFounder.portfolio.map((item, idx) => (
                        <span key={idx} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "16px", background: `${colors.gold}10`, color: colors.text }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedFounder.investmentInterests && selectedFounder.investmentInterests.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>💡 Investment Interests</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selectedFounder.investmentInterests.map((item, idx) => (
                        <span key={idx} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "16px", background: `${colors.gold}10`, color: colors.text }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                {!connectedIds.includes(selectedFounder.id) ? (
                  <button 
                    onClick={() => { handleConnectClick(selectedFounder.id); setShowProfileModal(false); }} 
                    style={{ flex: 1, background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "12px", borderRadius: "30px", fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer" }}
                  >
                    Connect
                  </button>
                ) : (
                  <button onClick={() => { handleMessageFounder(selectedFounder); setShowProfileModal(false); }} style={{ flex: 1, background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "12px", borderRadius: "30px", fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>💬 Message</button>
                )}
                <button onClick={() => setShowProfileModal(false)} style={{ flex: 1, background: "transparent", border: `1px solid ${colors.border}`, padding: "12px", borderRadius: "30px", fontSize: "13px", color: colors.textMuted, cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <button onClick={handleBackToHome} style={{
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
          marginBottom: "8px",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = colors.gold; e.currentTarget.style.transform = "translateX(-4px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.transform = "translateX(0)"; }}>
          ← Back
        </button>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #d4af37, #b8860b, #d4af37)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shine 3s linear infinite",
          margin: 0,
        }}>
          Founders Ecosystem
        </h1>
        <p style={{ fontSize: "13px", color: colors.textMuted, marginTop: "4px" }}>
          Connect with founders, mentors, and industry leaders
        </p>
        
        {/* Stats Bar */}
        <div style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          padding: "10px",
          backgroundColor: `${colors.gold}10`,
          borderRadius: "16px",
          justifyContent: "space-around"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: colors.gold }}>{connectedCount}</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>Connections</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: colors.gold }}>{founders.length}</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>Founders</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: colors.gold }}>{chatHistories.length}</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>Chats</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: colors.gold }}>{followingIds.length}</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>Following</div>
          </div>
        </div>
      </div>

      {/* Sort and Filter Row */}
      {activeTab === "discover" && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "30px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
              color: colors.text,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <option value="name">Sort: Name A-Z</option>
            <option value="recent">Sort: Most Followers</option>
            <option value="connections">Sort: Most Connected</option>
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as any)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "30px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
              color: colors.text,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <option value="all">📍 All Locations</option>
            <option value="near">📍 Near Me</option>
          </select>
        </div>
      )}

      {/* HORIZONTAL SCROLLABLE TABS */}
      <div 
        ref={tabsContainerRef}
        style={{
          marginBottom: "20px",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "4px 0 16px 0",
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
          @keyframes particleFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
          }
          @keyframes shine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes loading {
            0% { width: 20%; margin-left: 0%; }
            50% { width: 80%; margin-left: 20%; }
            100% { width: 20%; margin-left: 80%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.98); }
          }
          @keyframes blink {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          display: "inline-flex",
          gap: "10px",
          padding: "0 4px",
        }}>
          {[
            { id: "discover", label: "🔍 Discover", active: activeTab === "discover" },
            { id: "network", label: `🤝 Network (${connectedCount})`, active: activeTab === "network" },
            { id: "posts", label: "📰 Posts", active: activeTab === "posts" },
            { id: "chat", label: "💬 Chat", active: activeTab === "chat" },
          ].map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "40px",
                background: tab.active ? `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)` : "transparent",
                border: tab.active ? "none" : `1px solid ${colors.border}`,
                fontSize: "14px",
                fontWeight: tab.active ? "600" : "500",
                color: tab.active ? "#111827" : colors.textMuted,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!tab.active) {
                  e.currentTarget.style.backgroundColor = `${colors.gold}15`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!tab.active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>{tab.label.split(" ")[0]}</span>
              <span>{tab.label.split(" ").slice(1).join(" ") || tab.label}</span>
              {tab.active && (
                <div style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  height: "3px",
                  background: colors.gold,
                  animation: "shimmer 1.5s infinite",
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      {activeTab === "discover" && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search founder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 2,
              padding: "12px 16px",
              borderRadius: "40px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
              color: colors.text,
              fontSize: "13px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.gold}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
          />
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "40px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
              color: colors.text,
              fontSize: "13px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {allIndustries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      )}

      {/* Discover Tab Content */}
      {activeTab === "discover" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          {filteredFounders.map((founder) => (
            <div key={founder.id} style={{
              backgroundColor: colors.cardBg,
              borderRadius: "20px",
              padding: "16px",
              border: `1px solid ${colors.border}`,
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = colors.gold; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = colors.border; }}
            onClick={() => handleViewProfile(founder)}
            >
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${founder.avatarColor}, ${founder.avatarColor}80)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#fff",
                  flexShrink: 0,
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {founder.image ? (
                    <img src={founder.image} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    founder.avatarInitials
                  )}
                  {showOnlineStatus && (
                    <div style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      border: `2px solid ${colors.cardBg}`,
                    }} />
                  )}
                  {founder.verified && (
                    <div style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      backgroundColor: "#22c55e",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      border: `2px solid ${colors.cardBg}`,
                    }}>✅</div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.text, margin: 0 }}>{founder.name}</h3>
                        {founder.topFounder && <span style={{ fontSize: "11px", color: colors.gold }}>⭐ Top Founder</span>}
                        {founder.awardWinner && <span style={{ fontSize: "11px", color: "#f97316" }}>🏆 Award Winner</span>}
                      </div>
                      <p style={{ fontSize: "11px", color: colors.textMuted, margin: "2px 0 0 0" }}>{founder.role} • {founder.company}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFollow(founder.id, founder.name); }}
                        style={{
                          background: followingIds.includes(founder.id) ? "transparent" : `${colors.gold}20`,
                          border: followingIds.includes(founder.id) ? `1px solid ${colors.gold}` : "none",
                          padding: "6px 12px",
                          borderRadius: "30px",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: followingIds.includes(founder.id) ? colors.gold : colors.text,
                          cursor: "pointer",
                        }}
                      >
                        {followingIds.includes(founder.id) ? "🔔 Following" : "➕ Follow"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewProfile(founder); }}
                        style={{
                          background: "transparent",
                          border: `1px solid ${colors.gold}`,
                          padding: "6px 12px",
                          borderRadius: "30px",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: colors.gold,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleConnectClick(founder.id); }}
                        disabled={connectedIds.includes(founder.id)}
                        style={{
                          background: connectedIds.includes(founder.id) ? "transparent" : `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`,
                          border: connectedIds.includes(founder.id) ? `1px solid ${colors.gold}` : "none",
                          padding: "6px 16px",
                          borderRadius: "30px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: connectedIds.includes(founder.id) ? colors.gold : "#111827",
                          cursor: connectedIds.includes(founder.id) ? "default" : "pointer",
                        }}
                      >
                        {connectedIds.includes(founder.id) ? "✓ Connected" : "Connect"}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {founder.industries.slice(0, 3).map((ind, idx) => (
                      <span key={idx} style={{ fontSize: "10px", padding: "2px 10px", borderRadius: "20px", background: `${colors.gold}20`, color: colors.gold }}>{ind}</span>
                    ))}
                    {founder.industries.length > 3 && (
                      <span style={{ fontSize: "10px", padding: "2px 10px", borderRadius: "20px", background: `${colors.gold}20`, color: colors.gold }}>+{founder.industries.length - 3}</span>
                    )}
                  </div>

                  <p style={{ fontSize: "11px", color: colors.textMuted, marginTop: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
                    📍 {founder.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredFounders.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: colors.textMuted }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
              <p>No founders found matching your criteria</p>
              <button onClick={() => { setSearchTerm(""); setIndustryFilter("All Industries"); }} style={{ marginTop: "12px", background: `${colors.gold}20`, border: "none", padding: "8px 20px", borderRadius: "30px", fontSize: "12px", color: colors.gold, cursor: "pointer" }}>Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* Network Tab */}
      {activeTab === "network" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          {getConnectedFounders().length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: colors.cardBg, borderRadius: "20px", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤝</div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>No connections yet</h3>
              <p style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "20px" }}>Connect with founders to grow your network</p>
              <button onClick={() => setActiveTab("discover")} style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "10px 24px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Browse Founders</button>
            </div>
          ) : (
            getConnectedFounders().map((founder) => (
              <div key={founder.id} style={{
                backgroundColor: colors.cardBg,
                borderRadius: "20px",
                padding: "16px",
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${founder.avatarColor}, ${founder.avatarColor}80)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#fff",
                    overflow: "hidden",
                  }}>
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      founder.avatarInitials
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "600", color: colors.text, margin: 0 }}>{founder.name}</h4>
                      {founder.verified && <span style={{ fontSize: "10px" }}>✅</span>}
                    </div>
                    <p style={{ fontSize: "11px", color: colors.textMuted, margin: "2px 0 0 0" }}>{founder.role} • {founder.company}</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleMessageFounder(founder)} style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "6px 14px", borderRadius: "30px", fontSize: "11px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Message</button>
                    <button onClick={() => handleDisconnectClick(founder.id)} style={{ background: "transparent", border: `1px solid #ef4444`, padding: "6px 14px", borderRadius: "30px", fontSize: "11px", fontWeight: "500", color: "#ef4444", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button onClick={() => setActivePostTab("all")} style={{ flex: 1, background: activePostTab === "all" ? `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)` : "transparent", border: "none", padding: "8px", borderRadius: "30px", fontSize: "12px", fontWeight: activePostTab === "all" ? "600" : "500", color: activePostTab === "all" ? "#111827" : colors.textMuted, cursor: "pointer" }}>🌍 All Posts</button>
            <button onClick={() => setActivePostTab("following")} style={{ flex: 1, background: activePostTab === "following" ? `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)` : "transparent", border: "none", padding: "8px", borderRadius: "30px", fontSize: "12px", fontWeight: activePostTab === "following" ? "600" : "500", color: activePostTab === "following" ? "#111827" : colors.textMuted, cursor: "pointer" }}>👥 Following</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {(activePostTab === "all" ? getAllPosts() : getFollowingPosts()).map((post) => {
              const founder = founders.find(f => f.id === post.founderId);
              const isExpanded = expandedComments?.postId === post.id && expandedComments?.founderId === post.founderId;
              
              return (
                <div key={`${post.founderId}-${post.id}`} style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "16px",
                  padding: "16px",
                  border: `1px solid ${colors.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div onClick={() => handleViewProfile(founder!)} style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${founder?.avatarColor || colors.gold}, ${colors.gold}80)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#fff",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}>
                      {post.founderImage ? (
                        <img src={post.founderImage} alt={post.founderName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        post.founderAvatar
                      )}
                    </div>
                    <div onClick={() => handleViewProfile(founder!)} style={{ cursor: "pointer" }}>
                      <h4 style={{ fontSize: "13px", fontWeight: "600", color: colors.text, margin: 0 }}>{post.founderName}</h4>
                      <p style={{ fontSize: "10px", color: colors.textMuted, margin: "2px 0 0 0" }}>{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: "13px", color: colors.text, lineHeight: "1.5", marginBottom: "12px" }}>{post.content}</p>
                  
                  <div style={{ display: "flex", gap: "24px", marginBottom: "12px" }}>
                    <button onClick={() => handleLike(post.founderId, post.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: post.likedByUser ? colors.gold : colors.textMuted }}>
                      <span>👍</span> <span>{post.likes}</span>
                    </button>
                    <button onClick={() => handleDislike(post.founderId, post.id)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: post.dislikedByUser ? "#ef4444" : colors.textMuted }}>
                      <span>👎</span> <span>{post.dislikes || 0}</span>
                    </button>
                    <button onClick={() => setExpandedComments(isExpanded ? null : { postId: post.id, founderId: post.founderId })} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: colors.textMuted }}>
                      <span>💬</span> <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${colors.border}` }}>
                      {post.comments && post.comments.map((comment: Comment) => (
                        <div key={comment.id} style={{ marginBottom: "10px", padding: "10px", backgroundColor: `${colors.gold}10`, borderRadius: "12px" }}>
                          {editingCommentId?.commentId === comment.id && comment.author === "Admin" ? (
                            <div>
                              <input
                                type="text"
                                defaultValue={comment.text}
                                onBlur={(e) => handleEditComment(post.founderId, post.id, comment.id, e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleEditComment(post.founderId, post.id, comment.id, (e.target as HTMLInputElement).value)}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  borderRadius: "8px",
                                  border: `1px solid ${colors.gold}`,
                                  backgroundColor: colors.inputBg,
                                  color: colors.text,
                                  fontSize: "12px",
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                                <div style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  background: comment.author === "Admin" ? colors.gold : colors.textMuted,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10px",
                                  fontWeight: "600",
                                  color: comment.author === "Admin" ? "#111827" : "#fff",
                                }}>
                                  {comment.avatarInitials || "??"}
                                </div>
                                <strong style={{ fontSize: "11px", color: comment.author === "Admin" ? colors.gold : colors.textMuted }}>{comment.author}</strong>
                                <span style={{ fontSize: "9px", color: colors.textMuted }}>{comment.date}</span>
                                {comment.author === "Admin" && (
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => setEditingCommentId({ commentId: comment.id, postId: post.id, founderId: post.founderId, text: comment.text })} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: colors.gold, padding: "4px 10px", borderRadius: "20px" }}>✏️ Edit</button>
                                    <button onClick={() => handleDeleteComment(post.founderId, post.id, comment.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#ef4444", padding: "4px 10px", borderRadius: "20px" }}>🗑️ Delete</button>
                                  </div>
                                )}
                              </div>
                              <p style={{ fontSize: "12px", color: colors.textMuted, marginLeft: "32px" }}>{comment.text}</p>
                            </>
                          )}
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <input
                          type="text"
                          placeholder="Write a comment as Admin..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.founderId, post.id)}
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "30px",
                            border: `1px solid ${colors.gold}`,
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            fontSize: "12px",
                            outline: "none",
                          }}
                        />
                        <button onClick={() => handleAddComment(post.founderId, post.id)} style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "8px 20px", borderRadius: "30px", fontSize: "11px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Post as Admin</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {((activePostTab === "all" ? getAllPosts() : getFollowingPosts()).length === 0) && (
              <div style={{ textAlign: "center", padding: "40px", color: colors.textMuted }}>No posts to show</div>
            )}
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          {getConnectedFounders().length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: colors.cardBg, borderRadius: "20px", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: colors.text, marginBottom: "8px" }}>No messages yet</h3>
              <p style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "20px" }}>Connect with founders to start chatting</p>
              <button onClick={() => setActiveTab("discover")} style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`, border: "none", padding: "10px 24px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer" }}>Browse Founders</button>
            </div>
          ) : (
            getConnectedFounders().map((founder) => {
              const chatHistory = getChatHistory(founder.id);
              const lastMessage = chatHistory[chatHistory.length - 1];
              return (
                <div key={founder.id} onClick={() => handleMessageFounder(founder)} style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "16px",
                  padding: "14px",
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = colors.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = colors.border; }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${founder.avatarColor}, ${founder.avatarColor}80)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#fff",
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      founder.avatarInitials
                    )}
                    {showOnlineStatus && (
                      <div style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        border: `2px solid ${colors.cardBg}`,
                      }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: colors.text, margin: 0 }}>{founder.name}</h4>
                      {founder.verified && <span style={{ fontSize: "10px" }}>✅</span>}
                    </div>
                    <p style={{ fontSize: "10px", color: colors.textMuted, margin: "2px 0 0 0" }}>
                      {lastMessage ? (lastMessage.sender === "user" ? `You: ${lastMessage.text.substring(0, 35)}` : `${founder.name.split(' ')[0]}: ${lastMessage.text.substring(0, 35)}`) : "Tap to start a conversation"}
                    </p>
                  </div>
                  {lastMessage && !lastMessage.seen && (
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: colors.gold,
                    }} />
                  )}
                  <span style={{ fontSize: "12px", color: colors.gold }}>→</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedFounder && (
        <>
          <div onClick={() => setShowChatModal(false)} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }} />
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "360px",
            maxWidth: "calc(100% - 32px)",
            height: "560px",
            maxHeight: "75vh",
            backgroundColor: colors.cardBg,
            borderRadius: "28px",
            zIndex: 151,
            border: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${selectedFounder.avatarColor}, ${selectedFounder.avatarColor}80)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#fff",
                  overflow: "hidden",
                }}>
                  {selectedFounder.image ? (
                    <img src={selectedFounder.image} alt={selectedFounder.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    selectedFounder.avatarInitials
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", color: colors.text, margin: 0 }}>{selectedFounder.name}</h4>
                    {selectedFounder.verified && <span style={{ fontSize: "11px" }}>✅</span>}
                  </div>
                  <p style={{ fontSize: "11px", color: colors.gold, margin: "2px 0 0 0" }}>{selectedFounder.company}</p>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", color: colors.textMuted, padding: "4px", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px", scrollBehavior: "smooth" }}>
              
              <div style={{
                backgroundColor: `${colors.gold}10`,
                borderRadius: "16px",
                marginBottom: "8px",
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "600", color: colors.gold }}>💡 Suggested Questions ({presetQuestions.length})</span>
                  <span style={{ fontSize: "14px", color: colors.gold }}>{showPresets ? "−" : "+"}</span>
                </button>
                
                {showPresets && (
                  <div style={{ padding: "0 12px 12px 12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {presetQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChatInput(q.text.replace("{industry}", selectedFounder.industries[0]))}
                        style={{
                          background: `${colors.gold}20`,
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          color: colors.text,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.gold}40`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = `${colors.gold}20`; }}
                      >
                        {q.emoji} {q.text.substring(0, 28)}...
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start", gap: "6px" }}>
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "10px 14px",
                      borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      backgroundColor: msg.sender === "user" ? colors.gold : (theme === "dark" ? "#3a3a3a" : "#e2e8f0"),
                      color: msg.sender === "user" ? "#111827" : colors.text,
                      fontSize: "13px",
                      wordBreak: "break-word",
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (msg.sender === "user") setShowReactionPicker(msg.id);
                    }}
                  >
                    {msg.text}
                    {msg.reaction && <span style={{ marginLeft: "8px", fontSize: "12px" }}>{msg.reaction}</span>}
                  </div>
                  
                  {msg.sender === "user" && editingMessageId !== msg.id && (
                    <div style={{ display: "flex", gap: "8px", opacity: 0.6 }}>
                      <button onClick={() => { setEditingMessageId(msg.id); setEditingMessageText(msg.text); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: colors.textMuted, padding: "2px 6px", borderRadius: "12px" }}>✏️ Edit</button>
                      <button onClick={() => handleDeleteChatMessage(msg.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: colors.textMuted, padding: "2px 6px", borderRadius: "12px" }}>🗑️ Delete</button>
                    </div>
                  )}
                  
                  {editingMessageId === msg.id && msg.sender === "user" && (
                    <div style={{ maxWidth: "75%", width: "100%", marginTop: "4px" }}>
                      <input
                        type="text"
                        value={editingMessageText}
                        onChange={(e) => setEditingMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleEditChatMessage(msg.id, editingMessageText)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "16px",
                          border: `1px solid ${colors.gold}`,
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          fontSize: "12px",
                          outline: "none",
                        }}
                        autoFocus
                      />
                      <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                        <button onClick={() => handleEditChatMessage(msg.id, editingMessageText)} style={{ fontSize: "11px", color: colors.gold, background: "transparent", border: "none", cursor: "pointer" }}>Save</button>
                        <button onClick={() => { setEditingMessageId(null); setEditingMessageText(""); }} style={{ fontSize: "11px", color: colors.textMuted, background: "transparent", border: "none", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  
                  {showReactionPicker === msg.id && (
                    <div style={{
                      backgroundColor: colors.cardBg,
                      borderRadius: "20px",
                      padding: "6px",
                      display: "flex",
                      gap: "8px",
                      border: `1px solid ${colors.border}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      marginTop: "4px",
                    }}>
                      {["👍", "❤️", "😂", "🎉"].map(emoji => (
                        <button key={emoji} onClick={() => addMessageReaction(msg.id, emoji as any)} style={{ background: "transparent", border: "none", fontSize: "16px", cursor: "pointer", padding: "4px" }}>{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isFounderTyping && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: "18px",
                    backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
                    color: colors.text,
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                    <span style={{ animation: "blink 1.4s infinite" }}>•</span>
                    <span style={{ animation: "blink 1.4s infinite 0.2s" }}>•</span>
                    <span style={{ animation: "blink 1.4s infinite 0.4s" }}>•</span>
                    <span style={{ fontSize: "11px", marginLeft: "4px" }}>typing...</span>
                  </div>
                </div>
              )}
              
              {isTypingResponse && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius: "18px",
                    backgroundColor: theme === "dark" ? "#3a3a3a" : "#e2e8f0",
                    color: colors.text,
                    fontSize: "13px",
                  }}>
                    {displayedResponse}
                    <span style={{
                      display: "inline-block",
                      width: "2px",
                      height: "14px",
                      backgroundColor: colors.gold,
                      marginLeft: "2px",
                      animation: "blink 1s step-end infinite",
                    }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            <div style={{ padding: "16px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: "10px", flexShrink: 0 }}>
              <input
                type="text"
                placeholder={`Ask ${selectedFounder.name.split(' ')[0]}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "30px",
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  fontSize: "13px",
                  outline: "none",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = colors.gold}
                onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
              />
              <button onClick={sendChatMessage} style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.gold}80)`,
                border: "none",
                padding: "12px 22px",
                borderRadius: "30px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#111827",
                cursor: "pointer",
              }}>
                Send
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}