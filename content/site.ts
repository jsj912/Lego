// Single source of truth for every fact on the site.
// Edit this file (and only this file) to update content.
import type {
  Award,
  Build,
  Education,
  Experience,
  Leadership,
  Person,
  Publication,
  Skills,
  TimelineEntry,
} from "./types";

export const person: Person = {
  name: "Joan Sara Joe",
  roles: ["Machine Learning Engineer"],
  tagline: "Building intelligent systems, one brick at a time.",
  location: "Bengaluru, India",
  email: "joansara123@gmail.com",
  linkedin: "https://www.linkedin.com/in/joan-sara-joe-95611528b/",
  github: "https://github.com/jsj912",
  resumePath: "/resume.pdf", // I will add public/resume.pdf myself. If missing at build time, hide the button.
  phone: null,               // intentionally not published
};

// Proof line under the hero tagline.
export const highlights: string[] = [
  "Samsung R&D Institute (PRISM)",
  "Fidelity Investments",
  "#1 of 350+ · CySeck CTF 2026",
];

// "Where I've built" strip under the hero, in this order. `logo` is the file name
// (without extension) looked up in /public/logos/; if it's missing, the name is shown.
// Role and dates come from `experience` (by id) or `education` (by index).
export const builtAt: { name: string; logo: string; experience?: string; education?: number }[] = [
  { name: "Samsung R&D Institute (PRISM)", logo: "samsung", experience: "samsung" },
  { name: "Fidelity Investments", logo: "fidelity", experience: "fidelity" },
  { name: "B.M.S. College of Engineering", logo: "bmsce", education: 0 },
  { name: "IIT Madras", logo: "iitm", education: 1 },
];

// Projects shown as large cards, in this order. The other builds follow as compact
// "more sets" in array order (set numbers follow display order).
export const featuredBuilds: string[] = ["moe-appliance-detection", "amsdds", "ringshield"];

export const education: Education[] = [
  {
    school: "B.M.S. College of Engineering",
    degree: "B.E., Computer Science & Engineering (IoT, Cybersecurity & Blockchain)",
    detail: "CGPA: 9.28",
    when: "Expected June 2027",
    where: "Bengaluru, India",
  },
  {
    school: "Indian Institute of Technology, Madras",
    degree: "B.S. in Data Science & Applications (part-time, self-paced, concurrent with B.E.)",
    detail: null,
    when: "In progress",
    where: null,
  },
];

export const focusAreas: string[] = [ // used in Workshop + Innovation Lab "research threads"
  "Computer vision & on-device detection",
  "Temporal graph learning for fraud-ring detection",
  "Explainability, calibration & reliability of AI systems",
  "Backend & serverless systems",
];

export const experience: Experience[] = [
  {
    id: "fidelity",
    org: "Fidelity Investments",
    role: "Software Engineering Intern",
    start: "June 2026", end: "August 2026",
    where: "Bengaluru, India",
    bullets: [], // intentionally no detail about the internship work
  },
  {
    id: "samsung",
    deepDive: "moe-appliance-detection",
    org: "Samsung R&D Institute (PRISM)",
    role: "Research Intern",
    start: "Jan 2026", end: "June 2026",
    where: "Bengaluru, India",
    bullets: [
      "Built a three-layer Mixture-of-Experts vision pipeline for appliance detection in the SmartThings ecosystem: a ResNet-18 (Places365) scene router dispatches frames to RF-DETR Nano specialist detectors.",
      "An SSD-MobileNet baseline reached 0.140 mAP and missed small objects entirely; the scene-conditioned RF-DETR Nano experts reached 0.932 mAP.",
      "Shipped a CPU-only demo via OpenCV, plus a feedback layer that persists analyst corrections for retraining.",
      "First-authoring an IEEE-format paper on the architecture (in preparation).",
    ],
  },
];

// kind: "internship" | "flagship" | "hackathon" | "project"
// manual pages render ONLY from fields that are non-null / non-empty.
export const builds: Build[] = [
  {
    set: "001", slug: "moe-appliance-detection", kind: "internship",
    title: "Mixture-of-Experts Appliance Detection",
    context: "Samsung R&D Institute (PRISM) · SmartThings ecosystem",
    when: "Jan 2026 – June 2026",
    outcome: "Three-layer appliance detection: SSD-MobileNet baseline 0.140 mAP → RF-DETR Nano experts 0.932 mAP.",
    pieces: ["ResNet-18 (Places365)", "RF-DETR Nano", "Mixture-of-Experts", "OpenCV", "CPU-only deployment"],
    challenge: "A single general detector (SSD-MobileNet baseline) reached only 0.140 mAP and missed small objects entirely.",
    steps: [
      { title: "Scene router", body: "A ResNet-18 (Places365) scene router dispatches frames to the right specialist." },
      { title: "Specialist detectors", body: "RF-DETR Nano specialist detectors, one per scene, replace the single general detector." },
      { title: "Feedback layer", body: "A feedback layer persists analyst corrections for retraining." },
      { title: "CPU-only demo", body: "Shipped a CPU-only demo via OpenCV." },
    ],
    finalModel: "The SSD-MobileNet baseline reached 0.140 mAP; the scene-conditioned RF-DETR Nano experts reached 0.932 mAP.",
    lessons: [],
    note: "First-authoring an IEEE-format paper on the architecture (in preparation).",
    links: { github: null, report: null, demo: null },
  },
  {
    set: "002", slug: "amsdds", kind: "hackathon",
    title: "Adaptive Multi-Layer Skin Disease Detection (AMSDDS)",
    context: "Smart Horizon 2026",
    when: "2026",
    outcome: "Two-stage uncertainty-routed cascade: 86.9% accuracy at ~30% of the transformer's compute.",
    pieces: ["PyTorch", "timm", "Flask", "Docker", "MobileNetV3", "PanDerm ViT-B/16", "HAM10000", "PAD-UFES-20"],
    challenge: "7-class dermatology triage on HAM10000 + PAD-UFES-20 (12k images, 54:1 class imbalance).",
    steps: [
      { title: "Uncertainty-routed cascade", body: "Two-stage cascade (multimodal MobileNetV3 → ViT escalation model): 86.9% accuracy vs 86.4% for running the transformer on every image, at ~30% of its compute." },
      { title: "Calibrated gate", body: "A calibrated confidence + entropy gate (110-point sweep, temperature scaling, ECE 0.025) caught 54 of 75 malignant lesions the fast path called benign." },
      { title: "Escalation model rebuild", body: "Replaced the escalation backbone with a fine-tuned PanDerm ViT-B/16 (layer-wise LR decay, mixup/cutmix, class-balanced sampler on a single T4), lifting macro F1 0.736 → 0.788, with the rare classes at 89 training images each reaching 0.842 and 0.927 F1." },
      { title: "Domain adaptation", body: "Domain-adapted across dermoscopy and smartphone imaging with an explicit 6→7 class mapping and patient-level splits to prevent leakage, raising cross-domain macro F1 0.550 → 0.704." },
      { title: "Serving stack", body: "Dockerised Flask API, config-driven thresholds, one-line backbone rollback, selectable heads, and a parity test verifying served predictions reproduce notebook results. Cached frozen features cut experiment turnaround from ~50 min to seconds, enabling a 24-config sweep selected on validation with test reported once." },
    ],
    finalModel: "86.9% accuracy vs 86.4% for running the transformer on every image, at ~30% of its compute; ECE 0.025.",
    lessons: [
      "The first escalation model beat the fast path by only 1.2 points because a COCO-pretrained detection backbone learns object-vs-background separation rather than fine-grained texture.",
      "Dermoscopy fine-tuning improved clinical-photo transfer, motivating a shared-backbone / per-domain-head design.",
    ],
    note: null,
    ownership: "5-person team · I owned the data pipeline, Flask decision engine, OOD gate and Layer 2.",
    links: { github: null, report: null, demo: null },
  },
  {
    set: "003", slug: "ringshield", kind: "flagship",
    title: "RingShield",
    context: "Fraud-Ring Detection with Temporal Graph Neural Networks",
    when: "2025 – Present",
    outcome: "Phase 1 complete: systematic review, gap taxonomy, system architecture and evaluation protocol. Implementation in progress.",
    pieces: ["Temporal Graph Neural Networks", "Dynamic time-stamped graphs", "Explainability", "Drift monitoring", "AMLworld", "Elliptic", "IEEE-CIS", "PaySim"],
    challenge: "Coordinated fraud rings that node-level and rule-based models miss.",
    steps: [
      { title: "Graph modelling", body: "Models financial transactions as a dynamic, time-stamped graph of users, devices, cards and merchants." },
      { title: "Temporal GNNs", body: "Uses temporal GNNs to surface coordinated fraud rings." },
      { title: "Explainability", body: "Adds analyst-actionable explainability, surfacing the suspicious transaction paths behind each decision." },
      { title: "Drift monitoring", body: "Drift monitoring to adapt as fraud patterns shift." },
    ],
    finalModel: "Phase 1 complete: systematic review of ~50 papers with a nine-category gap taxonomy, system architecture, and evaluation protocol across AMLworld, Elliptic, IEEE-CIS and PaySim. Implementation in progress.",
    lessons: [],
    note: "Led the systematic review workflow, developed a PRISMA-based 9-category gap taxonomy, and authored the initial manuscript draft.",
    ownership: "Led the systematic review workflow, developed a PRISMA-based 9-category gap taxonomy, and authored the initial manuscript draft.",
    links: { github: null, report: null, demo: null },
  },
  {
    set: "004", slug: "network-anomaly-detection", kind: "project",
    title: "ML-Based Network Traffic & Malware Anomaly Detection",
    context: null,
    when: "Sept 2025 – Dec 2025",
    outcome: "96% true-positive rate at <5% FPR across threat classes.",
    pieces: ["Isolation Forest", "TreeSHAP", "PCAP", "Feature engineering"],
    challenge: null,
    steps: [
      { title: "Feature engineering", body: "Engineered ~20 per-flow behavioral features from raw PCAP data (byte/packet counts, inter-arrival timing, port entropy, directional ratios, unique-destination counts)." },
      { title: "Anomaly model", body: "Trained an Isolation Forest (100–200 trees) on benign-only traffic to model normal behavior." },
      { title: "Rerank + explain", body: "A two-stage reranking pass cuts false positives; TreeSHAP attribution explains anomaly scores per feature." },
    ],
    finalModel: "96% true-positive rate at <5% FPR across threat classes; ~100% on RAT traffic and 94% on DNS tunneling, against 98.1% for the published KRTunnel benchmark.",
    lessons: [],
    note: null,
    links: { github: null, report: "https://drive.google.com/file/d/1RHb_D2x1-Yb0OIWUVPx_TvzyGQ9h3Pd3/view?usp=drive_link", demo: null },
  },
  {
    set: "005", slug: "smart-glasses", kind: "project",
    title: "Vision-Based Assistive Smart Glasses",
    context: null,
    when: "2025",
    outcome: ">98% word-level OCR accuracy on clean printed text; live spoken context for visually impaired users.",
    pieces: ["Haar Cascade", "LBPH", "OCR", "Adaptive thresholding"],
    challenge: null,
    steps: [
      { title: "Face pipeline", body: "Two-stage facial recognition pipeline: Haar Cascade detection, LBPH recognition against an enrolled-user database." },
      { title: "OCR pipeline", body: "OCR pipeline with adaptive thresholding and noise filtering, reaching >98% word-level accuracy on clean printed text." },
    ],
    finalModel: "Delivered live spoken context to visually impaired users.",
    lessons: [],
    note: null,
    links: { github: "https://github.com/jsj912/Smart-Glasses", report: "https://drive.google.com/file/d/10pxIxtpENJj9zUxnAg3Ka71C-AQFfdB6/view?usp=drive_link", demo: null },
  },
  {
    set: "006", slug: "homomorphic-iot", kind: "project",
    title: "Homomorphic Encryption for IoT Sensor Analytics",
    context: null,
    when: null,
    outcome: "Analytics over encrypted IoT sensor data without decryption.",
    pieces: ["Homomorphic encryption", "Flask", "IoT sensor data"],
    challenge: null,
    steps: [],
    finalModel: "Built a secure analytics pipeline over homomorphically encrypted IoT sensor data with a Flask backend, enabling computation and visualization without decryption.",
    lessons: [],
    note: null,
    links: { github: null, report: null, demo: null },
  },
];

export const publications: Publication[] = [
  {
    authorship: "First author",
    title: "An Extensible Mixture-of-Experts Architecture for On-Device Appliance Detection in Smart Home Ecosystems",
    venue: null, status: "In preparation", detail: null,
    relatedBuild: "moe-appliance-detection",
  },
  {
    authorship: "Co-author (3rd)",
    title: "From Transaction-Level Detection to Fraud-Ring Intelligence: A Systematic Survey of Temporal, Explainable and Drift-Aware Graph Learning",
    venue: "IEEE Access", status: "In preparation", detail: "PRISMA-based screening of 49 papers.",
    relatedBuild: "ringshield",
  },
  {
    authorship: "Co-author (3rd)",
    title: "Hallucinations, Adversarial Vulnerabilities, and Mitigation Architectures in Large Language Models and LLM-Enabled High-Stakes Systems",
    venue: null, status: "In preparation", detail: "Survey of failure modes and reliability in large multimodal models.",
    relatedBuild: null,
  },
];
// When venue is set AND status is "In preparation", render as "Target venue: IEEE Access". Never as "Published in".

export const awards: Award[] = [
  {
    title: "1st Place (Solo) — CySeck Grand CTF Challenge 2026",
    detail: "Ranked #1 out of 350+ participants in a national capture-the-flag competition; ₹50,000 prize.",
  },
  {
    title: "Finalist — Smart Horizon International Hackathon 2026",
    detail: null,
    relatedBuild: "amsdds",
  },
];

export const leadership: Leadership[] = [
  { org: "Sensored (BMSCE)", role: "Junior Core → Vice President", when: "Nov 2024 – Present",
    detail: "Vice President since Sep 2025: led strategy and execution for technical initiatives and national-level events." },
  { org: "BMSCE Phase Shift", role: "Department Coordinator (CSE ICB)", when: "Aug 2025 – Oct 2025",
    detail: "Led a 13-member cross-functional team for a national technical event; managed budgets and sponsorships, securing ~20% higher funding." },
  { org: "RaSoR — Ramanujan Society of Research", role: "Core Member (R&D Wing)", when: "Aug 2025 – Present", detail: null },
];

export const skills: Skills = {
  "Machine Learning / AI": ["PyTorch", "timm", "Object Detection", "OpenCV", "Graph Neural Networks", "Mixture-of-Experts", "SHAP", "Model training & evaluation"],
  "Languages": ["Python", "Java", "C/C++", "SQL", "JavaScript"],
  "Backend & Cloud": ["AWS (Lambda, API Gateway, EKS, Step Functions)", "Spring Batch", "Maven", "Flask", "Docker", "Git/GitHub"],
  "Data": ["Pandas", "MySQL", "MongoDB", "PCAP / network telemetry"],
};

// Brick Stats: studs = number of sets whose tags (`pieces`) include the skill, + 1.
// A tag counts for a skill if it matches the skill's name exactly, or through this
// alias map (tag → skill). Aliases only cover tags that exist in the set data.
export const skillAliases: Record<string, string[]> = {
  PyTorch: ["Python"],
  timm: ["Python"],
  OpenCV: ["Python"],
  Flask: ["Python"],
  Pandas: ["Python"],
  "Spring Batch": ["Java"],
  Maven: ["Java"],
  TreeSHAP: ["SHAP"],
  "Temporal Graph Neural Networks": ["Graph Neural Networks"],
  PCAP: ["PCAP / network telemetry"],
};

// Conveyor timeline, labels shown exactly as written. Each entry rides one belt (lane);
// within a belt, entries keep this order.
export const timeline: TimelineEntry[] = [
  { label: "Sensored (BMSCE) — Junior Core", when: "Nov 2024", lane: "campus" },
  { label: "Phase Shift — Department Coordinator (CSE ICB)", when: "Aug 2025 – Oct 2025", lane: "campus" },
  { label: "Sensored (BMSCE) — Vice President", when: "Sep 2025 – Present", lane: "campus" },
  { label: "Network Traffic & Malware Anomaly Detection", when: "Sept 2025 – Dec 2025", build: "network-anomaly-detection", lane: "builds" },
  { label: "Samsung R&D Institute (PRISM) — Research Intern", when: "Jan 2026 – June 2026", experience: "samsung", lane: "work" },
  { label: "1st Place (Solo) — CySeck Grand CTF Challenge", when: "2026", lane: "builds" },
  { label: "Fidelity Investments — Software Engineering Intern", when: "June 2026 – August 2026", experience: "fidelity", lane: "work" },
  { label: "Finalist — Smart Horizon International Hackathon", when: "2026", build: "amsdds", lane: "builds" },
  { label: "B.E., B.M.S. College of Engineering", when: "Expected June 2027", upcoming: true, lane: "campus" },
];
