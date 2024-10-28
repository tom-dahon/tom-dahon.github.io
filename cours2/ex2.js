if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap);
} else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
}

function initMap(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const map = L.map('map').setView([userLat, userLon], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(map);

    L.marker([userLat, userLon]).addTo(map).bindPopup("Vous êtes ici").openPopup();

    L.circle([userLat, userLon], {
        radius: accuracy,
        color: "blue",
        fillOpacity: 0.3
    }).addTo(map);

    const bermudaTriangle = L.polygon([
        [25.774, -80.19],
        [32.321, -64.757],
        [18.466, -66.118]
    ], { color: "red" }).addTo(map);

    const marseille = [43.2965, 5.3698];
    const nice = [43.7102, 7.2620];

    L.polyline([marseille, nice], { color: "green" }).addTo(map);

    const distanceToMarseille = calculateDistance(userLat, userLon, marseille[0], marseille[1]);
    L.popup()
        .setLatLng(marseille)
        .setContent(`Distance jusqu'à Marseille : ${distanceToMarseille.toFixed(2)} km`)
        .openOn(map);
}

// Fonction pour calculer la distance en utilisant la formule du grand cercle (en km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Convertir des degrés en radians
function toRad(value) {
    return value * Math.PI / 180;
}

