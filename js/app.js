async function loadStations() {
  try {
    const stations = await fetchStationsData();
    renderStations(stations);
  } catch (error) {
    console.error("Error loading stations:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupModalEvents();
  loadStations();
});
