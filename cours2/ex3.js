const map = L.map('map').setView([43.7102, 7.2620], 12);  // Centre sur Nice
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

fetch("https://opendata.nicecotedazur.org/data/storage/f/2024-02-19T10%3A29%3A14.897Z/ev-equipement-opendata-2024-02.geojson")
    .then(response => response.json())
    .then(data => {
        // Ajouter les données GeoJSON sur la carte
        L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error("Erreur lors du chargement des données GeoJSON :", error));

const startPoint = [43.7102, 7.2620];
const endPoint = [43.2965, 5.3698];

fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint[1]},${startPoint[0]};${endPoint[1]},${endPoint[0]}?geometries=geojson&access_token=pk.eyJ1IjoiY3YwNiIsImEiOiJjajg2MmpzYjcwbWdnMzNsc2NzM2l4eW0yIn0.TfDJipR5II7orUZaC848YA`)
    .then(response => response.json())
    .then(data => {
        const route = data.routes[0].geometry;  // Chemin du trajet

        // Ajout du trajet en ligne sur la carte
        L.geoJSON(route, {
            style: { color: "blue", weight: 4 }
        }).addTo(map);
    })
    .catch(error => console.error("Erreur lors de la récupération du trajet :", error));
