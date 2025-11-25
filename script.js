// CareerSense – AI Career & Resume Analyzer
// Pure frontend: HTML + CSS + JS + rule-based AI

// --- Role Knowledge Base (AI uses this) ---
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

// --- DOM Elements ---
const sidebarDateEl = document.getElementById("sidebarDate");
const themeToggleBtn = document.getElementById("themeToggle");
const welcomeTitleEl = document.getElementById("welcomeTitle");

// Profile form elements
const nameInput = document.getElementById("nameInput");
const yearSelect = document.getElementById("yearSelect");
const cgpaInput = document.getElementById("cgpaInput");
const interestsInput = document.getElementById("interestsInput");
const customSkillsInput = document.getElementById("customSkillsInput");
const analyzeBtn = document.getElementById("analyzeBtn");

// Resume elements
const resumeTextEl = document.getElementById("resumeText");
const resumeScoreValueEl = document.getElementById("resumeScoreValue");
const resumeScoreBarEl = document.getElementById("resumeScoreBar");
const resumeSuggestionsEl = document.getElementById("resumeSuggestions");

// Output containers
const roleResultsEl = document.getElementById("roleResults");
const gapResultsEl = document.getElementById("gapResults");

// Stats
const statCGPAEl = document.getElementById("statCGPA");
const statSkillsEl = document.getElementById("statSkills");
const statProfileStrengthEl = document.getElementById("statProfileStrength");
const statResumeScoreEl = document.getElementById("statResumeScore");
const statBarCGPAEl = document.getElementById("statBarCGPA");
const statBarSkillsEl = document.getElementById("statBarSkills");
const statBarProfileEl = document.getElementById("statBarProfile");
const statBarResumeEl = document.getElementById("statBarResume");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    updateDate();
});

// Date in sidebar
function updateDate() {
    const now = new Date();
    sidebarDateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Theme handling
function loadTheme() {
    const stored = localStorage.getItem("careersense_theme");
    if (stored === "light") {
        document.body.classList.add("light");
    }
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem(
        "careersense_theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );
});

// --- Main analyze button ---
analyzeBtn.addEventListener("click", () => {
    const profile = collectProfile();
    const skills = profile.skills;

    updateWelcome(profile);
    updateProfileStats(profile);

    const roleMatches = getRoleRecommendations(profile);
    renderRoleResults(roleMatches);

    if (roleMatches.length > 0) {
        renderSkillGap(profile, roleMatches[0].role); // focus on top role
    } else {
        gapResultsEl.innerHTML =
            '<p class="small-text muted">AI could not strongly match any role yet. Try adding more skills or interests.</p>';
    }

    const resumeResult = analyzeResume(resumeTextEl.value || "", skills);
    renderResumeResult(resumeResult);
});

// Collect profile from form
function collectProfile() {
    const name = nameInput.value.trim();
    const year = yearSelect.value;
    const cgpa = parseFloat(cgpaInput.value);
    const interestsRaw = interestsInput.value.toLowerCase();
    const interests = interestsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // Selected skills from checkboxes
    const skillCheckboxes = document.querySelectorAll(".skill-checkbox");
    const selectedSkills = [];
    skillCheckboxes.forEach((cb) => {
        if (cb.checked) {
            selectedSkills.push(cb.value);
        }
    });

    // Custom skills from text input
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
        cgpa: isNaN(cgpa) ? null : cgpa,
        interests,
        skills: selectedSkills,
    };
}

// Update welcome title
function updateWelcome(profile) {
    if (profile.name) {
        welcomeTitleEl.textContent = `Welcome, ${profile.name} 👋`;
    } else {
        welcomeTitleEl.textContent = "Welcome 👋";
    }
}

// Update top profile stats
function updateProfileStats(profile) {
    // CGPA stat
    if (profile.cgpa != null) {
        statCGPAEl.textContent = profile.cgpa.toFixed(1);
        const cgpaPercent = Math.min(100, (profile.cgpa / 10) * 100);
        statBarCGPAEl.style.width = cgpaPercent + "%";
    } else {
        statCGPAEl.textContent = "-";
        statBarCGPAEl.style.width = "0%";
    }

    // Skill count
    const skillCount = profile.skills.length;
    statSkillsEl.textContent = skillCount.toString();
    const skillPercent = Math.min(100, (skillCount / 15) * 100);
    statBarSkillsEl.style.width = skillPercent + "%";

    // Profile strength (simple heuristic)
    let strengthScore = 0;
    if (profile.cgpa != null) {
        if (profile.cgpa >= 8) strengthScore += 40;
        else if (profile.cgpa >= 7) strengthScore += 30;
        else if (profile.cgpa >= 6) strengthScore += 20;
        else strengthScore += 10;
    }

    strengthScore += Math.min(40, skillCount * 3);
    strengthScore += Math.min(20, profile.interests.length * 4);
    strengthScore = Math.min(100, strengthScore);

    let label = "Beginner";
    if (strengthScore >= 75) label = "Strong";
    else if (strengthScore >= 50) label = "Intermediate";

    statProfileStrengthEl.textContent = `${label} (${strengthScore.toFixed(0)}%)`;
    statBarProfileEl.style.width = strengthScore + "%";
}

// --- AI role recommendation engine ---
function getRoleRecommendations(profile) {
    const userSkillsLower = profile.skills.map((s) => s.toLowerCase());
    const interestsText = profile.interests.join(" ").toLowerCase();

    const results = [];

    ROLES.forEach((role) => {
        let score = 0;

        // Skill match
        const coreMatches = role.coreSkills.filter((sk) =>
            userSkillsLower.includes(sk.toLowerCase())
        );
        const niceMatches = role.niceSkills.filter((sk) =>
            userSkillsLower.includes(sk.toLowerCase())
        );

        const coreMatchRatio =
            role.coreSkills.length > 0
                ? coreMatches.length / role.coreSkills.length
                : 0;

        score += coreMatchRatio * 60; // core skills are important
        score += Math.min(20, niceMatches.length * 5); // bonus for nice skills

        // Interest match
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

        // CGPA influence
        if (profile.cgpa != null) {
            if (profile.cgpa < role.minCGPA - 1) {
                score -= 10;
            } else if (profile.cgpa >= role.minCGPA) {
                score += 5;
            }
        }

        // Year influence (early years -> more lenient)
        if (profile.year === "1" || profile.year === "2") {
            score += 5;
        }

        score = Math.max(0, Math.min(100, score));

        // Only consider roles that have some core match or strong interest
        if (coreMatches.length > 0 || interestBoost >= 10) {
            results.push({
                role,
                score,
                coreMatches,
                niceMatches,
            });
        }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 3);
}

// Render role cards
function renderRoleResults(matches) {
    if (!matches.length) {
        roleResultsEl.innerHTML =
            '<p class="small-text muted">No strong role matches yet. Try adding more technical skills or specifying your interests.</p>';
        return;
    }

    roleResultsEl.innerHTML = "";

    matches.forEach((item, index) => {
        const { role, score, coreMatches, niceMatches } = item;

        const div = document.createElement("div");
        div.className = "role-card";

        const left = document.createElement("div");
        const header = document.createElement("div");
        header.className = "role-header";

        const title = document.createElement("div");
        title.className = "role-title";
        title.textContent = `${index + 1}. ${role.title}`;

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
            const tagSpan = document.createElement("span");
            tagSpan.className = "tag-pill";
            tagSpan.textContent = t;
            tagsDiv.appendChild(tagSpan);
        });
        left.appendChild(tagsDiv);

        const right = document.createElement("div");
        right.className = "role-right";

        const coreText = document.createElement("div");
        coreText.textContent =
            "Core skills: " + (role.coreSkills.join(", ") || "Not defined");
        right.appendChild(coreText);

        const haveText = document.createElement("div");
        haveText.textContent =
            "You already know: " +
            (coreMatches.concat(niceMatches).join(", ") || "None");
        right.appendChild(haveText);

        const cgText = document.createElement("div");
        cgText.textContent = `Recommended CGPA: ${
            role.minCGPA || "Any"
        }+`;
        right.appendChild(cgText);

        div.appendChild(left);
        div.appendChild(right);

        roleResultsEl.appendChild(div);
    });
}

// --- Skill Gap & Roadmap ---
function renderSkillGap(profile, role) {
    const userSkillsLower = profile.skills.map((s) => s.toLowerCase());

    const missingCore = role.coreSkills.filter(
        (sk) => !userSkillsLower.includes(sk.toLowerCase())
    );
    const missingNice = role.niceSkills.filter(
        (sk) => !userSkillsLower.includes(sk.toLowerCase())
    );

    const lines = [];

    lines.push(
        `<p class="small-text">Target role: <strong>${role.title}</strong></p>`
    );

    if (missingCore.length === 0 && missingNice.length === 0) {
        lines.push(
            `<p class="small-text muted">You already cover most of the important skills for this role. Focus on building strong projects and internships.</p>`
        );
    } else {
        if (missingCore.length) {
            lines.push('<p class="gap-section-title">Core skills to learn:</p>');
            lines.push(
                `<ul class="gap-list"><li>${missingCore.join(
                    "</li><li>"
                )}</li></ul>`
            );
        }

        if (missingNice.length) {
            lines.push(
                '<p class="gap-section-title">Good-to-have skills:</p>'
            );
            lines.push(
                `<ul class="gap-list"><li>${missingNice.join(
                    "</li><li>"
                )}</li></ul>`
            );
        }

        lines.push('<p class="gap-section-title">Suggested 3-step roadmap:</p>');
        const roadmap = [];

        if (missingCore.length) {
            roadmap.push(
                `1. First, cover the core foundation: ${missingCore
                    .slice(0, 3)
                    .join(", ")}. Spend 2–3 weeks building basics and mini projects.`
            );
        } else {
            roadmap.push(
                "1. You already have most core skills. Revise fundamentals and try 1–2 solid projects."
            );
        }

        if (missingNice.length) {
            roadmap.push(
                `2. Next, pick ${missingNice[0]} (and one more) to stand out from other candidates.`
            );
        } else {
            roadmap.push(
                "2. Deepen your knowledge by contributing to open-source or advanced level projects."
            );
        }

        roadmap.push(
            "3. Finally, prepare a strong resume + LinkedIn with 2–3 good projects related to this role, and start applying for internships."
        );

        lines.push(
            `<ul class="gap-list"><li>${roadmap.join("</li><li>")}</li></ul>`
        );
    }

    gapResultsEl.innerHTML = lines.join("");
}

// --- Resume analysis (AI scoring) ---
function analyzeResume(text, userSkills) {
    const clean = text.trim();
    if (!clean) {
        return {
            score: null,
            suggestions: ["Paste your resume text to get AI feedback."],
        };
    }

    const lower = clean.toLowerCase();
    const words = clean.split(/\s+/);
    const wordCount = words.length;

    // Action verbs
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

    // Contact info
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(clean);

    // Tech keyword matches (skills present in resume)
    const allSkillKeywords = Array.from(
        new Set(
            userSkills.concat(
                ROLES.flatMap((r) => r.coreSkills.concat(r.niceSkills))
            )
        )
    );
    let techCount = 0;
    allSkillKeywords.forEach((sk) => {
        if (lower.includes(sk.toLowerCase())) techCount++;
    });

    // Rough scoring
    let score = 40;

    // Word count ideal range 120–400
    if (wordCount < 80) score -= 10;
    else if (wordCount > 500) score -= 5;
    else score += 10;

    // Action verbs
    score += Math.min(20, actionCount * 4);

    // Tech keywords
    score += Math.min(25, techCount * 2);

    // Contact info
    if (hasEmail) score += 5;
    else score -= 5;

    score = Math.max(0, Math.min(100, score));

    // Suggestions
    const suggestions = [];

    if (wordCount < 120) {
        suggestions.push(
            "Your resume seems too short. Add more details about projects, skills, and responsibilities."
        );
    } else if (wordCount > 400) {
        suggestions.push(
            "Your resume is quite long. Try to keep it concise (1 page for students)."
        );
    }

    if (actionCount < 3) {
        suggestions.push(
            "Use more action verbs like 'developed', 'implemented', 'designed', 'built' to describe your work."
        );
    }

    if (techCount < 5) {
        suggestions.push(
            "Mention more specific technologies, tools, and skills (e.g. Python, React, SQL) clearly in your resume."
        );
    }

    if (!hasEmail) {
        suggestions.push(
            "Add a professional email address in your contact details section."
        );
    }

    if (!lower.includes("project")) {
        suggestions.push(
            "Include an 'Projects' section with at least 2–3 academic or personal projects."
        );
    }

    if (!lower.includes("intern")) {
        suggestions.push(
            "If you have done any internships, highlight them. If not, mention relevant coursework or mini-projects."
        );
    }

    if (suggestions.length === 0) {
        suggestions.push(
            "Your resume looks well structured. You can further improve it by tailoring keywords for specific roles."
        );
    }

    return { score, suggestions };
}

// Render resume result
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
