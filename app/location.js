import { yercaudSpots } from "./locationData.js";

const dom = {
  select: document.getElementById("locationSelect"),
  viewGuideBtn: document.getElementById("viewGuideBtn"),
  status: document.getElementById("locationStatus")
};

function setStatus(message) {
  dom.status.textContent = message;
}

function ensureLoggedIn() {
  const userRaw = sessionStorage.getItem("tourist_user");
  if (!userRaw) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function populateLocations() {
  dom.select.innerHTML = '<option value="">-- Select a Location --</option>';
  yercaudSpots.forEach((spot) => {
    const option = document.createElement("option");
    option.value = spot.id;
    option.textContent = `${spot.name} - ${spot.note}`;
    dom.select.appendChild(option);
  });
}

function continueToGuide() {
  const spotId = dom.select.value;
  const selected = yercaudSpots.find((s) => s.id === spotId);

  if (!selected) {
    setStatus("Please select a location.");
    return;
  }

  sessionStorage.setItem("tourist_selected_spot", JSON.stringify(selected));
  sessionStorage.setItem("tourist_selected_district", "Yercaud");
  window.location.href = "guide.html";
}

if (ensureLoggedIn()) {
  populateLocations();
  dom.viewGuideBtn.addEventListener("click", continueToGuide);
}
