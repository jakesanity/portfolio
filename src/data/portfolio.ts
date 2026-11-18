export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  type: string;
  period: string;
  role: string;
  status: string;
  description: string;
  problem: string;
  solution: string;
  highlights: string[];
  stack: string[];
  tags: string[];
  metrics: { label: string; value: string }[];
  image: string;
  githubUrl?: string;
}

export const personalInfo = {
  name: "Aldwin James Bucio",
  firstName: "Aldwin",
  title: "Information Technology Student",
  subtitle: "Full-Stack Developer & UI/UX Designer",
  email: "abucio_230000001128@uic.edu.ph",
  phone: "+63 912 371 3956",
  linkedin: "https://linkedin.com/in/aldwinjamesbucio",
  github: "https://github.com/jakesanity",
  location: "Davao City, Philippines",
  coordinates: {
    node: "ph-dvo-01",
    lat: "7.0731 n",
    lon: "125.6128 e",
  },
  photo: "/images/profile.jpg",
  resumeUrl: "/docs/Bucio-CV.pdf",
};

export const aboutData = {
  background: `I am Aldwin James Bucio, an Information Technology student at the University of the Immaculate Conception in Davao City. Driven by a deep curiosity for how software systems shape everyday workflows, I work at the intersection of full-stack engineering and clean UI/UX design. My focus is on turning complex institutional and human processes into dependable, intuitive digital products.`,

  mission: `My mission is to engineer meaningful, efficient, and user-centered software systems. I aim to bridge the gap between complex backend logic and human-friendly interfaces—ensuring that every platform I build is accessible, maintainable, and genuinely useful in real-world environments.`,

  vision: `I envision myself as a versatile software engineer and systems architect who contributes to high-impact digital transformation—building tools for healthcare, academic research, and data-driven organizations across the Philippines and beyond.`,

  goals: `Short-term, I am focused on deepening my architecture skills across modern full-stack frameworks, relational databases, and machine learning integration while completing my BSIT degree. Long-term, I aim to lead engineering teams and ship production platforms that solve community-scale problems.`,

  motivation: `I am driven by the tangible impact of well-crafted software. Whether it is reducing bottlenecks in an ethics committee review pipeline or helping families monitor elderly loved ones remotely, seeing a system simplify someone's day fuels my commitment to continuous improvement.`,

  highlights: {
    background: [
      "BS in Information Technology at UIC Davao City (2023 – Present)",
      "Combines full-stack implementation with structured UI/UX design in Figma",
      "Hands-on experience across workflow platforms, healthcare apps, and ML tools",
    ],
    mission: [
      "Translate complex institutional rules into clear, guided user flows",
      "Prioritize accessibility, fast load times, and maintainable code structure",
      "Deliver end-to-end systems from database schema to polished interface",
    ],
    vision: [
      "Build production-grade software that empowers local institutions and teams",
      "Bridge software engineering, interface design, and applied data science",
      "Grow into a dependable technical partner for high-impact products",
    ],
    goals: [
      "Master TypeScript, React, Laravel, and scalable SQL database patterns",
      "Contribute to real-world engineering teams through internships and freelance work",
      "Expand applied machine learning and cloud deployment capabilities",
    ],
    motivation: [
      "Solving real operational bottlenecks rather than building toy demos",
      "Continuous learning across design systems, backend architecture, and AI",
      "Delivering reliable work on schedule with clear client and team communication",
    ],
  },

  education: [
    {
      degree: "Bachelor of Science in Information Technology",
      school: "University of the Immaculate Conception, Davao City",
      year: "2023 – Present",
      description:
        "Focusing on full-stack web development, UI/UX interface engineering, relational database management, and software systems architecture.",
    },
    {
      degree: "Senior High School – ICT Strand",
      school: "University of the Immaculate Conception, Davao City",
      year: "2021 – 2023",
      description:
        "Specialized in Information and Communications Technology with foundational coursework in programming, digital media production, and computer systems.",
    },
  ],

  certifications: [
    "Google IT Support Professional Certificate – Google / Coursera",
    "Responsive Web Design – freeCodeCamp",
    "JavaScript Algorithms and Data Structures – freeCodeCamp",
    "Introduction to Cybersecurity – Cisco Networking Academy",
  ],

  achievements: [
    {
      title: "Capstone & Systems Showcase Presenter",
      description:
        "Presented full-stack institutional workflow and healthcare system prototypes during department evaluations, earning commendations for UI clarity and workflow completeness.",
    },
    {
      title: "Freelance Delivery Milestone",
      description:
        "Delivered multiple end-to-end freelance UI/UX, graphic design, and web layout engagements on schedule with iterative client reviews.",
    },
  ],
};

export const skillsData = {
  technical: [
    { name: "HTML / CSS / Tailwind", level: 90 },
    { name: "JavaScript / TypeScript", level: 82 },
    { name: "React.js", level: 78 },
    { name: "Python", level: 75 },
    { name: "PHP / Laravel", level: 70 },
    { name: "MySQL / PostgreSQL", level: 76 },
    { name: "Java", level: 68 },
    { name: "Git & Linux CLI", level: 85 },
  ],
  soft: [
    "Systems Thinking",
    "Problem Solving",
    "UI/UX Attention to Detail",
    "Team Collaboration",
    "Time Management",
    "Client Communication",
    "Adaptability",
    "Fast Technical Learner",
  ],
  software: [
    "VS Code",
    "Figma",
    "Git & GitHub",
    "Postman",
    "MySQL Workbench",
    "XAMPP / Apache",
    "Adobe Photoshop",
    "Canva",
    "Notion / Trello",
    "Google Workspace",
  ],
  services: [
    {
      title: "Full-Stack Web Development",
      description:
        "Engineering responsive, structured web applications from frontend components to relational database backends.",
      icon: "Code",
    },
    {
      title: "UI/UX & Product Design",
      description:
        "Designing high-contrast, intuitive user interfaces, wireframes, and interactive prototypes in Figma.",
      icon: "Palette",
    },
    {
      title: "Database Architecture",
      description:
        "Modeling normalized SQL schemas, role-based access records, and efficient queries for workflow platforms.",
      icon: "Database",
    },
    {
      title: "System & Technical Documentation",
      description:
        "Authoring clear system architecture specs, ER diagrams, user manuals, and capstone research reports.",
      icon: "FileText",
    },
    {
      title: "IT Support & Diagnostics",
      description:
        "Troubleshooting operating systems, local development environments, networking, and workstation setups.",
      icon: "Settings",
    },
    {
      title: "Digital & Visual Media",
      description:
        "Producing cohesive brand visuals, layout assets, and multimedia content using Adobe tools and Canva.",
      icon: "Image",
    },
  ],
};

export const experienceData = [
  {
    role: "Freelance UI/UX & Digital Designer",
    company: "Self-Employed · Davao City",
    period: "2023 – Present",
    type: "Freelance",
    responsibilities: [
      "Design web interfaces, interactive Figma prototypes, and brand visual assets for local clients and student organizations.",
      "Translate client requirements into structured layouts, design tokens, and production-ready frontend assets on schedule.",
      "Collaborate directly with stakeholders through iterative feedback cycles from wireframe to final delivery.",
    ],
  },
  {
    role: "Full-Stack Student Systems Developer",
    company: "University of the Immaculate Conception · Project Teams",
    period: "2023 – Present",
    type: "Academic Systems",
    responsibilities: [
      "Architected and built RECHECK, a centralized ethics committee research review workflow system with role-based status tracking.",
      "Designed and prototyped ElderlyCare (remote caregiver monitoring platform) and InsightAi (ML customer segmentation and trend forecasting).",
      "Led frontend UI engineering, relational database schema design, and technical presentation defense for project evaluations.",
    ],
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: "recheck",
    title: "RECHECK",
    category: "Workflow & Governance System",
    type: "Institutional Platform",
    period: "2023 – Present",
    role: "Full-Stack Developer & System Designer",
    status: "Active Prototype",
    description:
      "A centralized web platform that digitizes and streamlines the end-to-end research ethics submission, multi-reviewer evaluation, and clearance approval pipeline for academic ethics committees.",
    problem:
      "Academic ethics committees often rely on fragmented email threads, paper forms, and manual spreadsheets, leading to lost revisions, unclear review status for researchers, and slow clearance turnaround.",
    solution:
      "Engineered a role-based workflow platform with structured protocol intake, automated stage transitions, reviewer assignment queues, and an immutable audit log for every revision and decision.",
    highlights: [
      "4-stage gated approval pipeline (Intake → Initial Screening → Board Review → Clearance Issued)",
      "Role-based dashboards for Researchers, Ethics Secretariat, and Board Reviewers",
      "Document version tracking with structured inline revision feedback and compliance checklists",
    ],
    stack: ["React", "TypeScript", "PHP / Laravel", "MySQL", "Tailwind CSS", "Figma"],
    tags: ["System Design", "RBAC Workflow", "Academic Research"],
    metrics: [
      { label: "Review Pipeline", value: "4 Stages" },
      { label: "Access Control", value: "3 Roles" },
      { label: "Audit Tracking", value: "100% Logged" },
    ],
    image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800",
    githubUrl: "https://github.com/jakesanity",
  },
  {
    id: "elderlycare",
    title: "ElderlyCare",
    category: "Healthcare & Remote Monitoring",
    type: "Full-Stack Web Platform",
    period: "2024",
    role: "Product Designer & Full-Stack Developer",
    status: "System Prototype",
    description:
      "A connected care coordination platform enabling families and caregivers to monitor daily vitals, manage medication schedules, coordinate medical appointments, and share real-time care logs remotely.",
    problem:
      "Families caring for aging relatives struggle with missed medication doses, scattered vital sign logs, and communication gaps between on-site caregivers and remote family members.",
    solution:
      "Designed an accessible, high-clarity care dashboard featuring real-time vital sign logging, automated medication reminders, shared appointment calendars, and instant caregiver-to-family handoff notes.",
    highlights: [
      "Real-time health telemetry log for blood pressure, heart rate, glucose, and daily wellness status",
      "Interactive medication adherence tracker with dose windows and missed-dose escalation alerts",
      "Shared caregiver shift timeline and appointment scheduling between family members and clinics",
    ],
    stack: ["JavaScript", "React", "HTML / CSS", "MySQL", "REST API", "Figma"],
    tags: ["Healthcare", "Care Coordination", "Remote Monitoring"],
    metrics: [
      { label: "Core Modules", value: "4 Dashboards" },
      { label: "Care Sync", value: "Real-Time" },
      { label: "UX Focus", value: "High-Contrast" },
    ],
    image: "https://images.pexels.com/photos/7551661/pexels-photo-7551661.jpeg?auto=compress&cs=tinysrgb&w=800",
    githubUrl: "https://github.com/jakesanity",
  },
  {
    id: "insightai",
    title: "InsightAi",
    category: "Machine Learning & Analytics",
    type: "Applied ML System",
    period: "2024",
    role: "ML Developer & Data Analyst",
    status: "Academic Research Build",
    description:
      "An applied machine learning analytics system that forecasts business demand trends and segments customers by purchasing behavior to power data-driven merchandising and retention decisions.",
    problem:
      "Small and mid-sized retail businesses frequently make inventory and marketing decisions on intuition because raw transaction logs are not translated into actionable customer cohorts or demand forecasts.",
    solution:
      "Built an end-to-end Python analytics pipeline combining RFM (Recency, Frequency, Monetary) feature engineering, unsupervised clustering for customer segmentation, and time-series trend forecasting with an interactive visual report.",
    highlights: [
      "Unsupervised K-Means customer segmentation classifying buyers into distinct behavioral tiers",
      "Time-series sales and demand trend forecasting with seasonal pattern detection",
      "Visual decision-support dashboard translating model outputs into actionable business segments",
    ],
    stack: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Data Visualization", "SQL"],
    tags: ["Machine Learning", "Demand Forecasting", "Customer Segmentation"],
    metrics: [
      { label: "Customer Cohorts", value: "4 Segments" },
      { label: "Pipeline", value: "RFM + K-Means" },
      { label: "Output", value: "Predictive" },
    ],
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    githubUrl: "https://github.com/jakesanity",
  },
];
