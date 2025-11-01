function getCardClassName(index) {
  return `card ${index % 2 === 0 ? "card-even" : "card-odd"}`;
}

function createStationTitle(stationNumber) {
  const title = document.createElement("h3");
  title.textContent = `Puesto #${stationNumber || CONFIG.DEFAULT_VALUE}`;
  return title;
}

function createLocationButton(coordinates) {
  const location = document.createElement("span");
  location.className = "location";
  location.innerHTML = `<span class="location-icon">📍</span> Ver ubicación`;

  if (hasValidCoordinates(coordinates)) {
    location.onclick = () => openMapModal(coordinates);
  } else {
    location.style.opacity = "0.5";
    location.style.cursor = "not-allowed";
  }

  return location;
}

function createStationAddress(address, coordinates) {
  const addressElement = document.createElement("p");
  addressElement.className = "address";
  addressElement.innerHTML = `<span>${address || CONFIG.DEFAULT_VALUE}</span>`;

  const locationButton = createLocationButton(coordinates);
  addressElement.appendChild(locationButton);

  return addressElement;
}

function createProgressBar(percentage) {
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progress = document.createElement("div");
  progress.className = "progress";
  progress.style.width = `${percentage}%`;

  progressBar.appendChild(progress);
  return progressBar;
}

function createStationStats(available, total) {
  const stats = document.createElement("div");
  stats.className = "stats";
  stats.innerHTML = `
    <span>Disponibles: ${available}</span>
    <span>Huecos: ${total - available}</span>
  `;
  return stats;
}

function createStationCard(record, index) {
  const { available, total, percentage } = getStationAvailability(record);

  const card = document.createElement("div");
  card.className = getCardClassName(index);

  const title = createStationTitle(record.number);
  const address = createStationAddress(record.address, record);
  const progressBar = createProgressBar(percentage);
  const stats = createStationStats(available, total);

  card.appendChild(title);
  card.appendChild(address);
  card.appendChild(progressBar);
  card.appendChild(stats);

  return card;
}

function generateMapUrl(latitude, longitude) {
  const { MAP_BOUNDS_OFFSET } = CONFIG;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - MAP_BOUNDS_OFFSET
  },${latitude - MAP_BOUNDS_OFFSET},${longitude + MAP_BOUNDS_OFFSET},${
    latitude + MAP_BOUNDS_OFFSET
  }&layer=mapnik&marker=${latitude},${longitude}`;
}

function openMapModal(stationRecord) {
  const modal = document.getElementById("mapModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalAddress = document.getElementById("modalAddress");
  const mapFrame = document.getElementById("mapFrame");

  modalTitle.textContent = `Puesto #${stationRecord.number || CONFIG.DEFAULT_VALUE}`;
  modalAddress.textContent = stationRecord.address || CONFIG.DEFAULT_VALUE;

  const { lat, lon } = stationRecord["geo_point_2d"];
  const mapUrl = generateMapUrl(lat, lon);
  mapFrame.src = mapUrl;

  modal.style.display = "block";
}

function closeMapModal() {
  const modal = document.getElementById("mapModal");
  modal.style.display = "none";
}

function renderStations(stations) {
  const container = document.getElementById("stations");
  container.innerHTML = "";

  stations.forEach((station, index) => {
    const stationCard = createStationCard(station, index);
    container.appendChild(stationCard);
  });
}

function setupModalEvents() {
  const modal = document.getElementById("mapModal");
  const closeButton = document.querySelector(".close");

  closeButton.onclick = closeMapModal;

  window.onclick = function (event) {
    if (event.target === modal) {
      closeMapModal();
    }
  };
}
