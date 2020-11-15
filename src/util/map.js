/**
 * Factory for loading the map in the application and exposing the set value method
 * @param { Number } lat latitude
 * @param { Number } lng longitude
 * @return { Function }
 */
export default (lat = 51.505, lng = -0.09) => {
  const map = L.map('map').setView([lat, lng], 13);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_ACCESS_TOKEN}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: process.env.VUE_APP_ACCESS_TOKEN,
  }).addTo(map);
  /**
   * Function for setting a new view in the map
   * @param { Number } newLat
   * @param { Number } newLng
   * @return { void }
   */
  return (newLat = 51.505, newLng = -0.09) => map.setView([newLat, newLng]);
};
