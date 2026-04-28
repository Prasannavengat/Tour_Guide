const dom = {
  phone: document.getElementById("touristPhone"),
  otp: document.getElementById("touristOtp"),
  name: document.getElementById("touristName"),
  sendOtpBtn: document.getElementById("sendOtpBtn"),
  verifyOtpBtn: document.getElementById("verifyOtpBtn"),
  loginBtn: document.getElementById("loginBtn"),
  status: document.getElementById("loginStatus"),
  otpSection: document.getElementById("otpSection"),
  nameSection: document.getElementById("nameSection")
};

const state = {
  apiBaseUrl: window.location.origin,
  verifiedPhone: "",
  otpVerified: false
};

function setStatus(message) {
  dom.status.textContent = message;
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";

  if (raw.startsWith("+")) {
    const digits = raw.replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  }

  return raw.replace(/\D/g, "");
}

function getApiUrl(path) {
  const base = state.apiBaseUrl.replace(/\/$/, "");
  return `${base}${path}`;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function requestOtp() {
  try {
    const phone = normalizePhone(dom.phone.value);
    const digitCount = phone.replace(/\D/g, "").length;

    if (digitCount < 10 || digitCount > 15) {
      setStatus("Enter a valid mobile number.");
      return;
    }

    setStatus("Requesting OTP...");
    const data = await postJson(getApiUrl("/api/auth/request-otp"), { phone });
    state.verifiedPhone = data.phone;
    
    // Show OTP section after successful OTP generation
    dom.otpSection.style.display = "block";
    dom.otp.focus();
    
    setStatus(
      data.devOtp
        ? `OTP sent. Dev OTP: ${data.devOtp}`
        : "OTP sent to your phone. Please verify."
    );
  } catch (error) {
    setStatus(`OTP request failed: ${error.message}`);
  }
}

async function verifyOtp() {
  try {
    const phone = normalizePhone(dom.phone.value);
    const otp = String(dom.otp.value || "").trim();

    if (!otp || otp.length !== 6) {
      setStatus("Enter the 6-digit OTP.");
      return;
    }

    setStatus("Verifying OTP...");
    await postJson(getApiUrl("/api/auth/verify-otp"), { phone, otp });

    state.otpVerified = true;
    state.verifiedPhone = phone;
    
    // Show name section after successful OTP verification
    dom.nameSection.style.display = "block";
    dom.name.focus();
    
    setStatus("Phone verified. Enter your name to continue.");
  } catch (error) {
    setStatus(`OTP verification failed: ${error.message}`);
  }
}

function loginTourist() {
  const name = dom.name.value.trim();

  if (!state.otpVerified) {
    setStatus("Please verify your phone number first.");
    return;
  }

  if (!name) {
    setStatus("Please enter your name.");
    return;
  }

  sessionStorage.setItem(
    "tourist_user",
    JSON.stringify({
      name,
      phone: state.verifiedPhone,
      verified: true,
      loggedInAt: new Date().toISOString()
    })
  );

  window.location.href = "location.html";
}

dom.sendOtpBtn.addEventListener("click", requestOtp);
dom.verifyOtpBtn.addEventListener("click", verifyOtp);
dom.loginBtn.addEventListener("click", loginTourist);
