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

let supportXP = 0;
let patience = 10;

const dialogueTree = {
  start: {
    text: `
      <p><span class="terminal-good">Connection established.</span></p>
      <p>Welcome, User. I am the R.A.D Terminal Assistant.</p>
      <p>Select a command:</p>
    `,
    options: [
      { label: "View Ryan's projects", next: "projects" },
      { label: "Inspect skills/loadout", next: "skills" },
      { label: "View current quests", next: "quests" },
      { label: "Run Help Desk Sim Lite", next: "gameIntro" }
    ]
  },

  projects: {
    text: `
      <p><span class="terminal-good">......Project Dex loaded.</span></p>
      <p>Featured work includes API automation, PowerShell/RMM tooling, endpoint deployment automation, Discord bot systems, homelab infrastructure, and mentorship/training tools.</p>
    `,
    options: [
      { label: "Tell me about Webex → SysAid", next: "webexProject" },
      { label: "Tell me about RMM automation", next: "rmmProject" },
      { label: "Back to main terminal", next: "start" }
    ]
  },

  webexProject: {
    text: `
      <p><span class="terminal-good">API Integration Quest:</span> Webex → SysAid</p>
      <p>This project explores converting Webex-based support requests into SysAid tickets using API calls, authentication, category mapping, and ticket field handling.</p>
      <p>Core skills: Python, REST APIs, service desk workflows, troubleshooting authentication, and automation design.</p>
    `,
    options: [
      { label: "Back to projects", next: "projects" },
      { label: "Main terminal", next: "start" }
    ]
  },

  rmmProject: {
    text: `
      <p><span class="terminal-good">Endpoint Automation Loadout:</span> RMM PowerShell Toolkit</p>
      <p>A collection of PowerShell automation work for unattended installs, uninstalls, logging, cleanup, extraction, endpoint maintenance, and deployment troubleshooting.</p>
      <p>Core skills: PowerShell, NinjaRMM, Windows endpoints, deployment sequencing, and support automation.</p>
    `,
    options: [
      { label: "Back to projects", next: "projects" },
      { label: "Main terminal", next: "start" }
    ]
  },

  skills: {
    text: `
      <p><span class="terminal-good">Loadout inspected.</span></p>
      <p>Primary stats:</p>
      <p>Automation: High<br>
      Troubleshooting: Very High<br>
      Documentation: High<br>
      SaaS/Admin Tools: High<br>
      Python/PowerShell: Active Build<br>
      AI-Assisted Engineering: In Progress</p>
    `,
    options: [
      { label: "View current quests", next: "quests" },
      { label: "Main terminal", next: "start" }
    ]
  },

  quests: {
    text: `
      <p><span class="terminal-good">Current quests loaded.</span></p>
      <p>Active quests include progression towards ITIL 4 Foundation certification, AI engineering exploration, internal tooling, service workflow automation, and software development.</p>
      <p>Optional side quest: launch Help Desk Sim Lite.</p>
    `,
    options: [
      { label: "Run Help Desk Sim Lite", next: "gameIntro" },
      { label: "Main terminal", next: "start" }
    ]
  },

  gameIntro: {
    text: `
      <p><span class="terminal-good">Launching Help Desk Sim...</span></p>
      <p>A tiny troubleshooting simulator inspired by real IT support scenarios.</p>
      <p>Current Support XP: <span class="terminal-xp">{{supportXP}}</span><br>
      Patience Meter: <span class="terminal-xp">{{patience}}</span></p>
    `,
    options: [
      { label: "Begin ticket triage", next: "ticketTopaz" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  ticketTopaz: {
    text: `
      <p><span class="terminal-good">A wild ticket appeared!</span></p>
      <p>User reports: “My Topaz signature pad works in Acrobat, but not in the browser.”</p>
      <p>What do you check first?</p>
    `,
    options: [
      { label: "Replace the signature pad immediately", next: "topazWrong", effect: "wrong" },
      { label: "Replace the whole computer immediately", next: "topazWrong", effect: "wrong" },
      { label: "Check SigWeb/browser API configuration", next: "topazCorrect", effect: "correct" },
      { label: "Close the ticket as resolved - after all, sounds like an ID-10-T error to me", next: "ticketReopen", effect: "wrong" }
    ]
  },

  topazCorrect: {
    text: `
      <p><span class="terminal-good">Correct.</span></p>
      <p>If Acrobat or the DemoOCX testing program works but browser signing fails, the SigWeb/API configuration is a strong suspect. Model-specific configuration matters.</p>
      <p><span class="terminal-xp">+10 Support XP</span></p>
    `,
    options: [
      { label: "Next ticket", next: "ticketWebex" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  topazWrong: {
    text: `
      <p><span class="terminal-bad">Not quite.</span></p>
      <p>The hardware may be fine if Acrobat works. Browser/API configuration is the better first investigation path.</p>
      <p><span class="terminal-bad">-2 Patience</span></p>
    `,
    options: [
      { label: "Try again", next: "ticketTopaz" },
      { label: "Next ticket anyway", next: "ticketWebex" }
    ]
  },

  ticketWebex: {
    text: `
      <p><span class="terminal-good">New ticket encountered!</span></p>
      <p>Automation script returns a 401 Unauthorized when calling an API. The token looks present, but requests still fail.</p>
      <p>What is the best first move?</p>
    `,
    options: [
      { label: "Rewrite the entire app immediately", next: "webexWrong", effect: "wrong" },
      { label: "Verify token value, scopes, expiration, and header format", next: "webexCorrect", effect: "correct" },
      { label: "Ignore authentication and test categories", next: "webexWrong", effect: "wrong" },
      { label: "Paste the plaintext token in your favorite AI tool for help", next: "securityBreach", effect: "wrong" }
    ]
  },

  webexCorrect: {
    text: `
      <p><span class="terminal-good">Correct.</span></p>
      <p>For 401s, confirm the exact token being loaded, header format, scopes/permissions, expiration, and whether OAuth is needed.</p>
      <p><span class="terminal-xp">+10 Support XP</span></p>
    `,
    options: [
      { label: "Next ticket", next: "ticketScanner" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  webexWrong: {
    text: `
      <p><span class="terminal-bad">Not the best first move.</span></p>
      <p>Authentication failures should be narrowed down before rewriting working logic.</p>
      <p><span class="terminal-bad">-2 Patience</span></p>
    `,
    options: [
      { label: "Try again", next: "ticketWebex" },
      { label: "Next ticket anyway", next: "ticketScanner" }
    ]
  },

  ticketScanner: {
    text: `
      <p><span class="terminal-good">New ticket encountered!</span></p>
      <p>An RMM deployment script fails because PowerShell says the FilePath argument is null or empty.</p>
      <p>What should you inspect first?</p>
    `,
    options: [
      { label: "Check how the installer path variable is being set", next: "scannerCorrect", effect: "correct" },
      { label: "Assume the scanner is physically broken", next: "scannerWrong", effect: "wrong" },
      { label: "Delete the extraction folder without logging", next: "scannerWrong", effect: "wrong" },
      { label: "Run the installer manually and call it a day", next: "scannerWrong", effect: "wrong" }
    ]
  },

  scannerCorrect: {
    text: `
      <p><span class="terminal-good">Correct.</span></p>
      <p>If FilePath is null, validate the variable assignment, extraction path, file discovery logic, and logging before blaming the installer.</p>
      <p><span class="terminal-xp">+10 Support XP</span></p>
    `,
    options: [
      { label: "Finish run", next: "gameComplete" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  scannerWrong: {
    text: `
      <p><span class="terminal-bad">Not quite.</span></p>
      <p>The error points to script logic or file discovery. Start with the variable and path handling.</p>
      <p><span class="terminal-bad">-2 Patience</span></p>
    `,
    options: [
      { label: "Try again", next: "ticketScanner" },
      { label: "Finish run anyway", next: "gameComplete" }
    ]
  },

  ticketReopen: {
    text: `
      <p><span class="terminal-bad">Oh no! The ticket was reopened and SLA was breached!</span></p>
      <p>Closing unresolved tickets may summon re-opened tickets, follow-up emails, and more headaches than necessary.</p>
      <p><span class="terminal-bad">-5 Patience</span></p>
    `,
    options: [
      { label: "Undo chaos", next: "ticketTopaz" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  securityBreach: {
    text: `
      <p><span class="terminal-bad">Security breach detected.</span></p>
      <p>Never paste tokens into any public or semi-public chats, whether GPT or otherwise. Rotate the token if exposed.</p>
      <p><span class="terminal-bad">-5 Patience</span></p>
    `,
    options: [
      { label: "Try again securely", next: "ticketWebex" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  gameComplete: {
    text: `
      <p><span class="terminal-good">Help Desk Sim complete!</span></p>
      <p>Final Support XP: <span class="terminal-xp">{{supportXP}}</span><br>
      Final Patience Meter: <span class="terminal-xp">{{patience}}</span></p>
      <p>Rank: Practical Problem Unsticker</p>
    `,
    options: [
      { label: "Run again", next: "resetGame" },
      { label: "Return to terminal", next: "start" }
    ]
  },

  resetGame: {
    text: `
      <p><span class="terminal-good">Resetting dungeon state...</span></p>
    `,
    options: [
      { label: "Begin again", next: "ticketTopaz", effect: "reset" },
      { label: "Return to terminal", next: "start" }
    ]
  }
};

function applyEffect(effect) {
  if (effect === "correct") {
    supportXP += 10;
  }

  if (effect === "wrong") {
    patience = Math.max(0, patience - 2);
  }

  if (effect === "reset") {
    supportXP = 0;
    patience = 10;
  }
}

function renderTerminalNode(nodeKey) {
  const node = dialogueTree[nodeKey];

  if (!node || !terminalOutput || !terminalOptions) {
    return;
  }

  terminalOutput.innerHTML = node.text
    .replaceAll("{{supportXP}}", supportXP)
    .replaceAll("{{patience}}", patience);

  terminalOptions.innerHTML = "";

  node.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "terminal-option";
    button.textContent = option.label;

    button.addEventListener("click", () => {
      applyEffect(option.effect);
      renderTerminalNode(option.next);
    });

    terminalOptions.appendChild(button);
  });
}

if (terminalToggle && terminalPanel) {
  terminalToggle.addEventListener("click", () => {
    terminalPanel.classList.toggle("open");
    terminalPanel.setAttribute(
      "aria-hidden",
      terminalPanel.classList.contains("open") ? "false" : "true"
    );

    if (terminalPanel.classList.contains("open")) {
      renderTerminalNode("start");
      terminalToggle.textContent = "💬 Terminal Open";
    } else {
      terminalToggle.textContent = "💬 Open Terminal";
    }
  });
}

if (terminalClose && terminalPanel && terminalToggle) {
  terminalClose.addEventListener("click", () => {
    terminalPanel.classList.remove("open");
    terminalPanel.setAttribute("aria-hidden", "true");
    terminalToggle.textContent = "💬 Open Terminal";
  });
}