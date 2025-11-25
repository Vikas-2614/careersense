// CareerSense – AI Career & Resume Analyzer (advanced)
// Frontend-only, rule-based AI (no backend).

// ---- Role knowledge base ----
const ROLES = [
  {
    id: "frontend",
    title: "Front-End Developer",
    description:
      "Builds interactive user interfaces for websites and web apps using HTML, CSS, JavaScript and frameworks.",
    minCGPA: 6.0,
    coreSkills: ["HTML", "CSS", "JavaScript"],
    niceSkills: ["React", "Git", "UI/UX Design", "Figma"],
    tags: ["web", "ui", "javascript", "frontend"],
  },
  {
    id: "backend",
    title: "Back-End Developer",
    description:
      "Focuses on server-side logic, databases, and APIs that power applications.",
    minCGPA: 6.0,
    coreSkills: ["Python", "Java", "Node.js", "SQL"],
    niceSkills: ["Django", "MongoDB", "Git", "DevOps"],
    tags: ["server", "api", "database"],
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    description:
      "Works on both front-end and back-end, handling complete web application flow.",
    minCGPA: 7.0,
    coreSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL"],
    niceSkills: ["MongoDB", "Git", "DevOps"],
    tags: ["web", "fullstack"],
  },
  {
    id: "datasci",
    title: "Data Scientist",
    description:
      "Analyzes data to derive insights using statistics, machine learning and visualization.",
    minCGPA: 7.0,
    coreSkills: ["Python", "Data Analysis", "Machine Learning", "SQL"],
    niceSkills: ["Deep Learning", "Power BI", "Statistics"],
    tags: ["data", "ml", "ai"],
  },
  {
    id: "mleng",
    title: "ML Engineer",
    description:
      "Builds and deploys machine learning models into production systems.",
    minCGPA: 7.0,
    coreSkills: ["Python", "Machine Learning", "Deep Learning"],
    niceSkills: ["Data Analysis", "DevOps", "Cloud"],
    tags: ["ml", "ai", "engineering"],
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    description:
      "Designs user interfaces and experiences focusing on usability and aesthetics.",
    minCGPA: 0,
    coreSkills: ["UI/UX Design", "Figma"],
    niceSkills: ["HTML", "CSS", "User Research"],
    tags: ["design", "ui", "ux"],
  },
  {
    id: "mobile",
    title: "Mobile App Developer",
    description:
      "Develops Android/iOS or cross-platform mobile applications.",
    minCGPA: 6.0,
    coreSkills: ["Flutter", "Java", "Kotlin"],
    niceSkills: ["Firebase", "Git"],
    tags: ["mobile", "apps"],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description:
      "Automates and manages deployment, CI/CD pipelines and infrastructure.",
    minCGPA: 7.0,
    coreSkills: ["DevOps", "Git"],
    niceSkills: ["Docker", "Cloud", "Linux", "Python"],
    tags: ["infrastructure", "automation"],
  },
  {
    id: "cyber",
    title: "Cybersecurity Analyst",
    description:
      "Protects systems and networks from security threats and vulnerabilities.",
    minCGPA: 6.5,
    coreSkills: ["Cybersecurity", "Linux"],
    niceSkills: ["Python", "Networking"],
    tags: ["security", "network"],
  },
];

// ---- DOM elements ----
const sidebarDateEl = document.getElementById("sidebarDate");
const themeToggleBtn = document.getElementById("themeToggle");
const welcomeTitleEl = document.getElementById("welcomeTitle");

// Nav
const navDashboard = document.getElementById("navDashboard");
const navRoles = document.getElementById("navRoles");
const navResume = document.getElementById("navResume");
const navSettings = document.getElementById("navSettings");
const navItems = document.querySelectorAll(".nav-item");

const dashboardSection = document.getElementById("dashboardSection");
const rolesSection = document.getElementById("rolesSection");
const resumeSection = document.getElementById("resumeSection");
const settingsSection = document.getElementById("settingsSection");

// Profile
const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("nameInput");
const yearSelect = document.getElementById("yearSelect");
const cgpaInput = document.getElementById("cgpaInput");
const interestsInput = document.getElementById("interestsInput");
const customSkillsInput = document.getElementById("customSkillsInput");
const analyzeBtn = document.getElementById("analyzeBtn");

// Stats
const statCGPAEl = document.getElementById("statCGPA");
const statSkillsEl = document.getElementById("statSkills");
const statProfileStrengthEl = document.getElementById("statProfileStrength");
const statResumeScoreEl = document.getElementById("statResumeScore");
const statBarCGPAEl = document.getElementById("statBarCGPA");
const statBarSkillsEl = document.getElementById("statBarSkills");
const statBarProfileEl = document.getElementById("statBarProfile");
const statBarResumeEl = document.getElementById("statBarResume");

// Role & gap outputs
const roleResultsEl = document.getElementById("roleResults");
const gapResultsEl = document.getElementById("gapResults");

// Resume
const resumeFileEl = document.getElementById("resumeFile");
const resumeTextEl = document.getElementById("resumeText");
const resumeScoreValueEl = document.getElementById("resumeScoreValue");
const resumeScoreBarEl = document.getElementById("resumeScoreBar");
const resumeSuggestionsEl = document.getElementById("resumeSuggestions");

// Settings
const clearDataBtn = document.getElementById("clearDataBtn");
const downloadReportBtn = document.getElementById("downloadReportBtn");

// Chart
const roleChartCanvas = document.getElementById("roleChart");
let roleChart = null;

// State to build report
let lastProfile = null;
let lastRoleMatches = [];
let lastResumeResult = null;

// Store last uploaded resume text
let uploadedResumeText = "";

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  updateDate();
  initTheme();
  initNav();
});

// Date
function updateDate() {
  const now = new Date();
  sidebarDateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Theme
function initTheme() {
  const stored = localStorage.getItem("careersense_theme");
  if (stored === "light") document.body.classList.add("light");
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "careersense_theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

// Nav
function setActiveNav(btn) {
  navItems.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}
function scrollToSection(section) {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}
function initNav() {
  navDashboard.addEventListener("click", () => {
    setActiveNav(navDashboard);
    scrollToSection(dashboardSection);
  });
  navRoles.addEventListener("click", () => {
    setActiveNav(navRoles);
    scrollToSection(rolesSection);
  });
  navResume.addEventListener("click", () => {
    setActiveNav(navResume);
    scrollToSection(resumeSection);
  });
  navSettings.addEventListener("click", () => {
    setActiveNav(navSettings);
    scrollToSection(settingsSection);
  });
}

// ---- Profile collection ----
function collectProfile() {
  const name = nameInput.value.trim();
  const year = yearSelect.value;
  const cgpa = parseFloat(cgpaInput.value);
  const interestsRaw = interestsInput.value.toLowerCase();
  const interests = interestsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const selectedSkills = [];
  document.querySelectorAll(".skill-checkbox").forEach((cb) => {
    if (cb.checked) selectedSkills.push(cb.value);
  });

  const customSkillsRaw = customSkillsInput.value;
  if (customSkillsRaw) {
    customSkillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => selectedSkills.push(s));
  }

  return {
    name,
    year,
    cgpa: Number.isNaN(cgpa) ? null : cgpa,
    interests,
    skills: selectedSkills,
  };
}

function updateWelcome(profile) {
  welcomeTitleEl.textContent = profile.name
    ? `Welcome, ${profile.name} 👋`
    : "Welcome 👋";
}

// Profile stats
function updateProfileStats(profile) {
  if (profile.cgpa != null) {
    statCGPAEl.textContent = profile.cgpa.toFixed(1);
    statBarCGPAEl.style.width = Math.min(100, (profile.cgpa / 10) * 100) + "%";
  } else {
    statCGPAEl.textContent = "-";
    statBarCGPAEl.style.width = "0%";
  }

  const skillCount = profile.skills.length;
  statSkillsEl.textContent = skillCount.toString();
  statBarSkillsEl.style.width = Math.min(100, (skillCount / 15) * 100) + "%";

  let score = 0;
  if (profile.cgpa != null) {
    if (profile.cgpa >= 8) score += 40;
    else if (profile.cgpa >= 7) score += 30;
    else if (profile.cgpa >= 6) score += 20;
    else score += 10;
  }
  score += Math.min(40, skillCount * 3);
  score += Math.min(20, profile.interests.length * 4);
  score = Math.min(100, score);

  let label = "Beginner";
  if (score >= 75) label = "Strong";
  else if (score >= 50) label = "Intermediate";

  statProfileStrengthEl.textContent = `${label} (${score.toFixed(0)}%)`;
  statBarProfileEl.style.width = score + "%";
}

// ---- Role recommendation AI ----
function getRoleRecommendations(profile) {
  const userSkillsLower = profile.skills.map((s) => s.toLowerCase());
  const interestsText = profile.interests.join(" ").toLowerCase();

  const results = [];

  ROLES.forEach((role) => {
    let score = 0;

    const coreMatches = role.coreSkills.filter((sk) =>
      userSkillsLower.includes(sk.toLowerCase())
    );
    const niceMatches = role.niceSkills.filter((sk) =>
      userSkillsLower.includes(sk.toLowerCase())
    );

    const coreRatio =
      role.coreSkills.length > 0
        ? coreMatches.length / role.coreSkills.length
        : 0;

    score += coreRatio * 60;
    score += Math.min(20, niceMatches.length * 5);

    let interestBoost = 0;
    role.tags.forEach((tag) => {
      if (interestsText.includes(tag)) interestBoost += 8;
    });
    if (
      interestsText.includes(role.title.toLowerCase()) ||
      interestsText.includes(role.id)
    ) {
      interestBoost += 10;
    }
    score += interestBoost;

    if (profile.cgpa != null) {
      if (profile.cgpa < role.minCGPA - 1) score -= 10;
      else if (profile.cgpa >= role.minCGPA) score += 5;
    }

    if (profile.year === "1" || profile.year === "2") score += 5;

    score = Math.max(0, Math.min(100, score));

    if (coreMatches.length > 0 || interestBoost >= 10) {
      results.push({ role, score, coreMatches, niceMatches });
    }
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 3);
}

function renderRoleResults(matches) {
  if (!matches.length) {
    roleResultsEl.innerHTML =
      '<p class="small-text muted">No strong role matches yet. Try adding more technical skills or specifying your interests.</p>';
    updateRoleChart([]);
    return;
  }

  roleResultsEl.innerHTML = "";
  matches.forEach((item, idx) => {
    const { role, score, coreMatches, niceMatches } = item;

    const card = document.createElement("div");
    card.className = "role-card";

    const left = document.createElement("div");
    const header = document.createElement("div");
    header.className = "role-header";

    const title = document.createElement("div");
    title.className = "role-title";
    title.textContent = `${idx + 1}. ${role.title}`;

    const scoreChip = document.createElement("div");
    scoreChip.className = "role-score-chip";
    scoreChip.textContent = `Match: ${score.toFixed(0)}%`;

    header.appendChild(title);
    header.appendChild(scoreChip);
    left.appendChild(header);

    const meta = document.createElement("div");
    meta.className = "role-meta";
    meta.textContent = role.description;
    left.appendChild(meta);

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "role-tags";
    role.tags.forEach((t) => {
      const span = document.createElement("span");
      span.className = "tag-pill";
      span.textContent = t;
      tagsDiv.appendChild(span);
    });
    left.appendChild(tagsDiv);

    const right = document.createElement("div");
    right.className = "role-right";

    const coreText = document.createElement("div");
    coreText.textContent = "Core skills: " + role.coreSkills.join(", ");
    right.appendChild(coreText);

    const haveText = document.createElement("div");
    const have = coreMatches.concat(niceMatches);
    haveText.textContent =
      "You already know: " + (have.length ? have.join(", ") : "None yet");
    right.appendChild(haveText);

    const cgText = document.createElement("div");
    cgText.textContent = `Recommended CGPA: ${role.minCGPA || "Any"}+`;
    right.appendChild(cgText);

    card.appendChild(left);
    card.appendChild(right);
    roleResultsEl.appendChild(card);
  });

  updateRoleChart(matches);
}

// ---- Role match chart (Chart.js) ----
function updateRoleChart(matches) {
  if (!roleChartCanvas) return;

  if (!matches.length) {
    if (roleChart) {
      roleChart.destroy();
      roleChart = null;
    }
    return;
  }

  const labels = matches.map((m) => m.role.title);
  const data = matches.map((m) => Math.round(m.score));

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Match %",
          data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { display: true },
          grid: { display: false },
        },
        y: {
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Match: ${ctx.parsed.x}%`,
          },
        },
      },
    },
  };

  if (roleChart) {
    roleChart.data.labels = labels;
    roleChart.data.datasets[0].data = data;
    roleChart.update();
  } else {
    roleChart = new Chart(roleChartCanvas.getContext("2d"), config);
  }
}

// Skill gap + roadmap
function renderSkillGap(profile, role) {
  const userSkillsLower = profile.skills.map((s) => s.toLowerCase());

  const missingCore = role.coreSkills.filter(
    (sk) => !userSkillsLower.includes(sk.toLowerCase())
  );
  const missingNice = role.niceSkills.filter(
    (sk) => !userSkillsLower.includes(sk.toLowerCase())
  );

  const parts = [];
  parts.push(
    `<p class="small-text">Target role: <strong>${role.title}</strong></p>`
  );

  if (!missingCore.length && !missingNice.length) {
    parts.push(
      '<p class="small-text muted">You already cover most key skills. Focus on building 2–3 strong projects and internships related to this role.</p>'
    );
  } else {
    if (missingCore.length) {
      parts.push('<p class="gap-section-title">Core skills to learn:</p>');
      parts.push(
        `<ul class="gap-list"><li>${missingCore.join("</li><li>")}</li></ul>`
      );
    }
    if (missingNice.length) {
      parts.push('<p class="gap-section-title">Good-to-have skills:</p>');
      parts.push(
        `<ul class="gap-list"><li>${missingNice.join("</li><li>")}</li></ul>`
      );
    }

    const roadmap = [];
    if (missingCore.length) {
      roadmap.push(
        `1. First cover the foundation: ${missingCore
          .slice(0, 3)
          .join(", ")}. Spend 2–3 weeks learning basics and solving small problems.`
      );
    } else {
      roadmap.push(
        "1. Revise fundamentals of the core skills you already know and solve interview-style questions."
      );
    }

    if (missingNice.length) {
      roadmap.push(
        `2. Pick ${missingNice[0]} (and one more) as differentiators to stand out in this role.`
      );
    } else {
      roadmap.push(
        "2. Deepen your level by doing advanced projects or contributing to open-source."
      );
    }

    roadmap.push(
      "3. Build 2–3 solid projects related to this role and highlight them on your resume, LinkedIn and GitHub."
    );

    parts.push('<p class="gap-section-title">3-step roadmap:</p>');
    parts.push(`<ul class="gap-list"><li>${roadmap.join("</li><li>")}</li></ul>`);
  }

  gapResultsEl.innerHTML = parts.join("");
}

// ---- Resume upload ----
resumeFileEl.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".txt")) {
    alert("Please upload a .txt file (export your resume as plain text).");
    resumeFileEl.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedResumeText = ev.target.result || "";
    resumeTextEl.value = uploadedResumeText;
  };
  reader.readAsText(file);
});

// ---- Resume analysis ----
function analyzeResume(text, userSkills) {
  const clean = text.trim();
  if (!clean) {
    return {
      score: null,
      suggestions: ["Upload or paste your resume text to get AI feedback."],
    };
  }

  const lower = clean.toLowerCase();
  const words = clean.split(/\s+/);
  const wordCount = words.length;

  const actionVerbs = [
    "developed",
    "built",
    "designed",
    "created",
    "implemented",
    "led",
    "optimized",
    "analyzed",
    "configured",
    "deployed",
    "managed",
  ];
  let actionCount = 0;
  actionVerbs.forEach((v) => {
    if (lower.includes(v)) actionCount++;
  });

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(clean);

  const allSkillKeywords = Array.from(
    new Set(userSkills.concat(ROLES.flatMap((r) => r.coreSkills.concat(r.niceSkills))))
  );
  let techCount = 0;
  allSkillKeywords.forEach((sk) => {
    if (lower.includes(sk.toLowerCase())) techCount++;
  });

  let score = 40;

  if (wordCount < 80) score -= 10;
  else if (wordCount > 500) score -= 5;
  else score += 10;

  score += Math.min(20, actionCount * 4);
  score += Math.min(25, techCount * 2);

  if (hasEmail) score += 5;
  else score -= 5;

  score = Math.max(0, Math.min(100, score));

  const suggestions = [];

  if (wordCount < 120) {
    suggestions.push(
      "Your resume seems short. Add more details about projects, responsibilities, and achievements."
    );
  } else if (wordCount > 400) {
    suggestions.push(
      "Your resume is quite long. For students, try to keep it around one page."
    );
  }

  if (actionCount < 3) {
    suggestions.push(
      "Use more action verbs like 'developed', 'implemented', 'designed', 'built' to describe your work."
    );
  }

  if (techCount < 5) {
    suggestions.push(
      "Mention more specific technologies and tools (e.g. Python, React, SQL) clearly in your skills or projects."
    );
  }

  if (!hasEmail) {
    suggestions.push("Add a professional email address in your contact details.");
  }

  if (!lower.includes("project")) {
    suggestions.push(
      "Include a 'Projects' section with at least 2–3 academic or personal projects."
    );
  }

  if (!lower.includes("intern")) {
    suggestions.push(
      "If you have internships, highlight them. If not, mention relevant coursework or mini-projects."
    );
  }

  if (!suggestions.length) {
    suggestions.push(
      "Your resume looks structured. You can further improve it by tailoring keywords for each job role."
    );
  }

  return { score, suggestions };
}

function renderResumeResult(result) {
  if (result.score == null) {
    resumeScoreValueEl.textContent = "- / 100";
    resumeScoreBarEl.style.width = "0%";
    statResumeScoreEl.textContent = "-";
    statBarResumeEl.style.width = "0%";
  } else {
    resumeScoreValueEl.textContent = `${result.score.toFixed(0)} / 100`;
    resumeScoreBarEl.style.width = result.score + "%";
    statResumeScoreEl.textContent = result.score.toFixed(0);
    statBarResumeEl.style.width = result.score + "%";
  }

  resumeSuggestionsEl.innerHTML = "";
  result.suggestions.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    resumeSuggestionsEl.appendChild(li);
  });
}

// ---- Analyze button ----
analyzeBtn.addEventListener("click", () => {
  const profile = collectProfile();
  lastProfile = profile;

  updateWelcome(profile);
  updateProfileStats(profile);

  const matches = getRoleRecommendations(profile);
  lastRoleMatches = matches;
  renderRoleResults(matches);

  if (matches.length) {
    renderSkillGap(profile, matches[0].role);
  } else {
    gapResultsEl.innerHTML =
      '<p class="small-text muted">AI could not strongly match any role yet. Try adding more skills or clearer interests.</p>';
  }

  const resumeSource = (uploadedResumeText || resumeTextEl.value || "").trim();
  const resumeResult = analyzeResume(resumeSource, profile.skills);
  lastResumeResult = resumeResult;
  renderResumeResult(resumeResult);
});

// ---- Clear data ----
clearDataBtn.addEventListener("click", () => {
  if (!confirm("Clear profile, skills and resume text from this browser?")) return;

  profileForm.reset();
  document.querySelectorAll(".skill-checkbox").forEach((cb) => (cb.checked = false));
  uploadedResumeText = "";
  resumeTextEl.value = "";
  resumeFileEl.value = "";

  statCGPAEl.textContent = "-";
  statSkillsEl.textContent = "0";
  statProfileStrengthEl.textContent = "-";
  statResumeScoreEl.textContent = "-";
  statBarCGPAEl.style.width = "0%";
  statBarSkillsEl.style.width = "0%";
  statBarProfileEl.style.width = "0%";
  statBarResumeEl.style.width = "0%";
  resumeScoreValueEl.textContent = "- / 100";
  resumeScoreBarEl.style.width = "0%";
  resumeSuggestionsEl.innerHTML = "";
  roleResultsEl.innerHTML =
    '<p class="small-text muted">Fill your profile and click “Analyze with AI” to see suggested roles.</p>';
  gapResultsEl.innerHTML =
    '<p class="small-text muted">After roles are suggested, AI will show which skills you are missing and a simple 3-step roadmap.</p>';

  if (roleChart) {
    roleChart.destroy();
    roleChart = null;
  }

  lastProfile = null;
  lastRoleMatches = [];
  lastResumeResult = null;
});

// ---- Report generation & download ----
downloadReportBtn.addEventListener("click", () => {
  if (!lastProfile || !lastRoleMatches.length) {
    alert("Run “Analyze with AI” first so I can generate a report.");
    return;
  }
  const text = generateReportText(lastProfile, lastRoleMatches, lastResumeResult);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = lastProfile.name || "student";
  a.href = url;
  a.download = `CareerSense_AI_Report_${safeName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

function generateReportText(profile, matches, resumeResult) {
  const lines = [];
  lines.push("CareerSense – AI Career & Resume Analyzer");
  lines.push("========================================");
  lines.push("");
  lines.push(`Generated on: ${new Date().toLocaleString()}`);
  lines.push("");

  lines.push("Student Profile");
  lines.push("---------------");
  lines.push(`Name  : ${profile.name || "(not provided)"}`);
  lines.push(
    `Year  : ${
      profile.year === "1"
        ? "1st Year"
        : profile.year === "2"
        ? "2nd Year"
        : profile.year === "3"
        ? "3rd Year"
        : profile.year === "4"
        ? "4th Year"
        : profile.year === "grad"
        ? "Graduate"
        : "(not selected)"
    }`
  );
  lines.push(`CGPA  : ${profile.cgpa != null ? profile.cgpa.toFixed(2) : "(not set)"}`);
  lines.push(
    `Interests: ${profile.interests.length ? profile.interests.join(", ") : "(none)"}`
  );
  lines.push(
    `Skills   : ${profile.skills.length ? profile.skills.join(", ") : "(no skills selected)"}`
  );
  lines.push("");

  lines.push("Top AI-Recommended Roles");
  lines.push("------------------------");
  if (!matches.length) {
    lines.push("No strong matches. Try adding more skills or interests.");
  } else {
    matches.forEach((m, idx) => {
      lines.push(
        `${idx + 1}. ${m.role.title} – Match ${m.score.toFixed(0)}% | Recommended CGPA ${
          m.role.minCGPA || "Any"
        }+`
      );
      lines.push(`   Description : ${m.role.description}`);
      lines.push(`   Core skills : ${m.role.coreSkills.join(", ")}`);
      const have = m.coreMatches.concat(m.niceMatches);
      lines.push(
        `   You already have: ${have.length ? have.join(", ") : "none from the core/nice list"}`
      );
      lines.push("");
    });
  }

  if (matches.length) {
    const target = matches[0].role;
    const userSkillsLower = profile.skills.map((s) => s.toLowerCase());
    const missingCore = target.coreSkills.filter(
      (sk) => !userSkillsLower.includes(sk.toLowerCase())
    );
    const missingNice = target.niceSkills.filter(
      (sk) => !userSkillsLower.includes(sk.toLowerCase())
    );

    lines.push("Skill Gap for Top Role");
    lines.push("----------------------");
    lines.push(`Target role: ${target.title}`);
    lines.push("");
    lines.push(
      `Missing core skills    : ${
        missingCore.length ? missingCore.join(", ") : "None – you cover all listed core skills."
      }`
    );
    lines.push(
      `Missing good-to-have    : ${
        missingNice.length ? missingNice.join(", ") : "None – you already have most nice-to-have skills."
      }`
    );
    lines.push("");
    lines.push("Suggested 3-step roadmap:");
    if (missingCore.length) {
      lines.push(
        `1) Learn fundamentals of: ${missingCore
          .slice(0, 3)
          .join(", ")} (2–3 weeks with practice + small projects).`
      );
    } else {
      lines.push("1) Revise fundamentals of your existing core skills and practice DSA + projects.");
    }
    if (missingNice.length) {
      lines.push(
        `2) Add differentiation by learning ${missingNice[0]} (and one more) with 1–2 mini projects.`
      );
    } else {
      lines.push("2) Deepen expertise with advanced projects or open-source contributions.");
    }
    lines.push(
      "3) Build 2–3 strong portfolio projects aligned with this role and highlight them on your resume, LinkedIn and GitHub."
    );
    lines.push("");
  }

  lines.push("AI Resume Analysis");
  lines.push("------------------");
  if (!resumeResult || resumeResult.score == null) {
    lines.push("No resume text was analyzed in this session.");
  } else {
    lines.push(`Overall resume score: ${resumeResult.score.toFixed(0)} / 100`);
    lines.push("");
    lines.push("Suggestions:");
    resumeResult.suggestions.forEach((s, i) => {
      lines.push(`${i + 1}) ${s}`);
    });
  }

  lines.push("");
  lines.push("Note: This report is generated by a rule-based AI demo.");
  lines.push("It is not an official recruitment tool, but a learning aid for students.");

  return lines.join("\n");
}
