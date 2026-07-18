/* ============================================================
   contact.js — Form validation + Web3Forms submit
   - Form posts to https://api.web3forms.com/submit
   - Replace YOUR_ACCESS_KEY below with the access key from web3forms.com
   - Free tier: unlimited submissions, no signup needed for the
     receiving side — just paste your access key.
   - Client-side validation (required, email, phone)
   - Honeypot anti-spam field (Web3Forms' built-in botcheck)
   - Loading state, success / error feedback
   ============================================================ */

(function () {
  "use strict";

  const form    = document.getElementById("contactForm");
  if (!form) return;

  // ============================================================
  // ACCESS KEY — replace YOUR_ACCESS_KEY with the key you get from
  // https://web3forms.com (free, no signup required for the
  // receiving inbox). Until then the form is in "demo mode" and
  // shows a success message locally without sending email.
  // ============================================================
  const WEB3FORMS_ACCESS_KEY = "6ab51614-4cff-4573-8d97-d0b0209f8a45";
  const WEB3FORMS_ENDPOINT  = "https://api.web3forms.com/submit";

  const successEl = document.getElementById("formSuccess");
  const errorEl   = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");

  // Email format (RFC-lite, good enough for client-side)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone: digits, spaces, +, -, parens, 7-20 chars
  const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

  function setFieldError(name, msg) {
    const field = form.querySelector(`[data-field="${name}"]`);
    if (!field) return;
    field.classList.toggle("has-error", Boolean(msg));
    const err = field.querySelector(".field-error");
    if (err) err.textContent = msg || "";
  }
  function clearErrors() {
    form.querySelectorAll(".has-error").forEach((f) => f.classList.remove("has-error"));
    form.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
  }
  function showAlert(el, msg) {
    el.textContent = msg;
    el.classList.add("is-visible");
  }
  function hideAlerts() {
    successEl.classList.remove("is-visible");
    errorEl.classList.remove("is-visible");
  }

  function validate(data) {
    let ok = true;
    if (!data.name || data.name.trim().length < 2) {
      setFieldError("name", "Please enter your full name."); ok = false;
    }
    if (!data.email || !EMAIL_RE.test(data.email.trim())) {
      setFieldError("email", "Please enter a valid email address."); ok = false;
    }
    if (data.phone && !PHONE_RE.test(data.phone.trim())) {
      setFieldError("phone", "Please enter a valid phone number."); ok = false;
    }
    if (!data.subject || data.subject.trim().length < 2) {
      setFieldError("subject", "Please add a subject."); ok = false;
    }
    if (!data.message || data.message.trim().length < 10) {
      setFieldError("message", "Message should be at least 10 characters."); ok = false;
    }
    // Honeypot (Web3Forms' "botcheck" — silently "succeed" if filled)
    if (data.botcheck) {
      return { ok: false, silent: true };
    }
    return { ok };
  }

  function readForm() {
    const fd = new FormData(form);
    return {
      name:     fd.get("name")     || "",
      email:    fd.get("email")    || "",
      phone:    fd.get("phone")    || "",
      subject:  fd.get("subject")  || "",
      message:  fd.get("message")  || "",
      botcheck: fd.get("botcheck") || ""  // honeypot
    };
  }

  function setLoading(loading) {
    submitBtn.classList.toggle("is-loading", loading);
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", String(loading));
  }

  async function submit(data) {
    // Web3Forms expects JSON with access_key as the first field
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject:    `Website contact: ${data.subject}`,
      from_name:  data.name,
      name:       data.name,
      email:      data.email,
      phone:      data.phone,
      message:    data.message,
      // Optional: route the notification to a specific inbox
      // (you can also configure this in the Web3Forms dashboard)
      // to: "info@excellencebiomed.com"
    };

    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok && body.success === true, body };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlerts();
    clearErrors();
    const data = readForm();
    const v = validate(data);
    if (v.silent) {
      // Bot — pretend it worked
      showAlert(successEl, "Thanks! Your message has been sent.");
      form.reset();
      return;
    }
    if (!v.ok) {
      showAlert(errorEl, "Please fix the highlighted fields and try again.");
      return;
    }
    setLoading(true);
    try {
      // If access key still placeholder, short-circuit to local demo
      if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY") {
        await new Promise((r) => setTimeout(r, 600));
        showAlert(successEl,
          "Form is in demo mode. Replace YOUR_ACCESS_KEY in js/contact.js to send real emails.");
        form.reset();
      } else {
        const result = await submit(data);
        if (result.ok) {
          showAlert(successEl, "Thanks! Your message has been sent — we'll be in touch shortly.");
          form.reset();
        } else {
          const msg = (result.body && result.body.message)
            ? `Sorry, we couldn't send your message: ${result.body.message}. Please email us directly.`
            : "Sorry, something went wrong sending your message. Please email us directly.";
          showAlert(errorEl, msg);
        }
      }
    } catch (err) {
      console.error(err);
      showAlert(errorEl,
        "Network error. Please check your connection or email us directly.");
    } finally {
      setLoading(false);
    }
  });

  // Clear an individual field's error as the user fixes it
  form.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("input", () => {
      const field = el.closest("[data-field]");
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
        const err = field.querySelector(".field-error");
        if (err) err.textContent = "";
      }
    });
  });
})();
