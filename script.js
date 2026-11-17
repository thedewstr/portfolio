const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => siteNav.classList.remove("open"));
  });
}

const terminalToggle = document.querySelector("#terminalToggle");
const terminalPanel = document.querySelector("#terminalPanel");
const terminalClose = document.querySelector("#terminalClose");
const terminalOutput = document.querySelector("#terminalOutput");
const terminalOptions = document.querySelector("#terminalOptions");
const terminalForm = document.querySelector("#terminalForm");
const terminalInput = document.querySelector("#terminalInput");
const radApiBaseUrl = String(window.RAD_API_BASE_URL || "").replace(/\/$/, "");
const radChatEndpoint = `${radApiBaseUrl}/api/chat`;

const bootLines = [
  "RAD PORTFOLIO TERMINAL v0.1",
  "PUBLIC DATA MODE: ENABLED",
  "PRIVATE SYSTEM ACCESS: DISABLED",
  "Ask about Ryan's projects, skills, automation work, education, or contact options."
];

const quickCommands = [
  "Give me a quick overview of Ryan's portfolio.",
  "What projects best show Ryan's automation experience?",
  "Summarize Ryan's PowerShell and Python work.",
  "What roles would Ryan be a fit for?"
];

let terminalReady = false;
let terminalBusy = false;

function appendTerminalLine(text, type = "system") {
  if (!terminalOutput) {
    return;
  }

  const line = document.createElement("p");
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function setTerminalBusy(isBusy) {
  terminalBusy = isBusy;

  if (terminalInput) {
    terminalInput.disabled = isBusy;
  }
}

function renderQuickCommands() {
  if (!terminalOptions) {
    return;
  }

  terminalOptions.textContent = "";

  quickCommands.forEach((command) => {
    const button = document.createElement("button");
    button.className = "terminal-option";
    button.type = "button";
    button.textContent = command;

    button.addEventListener("click", () => {
      submitTerminalMessage(command);
    });

    terminalOptions.appendChild(button);
  });
}

function bootTerminal() {
  if (terminalReady || !terminalOutput) {
    return;
  }

  terminalOutput.textContent = "";
  bootLines.forEach((line) => appendTerminalLine(`> ${line}`, "system"));
  renderQuickCommands();
  terminalReady = true;
}

async function submitTerminalMessage(message) {
  const cleanMessage = String(message || "").trim();

  if (!cleanMessage || terminalBusy) {
    return;
  }

  appendTerminalLine(`USER> ${cleanMessage}`, "user");
  setTerminalBusy(true);
  appendTerminalLine("RAD> Processing portfolio data...", "system");

  try {
    const response = await fetch(radChatEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: cleanMessage })
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Terminal request failed.");
    }

    appendTerminalLine(`RAD> ${payload.answer}`, "assistant");
  } catch (error) {
    appendTerminalLine(
      `RAD> Local assistant unavailable. ${error.message}`,
      "error"
    );
  } finally {
    setTerminalBusy(false);

    if (terminalInput) {
      terminalInput.value = "";
      terminalInput.focus();
    }
  }
}

if (terminalToggle && terminalPanel) {
  terminalToggle.addEventListener("click", () => {
    terminalPanel.classList.toggle("open");
    terminalPanel.setAttribute(
      "aria-hidden",
      terminalPanel.classList.contains("open") ? "false" : "true"
    );

    if (terminalPanel.classList.contains("open")) {
      bootTerminal();
      terminalToggle.textContent = "RAD Terminal Online";

      if (terminalInput) {
        terminalInput.focus();
      }
    } else {
      terminalToggle.textContent = "Access RAD Terminal";
    }
  });
}

if (terminalClose && terminalPanel && terminalToggle) {
  terminalClose.addEventListener("click", () => {
    terminalPanel.classList.remove("open");
    terminalPanel.setAttribute("aria-hidden", "true");
    terminalToggle.textContent = "Access RAD Terminal";
  });
}

if (terminalForm && terminalInput) {
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitTerminalMessage(terminalInput.value);
  });
}

// Skill tree interactions
const skillCanvas = document.querySelector("#skilltreeCanvas");

if (skillCanvas) {
  const skillNodes = Array.from(skillCanvas.querySelectorAll(".skill-node"));
  const skillLinks = document.querySelector("#skilltreeLinks");
  const skillDetail = document.querySelector("#skillDetail");
  const skillUnlocked = document.querySelector("#skillUnlocked");
  const skillTotal = document.querySelector("#skillTotal");

  const skillInfo = {
    aplus: {
      glyph: "🖥️",
      kicker: "Certification · Unlocked",
      title: "CompTIA A+",
      body: "IT support fundamentals, hardware, software, troubleshooting, operating systems, and best practices for end-user support.",
      href: "https://cp.certmetrics.com/CompTIA/en/public/verify/credential/XVTLGYQFLGB158Q9",
      linkLabel: "Verify credential..."
    },
    netplus: {
      glyph: "🌐",
      kicker: "Certification · Unlocked",
      title: "CompTIA Network+",
      body: "Networking concepts, infrastructure, operations, basic network security, and troubleshooting for IT professionals.",
      href: "https://cp.certmetrics.com/CompTIA/en/public/verify/credential/Q499DG7SW1141FV2",
      linkLabel: "Verify credential..."
    },
    secplus: {
      glyph: "🛡️",
      kicker: "Certification · Unlocked",
      title: "CompTIA Security+",
      body: "Cybersecurity fundamentals, risk management, threat analysis, and best practices for securing IT environments.",
      href: "https://cp.certmetrics.com/CompTIA/en/public/verify/credential/HS4V9SFS01V1S4R2",
      linkLabel: "Verify credential..."
    },
    cloudplus: {
      glyph: "☁️",
      kicker: "Certification · Newly unlocked",
      title: "CompTIA Cloud+",
      body: "Cloud architecture, deployment, operations, security, and troubleshooting across hybrid and multi-cloud environments.",
      href: "https://www.linkedin.com/in/radewey/details/certifications/",
      linkLabel: "View on LinkedIn..."
    },
    azure: {
      glyph: "🔷",
      kicker: "Certification · Unlocked",
      title: "Microsoft Certified: Azure Administrator Associate",
      body: "Azure administration across identity, governance, storage, compute, and virtual networking, including monitoring, backup, and access management (AZ-104).",
      href: "https://www.linkedin.com/in/radewey/details/certifications/",
      linkLabel: "View on LinkedIn..."
    },
    bs: {
      glyph: "🎓",
      kicker: "Degree · Unlocked",
      title: "Bachelor of Science in Computer Science",
      body: "University of The People. Undergraduate focus on programming, data structures, computer architecture, and software development principles.",
      href: "https://www.linkedin.com/in/radewey/",
      linkLabel: "View on LinkedIn..."
    },
    mba: {
      glyph: "🎓",
      kicker: "Degree · Unlocked",
      title: "MBA in Information Technology Management",
      body: "Western Governors University. Graduate-level focus on aligning technology, business operations, leadership, and process improvement.",
      href: "https://www.wgu.edu/alumni/commencement/e-diploma-verification/validate.html",
      linkLabel: "Verify credential... (CeDiD: 26E0-0UFV-RBYD)"
    },
    itil: {
      glyph: "📘",
      kicker: "Certification · In progress",
      title: "ITIL 4 Foundation",
      body: "Currently exploring IT service management fundamentals, including incident management, change enablement, service value systems, and continual improvement.",
      href: "",
      linkLabel: ""
    },
    ai: {
      glyph: "🤖",
      kicker: "Learning quest · In progress",
      title: "AI Engineering & Workflow Automation",
      body: "Exploring practical AI engineering concepts, including prompt design, API-assisted workflows, automation planning, documentation generation, troubleshooting support, and AI-enhanced internal tooling.",
      href: "",
      linkLabel: ""
    },
    jncia: {
      glyph: "📡",
      kicker: "Previous credential · Retired",
      title: "Juniper JNCIA-Junos",
      body: "Expired certification reflecting prior networking study, routing/switching fundamentals, and Juniper platform exposure.",
      href: "https://cp.certmetrics.com/juniper/en/public/verify/credential/3EWJN4NQ7N4QQZSR",
      linkLabel: "Verify credential..."
    }
  };

  const skillConnections = [
    ["aplus", "netplus", "unlocked"],
    ["aplus", "secplus", "unlocked"],
    ["aplus", "bs", "degree"],
    ["netplus", "cloudplus", "unlocked"],
    ["secplus", "azure", "unlocked"],
    ["bs", "mba", "degree"],
    ["netplus", "jncia", "retired"],
    ["mba", "itil", "progress"],
    ["azure", "ai", "progress"]
  ];

  const renderSkillDetail = (key) => {
    const info = skillInfo[key];
    if (!info || !skillDetail) {
      return;
    }

    const node = skillNodes.find((item) => item.dataset.skill === key);
    const state = node && node.classList.contains("is-progress")
      ? "progress"
      : node && node.classList.contains("is-retired")
        ? "retired"
        : "unlocked";

    skillDetail.className = "skill-detail is-" + state;

    const glyph = document.createElement("span");
    glyph.className = "detail-glyph";
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = info.glyph;

    const copy = document.createElement("div");
    copy.className = "detail-copy";

    const kicker = document.createElement("p");
    kicker.className = "detail-kicker";
    kicker.textContent = info.kicker;

    const title = document.createElement("h3");
    title.textContent = info.title;

    const body = document.createElement("p");
    body.textContent = info.body;

    copy.append(kicker, title, body);

    if (info.href) {
      const link = document.createElement("a");
      link.href = info.href;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = info.linkLabel;
      copy.append(link);
    }

    skillDetail.replaceChildren(glyph, copy);
  };

  const selectSkillNode = (node) => {
    skillNodes.forEach((item) => item.setAttribute("aria-pressed", String(item === node)));
    renderSkillDetail(node.dataset.skill);
  };

  skillNodes.forEach((node) => {
    node.addEventListener("click", () => selectSkillNode(node));
    node.addEventListener("focus", () => selectSkillNode(node));
  });

  const firstSelected = skillNodes.find((node) => node.getAttribute("aria-pressed") === "true") || skillNodes[0];
  if (firstSelected) {
    selectSkillNode(firstSelected);
  }

  if (skillUnlocked && skillTotal) {
    skillUnlocked.textContent = String(skillNodes.filter((node) => node.classList.contains("is-unlocked")).length);
    skillTotal.textContent = String(skillNodes.length);
  }

  const orbCenter = (node) => {
    const canvasRect = skillCanvas.getBoundingClientRect();
    const orbRect = node.querySelector(".node-orb").getBoundingClientRect();

    return {
      x: orbRect.left - canvasRect.left + orbRect.width / 2,
      y: orbRect.top - canvasRect.top + orbRect.height / 2
    };
  };

  const drawSkillLinks = () => {
    if (!skillLinks) {
      return;
    }

    const canvasRect = skillCanvas.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) {
      return;
    }

    skillLinks.setAttribute("viewBox", "0 0 " + canvasRect.width + " " + canvasRect.height);

    const centers = {};
    skillNodes.forEach((node) => {
      centers[node.dataset.skill] = orbCenter(node);
    });

    const lines = skillConnections.map(([from, to, kind]) => {
      const start = centers[from];
      const end = centers[to];
      if (!start || !end) {
        return null;
      }

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", start.x.toFixed(1));
      line.setAttribute("y1", start.y.toFixed(1));
      line.setAttribute("x2", end.x.toFixed(1));
      line.setAttribute("y2", end.y.toFixed(1));
      if (kind && kind !== "unlocked") {
        line.setAttribute("class", "line-" + kind);
      }

      return line;
    }).filter(Boolean);

    skillLinks.replaceChildren(...lines);
  };

  drawSkillLinks();
  window.addEventListener("resize", drawSkillLinks);

  if ("ResizeObserver" in window) {
    new ResizeObserver(drawSkillLinks).observe(skillCanvas);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(drawSkillLinks);
  }
}
