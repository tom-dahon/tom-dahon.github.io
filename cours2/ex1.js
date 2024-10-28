if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap);
} else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
}

function initMap(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const map = L.map('map').setView([userLat, userLon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([userLat, userLon]).addTo(map).bindPopup("Vous êtes ici").openPopup();

    // Ajouter un marqueur pour le centre-ville de Nice
    const niceLat = 43.7102, niceLon = 7.2620;
    L.marker([niceLat, niceLon]).addTo(map).bindPopup("Nice, centre ville");
}

