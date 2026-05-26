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
