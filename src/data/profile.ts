export const profile = {
  name: "Usman Hafeez",
  handle: "usmanhafeez147",
  title: "System Architect and Full-Stack Tech Lead",
  location: "Faisalabad, Pakistan",
  siteUrl: "https://usmanhafeez147.vercel.app",
  tagline:
    "I architect and ship SaaS products that run in production, and I own both the code and the cloud platform underneath it.",
  summary: [
    "I have spent more than nine years building full-stack products and the infrastructure they run on. At Teamcube I designed a multi-tenant, no-code website builder on AWS EKS that now deploys 100+ websites and cut time to launch by 70%.",
    "I lead teams of four to six developers, and I care about delivery that holds up under real users: sensible architecture, CI/CD, monitoring and clear ownership of production.",
    "Lately I have been building AI agents, RAG pipelines and MCP servers, and wiring them into real products.",
  ],
  email: "usmanhafeez147@gmail.com",
  phone: "+92 343 1854867",
  phoneE164: "+923431854867",
  whatsapp: "https://wa.me/923431854867",
  links: {
    github: "https://github.com/usmanhafeez147",
    linkedin: "https://www.linkedin.com/in/usmanhafeez147",
    upwork: "https://www.upwork.com/freelancers/~01653fe16c02cc7163",
    fiverr: "https://www.fiverr.com/usmanhafeez447",
  },
};

export const stats = [
  { value: "9+", label: "Years in full-stack and DevOps" },
  { value: "100+", label: "Websites deployed by the Teamcube platform" },
  { value: "99.9%", label: "Uptime held across client systems" },
  { value: "4 to 6", label: "Developers led" },
];

export const skillGroups = [
  {
    name: "Frontend",
    items: ["Next.js", "React", "Vue and Nuxt", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Express",
      "Python and FastAPI",
      "Laravel and PHP",
      "REST and WebSockets",
    ],
  },
  {
    name: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    name: "Cloud and DevOps",
    items: [
      "AWS (EKS and more)",
      "Kubernetes",
      "Docker",
      "Terraform",
      "GitHub Actions CI/CD",
      "Nginx",
      "GCP",
    ],
  },
  {
    name: "AI",
    items: [
      "AI agents",
      "RAG",
      "LangChain and LangGraph",
      "Model Context Protocol (MCP)",
      "OpenAI Agent SDK",
    ],
  },
  {
    name: "Also",
    items: ["MQTT and IoT", "C++ on Linux", "Firebase Auth", "Multi-tenant SaaS", "RBAC"],
  },
];

export const experience = [
  {
    role: "System Architect and Full-Stack Tech Lead",
    company: "Teamcube",
    period: "March 2024 to present",
    summary:
      "Design and lead the engineering of a multi-tenant, no-code website-builder SaaS on AWS EKS.",
    points: [
      "Next.js and Vue frontends with Node.js and Python services on PostgreSQL and MongoDB.",
      "The platform generates and deploys 100+ websites and cut time to launch by 70%.",
      "Moved releases to GitHub Actions CI/CD, with production incidents down 75%.",
      "Lowered cloud costs by 20 to 40% while leading a team of 4 to 6 developers.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Dot Kreativ (formerly Whistle-tech)",
    period: "October 2021 to December 2022",
    summary: "Part-time role alongside DevStrings.",
    points: [
      "Led web development and microservices architecture for 5+ concurrent client projects at 99.9% uptime.",
      "Built REST APIs and modular Node.js and PHP services that cut integration time for new features by about 30%.",
      "Tuned MySQL and MongoDB schemas for high-load endpoints and set up automated deployment and auto-scaling.",
      "Projects included Geniie.uk, a food delivery platform on the MEAN and MERN stacks.",
    ],
  },
  {
    role: "Senior Software Engineer and DevOps Engineer",
    company: "DevStrings",
    period: "March 2020 to December 2024",
    summary:
      "Led full-stack and DevOps engineering for nearly five years across 10+ client systems on MERN, MEAN and Python.",
    points: [
      "Built deployment pipelines and auto-scaling infrastructure that reduced manual release effort by about 60%.",
      "Tuned PostgreSQL and MongoDB queries to cut response times on high-load endpoints by about 40%.",
      "Added monitoring and alerting that halved mean time to resolution.",
      "Key work included the LockMesh device management platform and its encrypted messaging apps.",
    ],
  },
];

export const projects = [
  {
    name: "Fleet and Passenger Transport Platform",
    blurb:
      "A multi-tenant fleet and passenger transport platform: one Node.js API behind Next.js portals, Kotlin, Expo and web driver apps, and a public QR-code bus tracker with live GPS over WebSockets and role-based access. It includes an MCP server with 29 tools that lets an AI assistant query live fleet data.",
    tags: ["Node.js", "Next.js", "WebSockets", "MCP", "RBAC"],
  },
  {
    name: "Teamcube Website Builder",
    blurb:
      "The multi-tenant, no-code website builder on AWS EKS that generates and deploys 100+ websites, with CI/CD on GitHub Actions and a 70% shorter time to launch.",
    tags: ["AWS EKS", "Next.js", "Vue", "PostgreSQL", "GitHub Actions"],
  },
  {
    name: "Seamline",
    blurb:
      "A made-to-measure tailoring platform with customer and shop portals and branded storefronts.",
    tags: ["SaaS", "Multi-tenant", "Next.js"],
  },
  {
    name: "OpenLDAP Key Directory for GnuPG",
    blurb:
      "An OpenLDAP-based directory for publishing and looking up GnuPG encryption keys.",
    tags: ["OpenLDAP", "GnuPG", "Security"],
  },
  {
    name: "LockMesh",
    blurb:
      "A device management platform with encrypted messaging apps, built during my time at DevStrings.",
    tags: ["Device management", "Encryption", "Messaging"],
  },
  {
    name: "Geniie.uk",
    blurb:
      "A food delivery platform built on the MEAN and MERN stacks while at Dot Kreativ.",
    tags: ["MEAN", "MERN", "Delivery"],
  },
  {
    name: "Fribe.io",
    blurb:
      "A NestJS and MongoDB platform using MQTT messaging, with careful transaction handling.",
    tags: ["NestJS", "MongoDB", "MQTT"],
  },
  {
    name: "Shopiz.io",
    blurb: "A production SaaS platform with third-party integrations.",
    tags: ["SaaS", "Integrations"],
  },
  {
    name: "Saferide.com.au",
    blurb:
      "SaaS infrastructure and APIs for vehicle tracking, including device provisioning.",
    tags: ["SaaS", "APIs", "Tracking", "IoT"],
  },
];

export const certifications = [
  {
    name: "Responsive Web Design",
    issuer: "freeCodeCamp",
    issued: "November 2026",
    url: "https://www.freecodecamp.org/certification/usmanhafeez147/responsive-web-design-v9",
  },
  {
    name: "Back End Development and APIs",
    issuer: "freeCodeCamp",
    issued: "November 2026",
    url: "https://www.freecodecamp.org/certification/usmanhafeez147/back-end-development-and-apis-v9",
  },
  {
    name: "JavaScript",
    issuer: "freeCodeCamp",
    issued: "November 2026",
    url: "https://www.freecodecamp.org/certification/usmanhafeez147/javascript-v9",
  },
];

export const publications = [
  {
    title:
      "The Revolution in AI: Reasoning, Retrieval and Agents as the Three Shifts Behind a New Generation of Systems",
    venue: "Zenodo preprint",
    date: "17 November 2026",
    doi: "10.5281/zenodo.24298711",
    url: "https://doi.org/10.5281/zenodo.24298711",
    summary:
      "An article on how reasoning models, retrieval augmented generation and agents combine in modern AI systems, with design guidance for engineers.",
  },
];

export const education = {
  school: "Government College University, Faisalabad",
  degree: "Bachelor of Science in Information Technology",
  period: "2013 to 2017",
};
