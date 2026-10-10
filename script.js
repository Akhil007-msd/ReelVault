
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("videoUrl");
  const checkBtn = document.getElementById("checkBtn");
  const pasteBtn = document.getElementById("pasteBtn");
  const clearBtn = document.getElementById("clearBtn");
  const openBtn = document.getElementById("openBtn");
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  const resultIcon = document.getElementById("resultIcon");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");

  if (
    !input || !checkBtn || !pasteBtn || !clearBtn ||
    !openBtn || !status || !result
  ) {
    console.error("ReelVault: One or more required HTML elements are missing.");
    return;
  }

  let checkedUrl = "";

  function showStatus(message, type = "") {
    status.textContent = message;
    status.className = "status";
    if (type) status.classList.add(type);
  }

  function hideResult() {
    result.classList.add("hidden");
    checkedUrl = "";
  }

  function identifyVideoUrl(value) {
    let url;

    try {
      url = new URL(value);
    } catch {
      return {
        ok: false,
        message: "Please enter a complete, valid video URL."
      };
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return {
        ok: false,
        message: "Please use an HTTP or HTTPS link."
      };
    }

    const host = url.hostname.toLowerCase();
    const isYouTube =
      host === "youtube.com" ||
      host.endsWith(".youtube.com") ||
      host === "youtu.be" ||
      host === "youtube-nocookie.com" ||
      host.endsWith(".youtube-nocookie.com");

    const isInstagram =
      host === "instagram.com" ||
      host.endsWith(".instagram.com");

    if (isYouTube) {
      const validYouTubePath =
        host === "youtu.be"
          ? url.pathname.length > 1
          : url.pathname.startsWith("/watch") ||
            url.pathname.startsWith("/shorts/") ||
            url.pathname.startsWith("/embed/") ||
            url.pathname.startsWith("/live/");

      if (!validYouTubePath) {
        return {
          ok: false,
          message: "This doesn't look like a standard YouTube video link."
        };
      }

      return {
        ok: true,
        platform: "YouTube",
        message: "YouTube link format recognized."
      };
    }

    if (isInstagram) {
      const validInstagramPath =
        /^\/(reel|reels|p|tv)\/[^/]+/i.test(url.pathname);

      if (!validInstagramPath) {
        return {
          ok: false,
          message: "Use an Instagram Reel or supported post URL."
        };
      }

      return {
        ok: true,
        platform: "Instagram",
        message: "Instagram link format recognized."
      };
    }

    return {
      ok: false,
      message: "Please enter an Instagram or YouTube URL."
    };
  }

  function checkLink() {
    const value = input.value.trim();
    hideResult();

    if (!value) {
      showStatus("Paste a video link first.", "error");
      input.focus();
      return;
    }

    const validation = identifyVideoUrl(value);

    if (!validation.ok) {
      showStatus(validation.message, "error");
      return;
    }

    checkedUrl = value;
    resultIcon.textContent = "✓";
    resultTitle.textContent = validation.platform + " link recognized";
    resultText.textContent =
      validation.message +
      " This check doesn't confirm that the video is public or downloadable.";
    result.classList.remove("hidden");
    showStatus("Link format checked successfully.", "success");
  }

  checkBtn.addEventListener("click", checkLink);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkLink();
    }
  });

  input.addEventListener("input", () => {
    hideResult();
    showStatus("Ready to check your link.");
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    hideResult();
    showStatus("Link cleared.");
    input.focus();
  });

  pasteBtn.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error("Clipboard access is unavailable.");
      }

      const text = await navigator.clipboard.readText();
      input.value = text.trim();
      input.focus();
      hideResult();
      showStatus(
        text.trim()
          ? "Link pasted. Click Check link."
          : "Your clipboard is empty."
      );
    } catch {
      showStatus(
        "Clipboard access was blocked. Copy your link and paste it into the field.",
        "error"
      );
      input.focus();
    }
  });

  openBtn.addEventListener("click", () => {
    if (!checkedUrl) {
      showStatus("Check a valid link first.", "error");
      return;
    }

    window.open(checkedUrl, "_blank", "noopener,noreferrer");
  });

  showStatus("Paste a link above to get started.");
});
