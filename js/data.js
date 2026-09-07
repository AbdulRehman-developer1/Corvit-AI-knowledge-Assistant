/* ============================================================
   CORVIT SYSTEMS — Knowledge Dataset
   This file is the single source of truth for the page AND the
   AI Counselor chatbot. Edit these objects to update course
   info, fees, campuses or FAQs — everything (cards, comparison
   table, fee calculator, chatbot answers) reads from here.
   ============================================================ */

const CATEGORIES = [
  { id: "all", label: "All Courses" },
  { id: "networking", label: "Networking & Cisco" },
  { id: "ai", label: "AI & Data Science" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "cyber", label: "Cyber Security" },
  { id: "web", label: "Web Development" },
];

/* Tailwind-safe color tokens per category (used for badges/buttons) */
const CATEGORY_STYLE = {
  networking: { badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30", btn: "bg-cyan-500 hover:bg-cyan-400", dot: "bg-cyan-400" },
  ai:         { badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", btn: "bg-indigo-500 hover:bg-indigo-400", dot: "bg-indigo-400" },
  cloud:      { badge: "bg-amber-500/15 text-amber-300 border-amber-500/30", btn: "bg-amber-500 hover:bg-amber-400", dot: "bg-amber-400" },
  cyber:      { badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", btn: "bg-emerald-500 hover:bg-emerald-400", dot: "bg-emerald-400" },
  web:        { badge: "bg-purple-500/15 text-purple-300 border-purple-500/30", btn: "bg-purple-500 hover:bg-purple-400", dot: "bg-purple-400" },
  advcisco:   { badge: "bg-teal-500/15 text-teal-300 border-teal-500/30", btn: "bg-teal-500 hover:bg-teal-400", dot: "bg-teal-400" },
};

const COURSES = [
  {
    id: "ccna",
    name: "Cisco CCNA 200-301",
    category: "networking",
    categoryLabel: "Cisco Certification",
    icon: "🌐",
    duration: "2.5 Months",
    durationRange: "2 – 2.5 Months",
    description: "Routing, Switching, IP Services, Network Security, Automation, and Physical Cisco Hardware Rack Labs across all Corvit campuses.",
    prerequisites: "Basic Computer Knowledge",
    hardware: "Physical Cisco Catalyst Racks",
    placement: "High Demand",
    feeMin: 32000,
    feeMax: 35000,
    installments: 2,
    syllabus: ["IP Addressing & Subnetting", "Routing (OSPF, EIGRP, Static)", "Switching & VLANs", "Network Security Fundamentals", "Automation & Programmability", "Hands-on Cisco Hardware Labs"],
  },
  {
    id: "python-ai",
    name: "Python AI & Machine Learning",
    category: "ai",
    categoryLabel: "AI & Data Science",
    icon: "🤖",
    duration: "3.5 Months",
    durationRange: "3.5 Months",
    description: "NumPy, Pandas, Scikit-Learn, PyTorch Deep Learning, NLP, Generative AI & RAG Pipeline engineering.",
    prerequisites: "High School Math / Python",
    hardware: "PyTorch & GPU Workstations",
    placement: "Top Tier",
    feeMin: 40000,
    feeMax: 45000,
    installments: 2,
    syllabus: ["Python for Data Science", "NumPy, Pandas & Visualization", "Machine Learning with Scikit-Learn", "Deep Learning with PyTorch", "NLP & Transformers", "Generative AI & RAG Pipelines"],
  },
  {
    id: "aws",
    name: "AWS Solutions Architect",
    category: "cloud",
    categoryLabel: "Cloud Computing",
    icon: "☁️",
    duration: "2.5 Months",
    durationRange: "2.5 Months",
    description: "EC2, S3, VPC Networking, Auto-scaling, Lambda, IAM policies & Official AWS console.",
    prerequisites: "Linux & Basic Networking",
    hardware: "Official AWS Cloud Console",
    placement: "High Demand",
    feeMin: 35000,
    feeMax: 40000,
    installments: 2,
    syllabus: ["EC2 & S3 Fundamentals", "VPC Networking", "Auto-scaling & Load Balancing", "Lambda & Serverless", "IAM Policies & Security", "Solutions Architect Exam Prep"],
  },
  {
    id: "ceh",
    name: "CEH Ethical Hacking v12",
    category: "cyber",
    categoryLabel: "Cyber Security",
    icon: "🛡️",
    duration: "3 Months",
    durationRange: "3 Months",
    description: "Nmap footprinting, Wireshark, Metasploit, OWASP Top 10 vulnerabilities, Penetration Testing, SOC Analysis.",
    prerequisites: "CCNA / Linux Basics",
    hardware: "Practical Cyber Range Labs",
    placement: "Cyber Specialist",
    feeMin: 42000,
    feeMax: 48000,
    installments: 2,
    syllabus: ["Footprinting & Reconnaissance (Nmap)", "Network Sniffing (Wireshark)", "Exploitation (Metasploit)", "OWASP Top 10 Vulnerabilities", "Penetration Testing Methodology", "SOC Analysis & Incident Response"],
  },
  {
    id: "mern",
    name: "Full Stack MERN Web Dev",
    category: "web",
    categoryLabel: "Web Development",
    icon: "💻",
    duration: "3.5 Months",
    durationRange: "3.5 Months",
    description: "React.js, Node.js, Express REST APIs, MongoDB database, Tailwind CSS, JWT authentication & Cloud deployment.",
    prerequisites: "Basic Computer Literacy",
    hardware: "Live Cloud Deployment Labs",
    placement: "Freelance Ready",
    feeMin: 35000,
    feeMax: 40000,
    installments: 2,
    syllabus: ["HTML, CSS & Tailwind CSS", "JavaScript & React.js", "Node.js & Express REST APIs", "MongoDB Database Design", "JWT Authentication", "Cloud Deployment"],
  },
  {
    id: "ccnp",
    name: "Cisco CCNP Enterprise",
    category: "advcisco",
    categoryLabel: "Advanced Cisco",
    icon: "🛰️",
    duration: "3.5 Months",
    durationRange: "3.5 Months",
    description: "ENCOR 350-401 & ENARSI 300-410, BGP, Advanced OSPF, SD-WAN architecture, Cisco DNA Center & VPNs.",
    prerequisites: "CCNA Certified or Equivalent",
    hardware: "Enterprise Cisco Hardware Racks",
    placement: "Senior Network Engineer",
    feeMin: 55000,
    feeMax: 55000,
    installments: 2,
    syllabus: ["ENCOR 350-401", "ENARSI 300-410", "BGP & Advanced OSPF", "SD-WAN Architecture", "Cisco DNA Center", "Enterprise VPNs"],
  },
];

/* advcisco isn't in the filter tabs by default (matches the reference site's
   "Networking & Cisco" grouping) — map it under networking for filtering */
const CATEGORY_FILTER_MAP = { advcisco: "networking" };

const CAMPUSES = [
  {
    id: "lahore",
    name: "Lahore (Head Office)",
    tag: "Head Office",
    tagStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    icon: "🏢",
    address: "11A-D1, Ghalib Road, Gulberg III, Lahore, Punjab",
    phones: ["+92 303 8888555", "+92 42 35717271"],
    email: "info@corvit.com",
    hours: "Mon–Sat 9AM–9PM",
  },
  {
    id: "islamabad",
    name: "Rawalpindi / Islamabad",
    tag: "Federal Region",
    tagStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    icon: "🏢",
    address: "6th Road / Murree Road, Shamsabad, Rawalpindi / Blue Area Islamabad",
    phones: ["+92 51 4852555", "+92 301 8555000"],
    email: "islamabad@corvit.com",
    hours: "Mon–Sat 9AM–8PM",
  },
  {
    id: "faisalabad",
    name: "Faisalabad",
    tag: "Industrial Hub",
    tagStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "🏢",
    address: "1st Floor, Ground+ Commercial Plaza, Faisalabad",
    phones: ["+92 41 8888555"],
    email: "faisalabad@corvit.com",
    hours: "Mon–Sat 9AM–8PM",
  },
  {
    id: "multan",
    name: "Multan",
    tag: "South Punjab",
    tagStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "🏢",
    address: "Near Chungi No. 9, Bosan Road, Multan",
    phones: ["+92 300 8888555"],
    email: "multan@corvit.com",
    hours: "Mon–Sat 9AM–7PM",
  },
  {
    id: "peshawar",
    name: "Peshawar",
    tag: "KP Region",
    tagStyle: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: "🏢",
    address: "University Road, Peshawar",
    phones: ["+92 304 8888555"],
    email: "peshawar@corvit.com",
    hours: "Mon–Sat 9AM–7PM",
  },
  {
    id: "karachi",
    name: "Karachi",
    tag: "Sindh Region",
    tagStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    icon: "🏢",
    address: "Shahrah-e-Faisal, Karachi",
    phones: ["+92 305 8888555"],
    email: "karachi@corvit.com",
    hours: "Mon–Sat 9AM–7PM",
  },
];

const NAVTTC = {
  eligibility: [
    "Age Limit: 18 to 40 years old",
    "Valid Pakistani CNIC / Smart Card",
    "Education: 12 – 16 years based on course track",
    "80%+ Biometric Attendance Requirement",
  ],
  perks: [
    { title: "100% Free Tuition", desc: "Zero admission fee, zero monthly tuition, free toolkits & exam voucher.", icon: "🎁" },
    { title: "Monthly Stipend", desc: "Receive monthly financial support allowance during training.", icon: "💳" },
  ],
};

const FAQS = [
  {
    q: "What is the admission process at Corvit Systems?",
    a: "Visit any campus or apply online, take a short counseling session (or use the AI Counselor), choose your course, and pay the admission fee to confirm your seat. Classes begin on the next scheduled batch date.",
  },
  {
    q: "What are the payment / installment options?",
    a: "Corvit offers flexible 2-month installment plans (50% at admission + 50% after 30 days), or a lump sum single payment with a 5% instant discount. Bank transfer, cash, and card swipe are all accepted.",
  },
  {
    q: "Do Corvit courses include official certification exam vouchers?",
    a: "Yes — certification tracks such as CCNA, CCNP, AWS, and CEH include the official exam voucher as part of the course fee.",
  },
  {
    q: "Is online / remote learning available for out-of-city students?",
    a: "Yes, live online sessions are available for most courses, though Cisco hardware labs are best completed at a physical campus with Cisco racks.",
  },
  {
    q: "Does Corvit offer job placement support after course completion?",
    a: "Yes — Corvit provides placement support and an industry partner network, with placement strength varying by track (see the Comparison Matrix for placement demand per course).",
  },
];

const CAMPUS_CITIES = CAMPUSES.map((c) => c.name.split(" / ")[0].split(" (")[0]);
