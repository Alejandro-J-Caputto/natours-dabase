/* eslint-disable */
console.log('hello from the client side');
export const displayMap = (locations) => {
 

mapboxgl.accessToken = 'pk.eyJ1IjoidGVuZWthaXNpIiwiYSI6ImNranR1eDRkdzQyN3UydHFvdHdlcXBzdnMifQ.cAafJiR5Wn9Q4q8zmYjNpg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tenekaisi/ckju0o7ro0v3w1ao7bbd883ri',
  scrollZoom: false
  
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //ADD MARKER
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    achor: 'bottom'
  }).setLngLat(loc.coordinates).addTo(map);

  bounds.extend(loc.coordinates);
})

map.fitBounds(bounds)
}
