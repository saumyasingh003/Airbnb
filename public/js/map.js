
    document.addEventListener('DOMContentLoaded', function () {
      
      let mapToken = mapToken;
      console.log(mapToken);
    
      mapboxgl.accessToken = mapToken;
    
      const map = new mapboxgl.Map({
        container: "map",
        center: [77.209, 28.6139],
        zoom: 9,
      });
    });
    
 