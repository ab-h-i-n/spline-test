import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJoaW4yazMiLCJhIjoiY20wbWh5ZHFwMDJwcjJqcHVjM3kyZjZlNyJ9.cagUWYMuMzLdJQhMbYB50A";

export default function App() {
  const initializeMap = (center) => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/abhin2k3/cm949rnw2009k01skcywm19gm?optimize=true",
      zoom: 18,
      center: center,
      antialias: true,
    });

    map.on("load", () => {
      geolocate.trigger();
      map.flyTo({
        center: center,
        zoom: 21,
        bearing: -35.9,
        pitch: 65.48,
        essential: true,
      });
    });

    const geolocate = new mapboxgl.GeolocateControl({
      fitBoundsOptions: {
        zoom: 20,
        bearing: -35.9,
        pitch: 65.48,
        center: center,
        duration: 2000,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });

    map.addControl(geolocate);
    geolocate.trigger();

    geolocate.on("geolocate", (e) => {
      const { coords } = e;
      const userCoordinate = [coords.longitude, coords.latitude];

      placeUserModel(map, userCoordinate);
    });
  };

  const placeUserModel = (map, center) => {

    if(map.getLayer("custom-threebox-model")) {
      return;
    }

    var userModel;

    map.addLayer({
      id: "custom-threebox-model",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, gl) {
        window.tb = new Threebox(map, gl, {
          defaultLights: true,
        });

        const options = {
          obj: "/animal_crossing_test/scene.gltf",
          type: "gltf",
          scale: 0.2,
          units: "meters",
          rotation: { x: 90, y: -90, z: 0 },
        };

        tb.loadObj(options, (model) => {
          userModel = model.setCoords(center);
          tb.add(model);
        });
      },

      render: function () {
        window.tb.update();
      },
    });

  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;
        const userCoordinate = [coords.longitude, coords.latitude];

        initializeMap(userCoordinate);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );

    console.log("Mapbox GL JS version:", mapboxgl.version);
  }, []);

  return <main id="map" style={{ width: "100%", height: "100vh" }} />;
}
