"use strict";

(() => {
  const SAMPLE = {
    name: "JSONify",
    version: "1.0.0",
    private: true,
    stats: { stars: 128, forks: 12, ratio: 0.094 },
    tags: ["json", "formatter", "validator"],
    maintainers: [
      { name: "Ada Lovelace", active: true, email: null },
      { name: "Alan Turing", active: false, email: "alan@example.com" }
    ]
  };

  const els = {
    input: document.getElementById("input-json"),
    output: document.getElementById("output-json"),
    inputChars: document.getElementById("input-chars"),
    outputChars: document.getElementById("output-chars"),
    outputLines: document.getElementById("output-lines"),
    status: document.getElementById("status"),
    statusIcon: document.getElementById("status-icon"),
    statusText: document.getElementById("status-text"),
    format: document.getElementById("format-btn"),
    validate: document.getElementById("validate-btn"),
    minify: document.getElementById("minify-btn"),
    sample: document.getElementById("sample-btn"),
    copy: document.getElementById("copy-btn"),
    clear: document.getElementById("clear-btn")
  };

  const STATUS_ICONS = { ready: "●", success: "✓", error: "✕" };

  function setStatus(type, message) {
    els.status.className = `status status--${type}`;
    els.statusIcon.textContent = STATUS_ICONS[type];
    els.statusText.textContent = message;
  }

  function updateStats() {
    const out = els.output.value;
    els.inputChars.textContent = els.input.value.length;
    els.outputChars.textContent = out.length;
    els.outputLines.textContent = out === "" ? 0 : out.split("\n").length;
  }

  // Single source of truth: distinguishes empty, whitespace-only, and invalid input.
  function parseInput() {
    const raw = els.input.value;
    if (raw === "") return { ok: false, message: "Input is empty. Paste some JSON first." };
    if (raw.trim() === "") return { ok: false, message: "Input contains only whitespace. Paste some JSON first." };
    try {
      return { ok: true, value: JSON.parse(raw) };
    } catch (err) {
      return { ok: false, message: `Invalid JSON: ${err.message}` };
    }
  }

  function showResult(text) {
    els.output.value = text;
    updateStats();
  }

  // On failure the input is left untouched and the output is not overwritten.
  function runAction(action) {
    const result = parseInput();
    if (!result.ok) {
      setStatus("error", result.message);
      return;
    }
    action(result.value);
  }

  function handleFormat() {
    runAction((value) => {
      showResult(JSON.stringify(value, null, 2));
      setStatus("success", "Valid JSON. Formatted with 2-space indentation.");
    });
  }

  function handleValidate() {
    runAction(() => setStatus("success", "Valid JSON. No syntax errors found."));
  }

  function handleMinify() {
    runAction((value) => {
      const minified = JSON.stringify(value);
      showResult(minified);
      const saved = els.input.value.length - minified.length;
      setStatus("success", `Valid JSON. Minified to ${minified.length} characters${saved > 0 ? ` (${saved} fewer)` : ""}.`);
    });
  }

  function handleLoadSample() {
    els.input.value = JSON.stringify(SAMPLE);
    updateStats();
    setStatus("ready", "Sample loaded. Click Format to prettify it.");
  }

  function handleClear() {
    els.input.value = "";
    els.output.value = "";
    updateStats();
    setStatus("ready", "Cleared. Ready for new JSON.");
    els.input.focus();
  }

  function fallbackCopy(text) {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (_) {
      copied = false;
    }
    document.body.removeChild(temp);
    return copied;
  }

  async function handleCopy() {
    const text = els.output.value;
    if (text === "") {
      setStatus("error", "Nothing to copy. Format or minify some JSON first.");
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopy(text)) {
        throw new Error("Fallback copy failed");
      }
      setStatus("success", "Output copied to clipboard.");
    } catch (_) {
      if (fallbackCopy(text)) {
        setStatus("success", "Output copied to clipboard.");
      } else {
        setStatus("error", "Copy failed. Clipboard access was denied; select the output and copy it manually.");
      }
    }
  }

  els.format.addEventListener("click", handleFormat);
  els.validate.addEventListener("click", handleValidate);
  els.minify.addEventListener("click", handleMinify);
  els.sample.addEventListener("click", handleLoadSample);
  els.copy.addEventListener("click", handleCopy);
  els.clear.addEventListener("click", handleClear);
  els.input.addEventListener("input", updateStats);

  updateStats();
})();