const CONFIG = {
  API_URL:
    "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/valenbisi-disponibilitat-valenbisi-dsiponibilidad/exports/json?lang=es&timezone=Europe%2FBerlin",
  DEFAULT_VALUE: "Dato no disponible",
  MAP_BOUNDS_OFFSET: 0.001,
};

function getStationAvailability(record) {
  const available = record.available || 0;
  const total = record.total || 0;
  const percentage = total > 0 ? (available / total) * 100 : 0;
  return { available, total, percentage };
}

function hasValidCoordinates(record) {
  return record["geo_point_2d"] && record["geo_point_2d"].lat && record["geo_point_2d"].lon;
}

async function fetchStationsData() {
  try {
    const response = await fetch(CONFIG.API_URL);
    const data = await response.json();
    return data.sort((a, b) => a.number - b.number);
  } catch (error) {
    console.error("Error fetching stations data:", error);
    throw error;
  }
}
