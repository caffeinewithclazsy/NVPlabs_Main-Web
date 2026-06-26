export const SERVICES = [
  { title: "Website Development", desc: "Lightning-fast, SEO-friendly marketing sites and complex web platforms.", icon: "globe" },
  { title: "Mobile App Development", desc: "iOS, Android, and cross-platform apps with native-quality experiences.", icon: "smartphone" },
  { title: "UI/UX Design", desc: "Premium design systems and interfaces inspired by the world's best.", icon: "palette" },
  { title: "AI Solutions", desc: "LLM integrations, agents, and ML pipelines that ship to production.", icon: "sparkles" },
  { title: "SaaS Development", desc: "Multi-tenant SaaS platforms with billing, auth, and analytics built-in.", icon: "layers" },
  { title: "Admin Dashboards", desc: "Powerful dashboards with real-time analytics and role-based access.", icon: "layoutDashboard" },
  { title: "CRM Systems", desc: "Custom CRMs that match your sales process, not the other way around.", icon: "users" },
  { title: "ERP Systems", desc: "Enterprise resource planning tailored to your operations.", icon: "boxes" },
  { title: "Custom Software", desc: "Bespoke software solutions for unique business challenges.", icon: "code" },
  { title: "E-Commerce", desc: "High-converting storefronts with seamless checkout and inventory.", icon: "shoppingBag" },
  { title: "Landing Pages", desc: "Conversion-optimized landing pages with sub-second load times.", icon: "rocket" },
  { title: "API Development", desc: "Robust REST and GraphQL APIs with documentation and testing.", icon: "plug" },
  { title: "Cloud Deployment", desc: "AWS, Vercel, and Docker deployments with CI/CD pipelines.", icon: "cloud" },
  { title: "Maintenance & Support", desc: "24/7 monitoring, updates, and lifetime support for peace of mind.", icon: "shieldCheck" },
];

export const WEBSITE_CATEGORIES = [
  "Business", "Corporate", "Portfolio", "Restaurant", "School",
  "Hospital", "Gym", "Salon", "Real Estate", "Hotel",
  "Law Firm", "Construction", "NGO", "Medical", "Educational Platforms"
];

export const ECOMMERCE_NICHES = [
  "Fashion Store", "Electronics", "Furniture", "Jewelry", "Books",
  "Cosmetics", "Sports", "Automobile", "Food Delivery", "Multi-Vendor Marketplace",
  "Wholesale", "Dropshipping", "Subscription Store"
];

export const ECOMMERCE_FEATURES = [
  "Inventory", "Coupons", "Payments", "Shipping", "Orders", "Analytics", "Customer Dashboard"
];

export const DASHBOARD_FEATURES = [
  "Analytics", "Sales Charts", "User Management", "CRM", "Products", "Orders", "Invoices",
  "Reports", "Employee Management", "Notifications", "Settings", "Role Management",
  "Permissions", "Real-time Analytics"
];

export const TECH_STACK = {
  Frontend: ["React", "Next.js", "Flutter", "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind"],
  Backend: ["Node.js", "Java", "Python", "Express"],
  Database: ["MongoDB", "PostgreSQL", "Supabase", "Firebase"],
  Cloud: ["Vercel", "AWS", "Docker", "GitHub"],
  AI: ["OpenAI", "Gemini", "LangChain"],
};

export const PORTFOLIO = [
  {
    id: 1, title: "Helio Analytics", category: "Dashboards", tech: ["Next.js", "FastAPI", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
    desc: "Real-time analytics dashboard for a SaaS company. 300k+ daily events.",
  },
  {
    id: 2, title: "Coda Commerce", category: "Ecommerce", tech: ["Next.js", "Stripe", "MongoDB"],
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
    desc: "Luxury fashion e-commerce with custom checkout and 0.8s LCP.",
  },
  {
    id: 3, title: "Nova AI Assistant", category: "AI", tech: ["React", "Python", "OpenAI"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    desc: "AI customer support assistant trained on 50k internal docs.",
  },
  {
    id: 4, title: "Lumen Studio", category: "Websites", tech: ["Next.js", "Framer", "Sanity"],
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1200",
    desc: "Award-winning agency portfolio with custom WebGL hero.",
  },
  {
    id: 5, title: "Pulse Health", category: "Apps", tech: ["Flutter", "Firebase", "HealthKit"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200",
    desc: "Cross-platform health tracking app with 200k+ active users.",
  },
  {
    id: 6, title: "Vertex CRM", category: "Dashboards", tech: ["React", "Node.js", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1686061592689-312bbfb5c055?w=1200",
    desc: "Enterprise CRM serving 500+ sales reps across 12 countries.",
  },
  {
    id: 7, title: "Atlas Hotels", category: "Websites", tech: ["Next.js", "Sanity", "Stripe"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    desc: "Boutique hotel chain with integrated booking and CMS.",
  },
  {
    id: 8, title: "Cipher Trade", category: "AI", tech: ["Python", "FastAPI", "Gemini"],
    image: "https://images.pexels.com/photos/5380618/pexels-photo-5380618.jpeg?w=1200",
    desc: "AI-powered trading signals platform with real-time alerts.",
  },
];

export const PROCESS_STEPS = [
  { n: "01", title: "Discovery", desc: "Deep-dive workshops to understand your business, users, and goals." },
  { n: "02", title: "Planning", desc: "Roadmap, architecture, and milestones agreed before any code is written." },
  { n: "03", title: "UI/UX Design", desc: "Design system, wireframes, prototypes, and motion explorations." },
  { n: "04", title: "Development", desc: "Iterative sprints with weekly demos and full transparency." },
  { n: "05", title: "Testing", desc: "Unit, integration, accessibility, and load testing on every release." },
  { n: "06", title: "Deployment", desc: "Zero-downtime deployment to production with monitoring on day one." },
  { n: "07", title: "Support", desc: "Ongoing maintenance, optimizations, and feature additions." },
];

export const WHY_CHOOSE = [
  { title: "Fast Delivery", desc: "Average MVP in 6 weeks without sacrificing quality." },
  { title: "Scalable Code", desc: "Architectures designed for 10x growth from day one." },
  { title: "SEO Optimized", desc: "Sub-second load times and 95+ Lighthouse scores." },
  { title: "Fully Responsive", desc: "Pixel-perfect on every device, from mobile to ultra-wide." },
  { title: "Secure by Default", desc: "Auth, encryption, and OWASP best practices baked in." },
  { title: "Modern UI", desc: "Interfaces inspired by Apple, Linear, and Vercel." },
  { title: "Performance Tuned", desc: "Every byte optimized, every interaction sub-100ms." },
  { title: "Lifetime Support", desc: "We're here long after launch — for the lifetime of your product." },
  { title: "Enterprise Ready", desc: "Compliance, audit logs, SSO — built for serious teams." },
];

export const TESTIMONIALS = [
  {
    name: "Aanya Sharma", role: "CEO, Helio", rating: 5,
    text: "NVP Labs delivered a product that genuinely felt premium from day one. Our trial-to-paid conversion lifted 38%.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    name: "Rohan Mehta", role: "Founder, Coda", rating: 5,
    text: "The attention to detail is unmatched. Every animation, every shadow — it all just feels right.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    name: "Priya Kapoor", role: "Head of Product, Nova", rating: 5,
    text: "We tried three other agencies. NVP Labs was the only team that shipped on time and exceeded the brief.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  },
  {
    name: "Karthik Iyer", role: "CTO, Vertex", rating: 5,
    text: "Their code quality, design taste, and engineering rigor are honestly the best I've seen at any agency.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter", price: "₹49,000", period: "/project", popular: false,
    desc: "Perfect for startups and landing pages.",
    features: ["Up to 5 pages", "Responsive design", "Basic SEO", "Contact form", "1 month support", "Hosting setup"],
    cta: "Start Project",
  },
  {
    name: "Professional", price: "₹1,99,000", period: "/project", popular: true,
    desc: "For growing businesses ready to scale.",
    features: ["Up to 20 pages", "Custom design system", "Advanced SEO + Analytics", "CMS integration", "3 months support", "API integrations", "Performance optimization", "Animations & micro-interactions"],
    cta: "Most Popular",
  },
  {
    name: "Enterprise", price: "Custom", period: "", popular: false,
    desc: "For ambitious products at scale.",
    features: ["Unlimited pages", "Custom architecture", "Dedicated team", "12 months support", "SLA + monitoring", "Multi-region deployment", "Compliance & security audits", "Quarterly product reviews"],
    cta: "Talk to Sales",
  },
];

export const FAQ_ITEMS = [
  { q: "How long does a typical project take?", a: "MVPs ship in 6-8 weeks. Larger platforms run 12-20 weeks. We provide a fixed timeline at the start of every project." },
  { q: "Do you offer ongoing support?", a: "Yes. Every plan includes a support window, and we offer monthly retainers for continuous improvements and feature work." },
  { q: "What's your tech stack?", a: "React/Next.js + FastAPI/Node.js + MongoDB/PostgreSQL, deployed on Vercel/AWS. We pick the right tool for your problem." },
  { q: "Can you work with our existing team?", a: "Absolutely. We integrate seamlessly with in-house engineering, design, and product teams via Slack, Linear, and weekly syncs." },
  { q: "Do you sign NDAs?", a: "Yes — we sign mutual NDAs before any discovery work begins. Your IP is yours, end to end." },
  { q: "What about pricing and payments?", a: "Fixed-price for clearly scoped projects, weekly retainers for ongoing work. Milestone payments via wire or UPI." },
];

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/products", label: "Products" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export const COMPANY = {
  phone: "9016256012",
  whatsapp: "919016256012",
  email: "nvplabs@gmail.com",
  instagram: "https://instagram.com/nvplabs",
  facebook: "#",
  linkedin: "#",
  twitter: "#",
};
