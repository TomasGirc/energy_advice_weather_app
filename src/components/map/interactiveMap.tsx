import { useState } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocationStore } from "@/store/location/locationStore";
import L from "leaflet";

const blackDotIcon = L.divIcon({
  className: "custom-black-dot",
  html: '<div style="width:16px;height:16px;background:black;border-radius:50%;border:2px solid white;box-shadow:0 0 2px #000;transform:translate(-50%,-50%)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker position={position} icon={blackDotIcon}>
      <Popup>
        Latitude: {position[0].toFixed(5)}, Longitude: {position[1].toFixed(5)}
      </Popup>
    </Marker>
  );
}

const InteractiveMap = () => {
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const saveLocation = useLocationStore((state) => state.saveLocation);
  const deleteLocation = useLocationStore((state) => state.deleteLocation);
  const locationList = useLocationStore((state) => state.locationList);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    location.latitude,
    location.longitude,
  ]);
  const notyf = new Notyf();

  const handleSetPosition = (pos: [number, number]) => {
    setMarkerPosition(pos);
    const newLoc = { ...location, latitude: pos[0], longitude: pos[1] };
    setLocation(newLoc);
    const params = new URLSearchParams(window.location.search);
    params.set("lat", pos[0].toString());
    params.set("lng", pos[1].toString());
    if (newLoc.start_date) params.set("start_date", newLoc.start_date);
    if (newLoc.end_date) params.set("end_date", newLoc.end_date);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  };

  const handleSaveLocation = () => {
    saveLocation();
    notyf.success("Location position saved!");
  };

  const handleDeleteLocation = () => {
    deleteLocation();
    notyf.error("Location position deleted!");
  };

  function updateMarkerPositionFromLocation(loc: {
    latitude: number;
    longitude: number;
  }) {
    setMarkerPosition([loc.latitude, loc.longitude]);
    setLocation({
      ...location,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    const params = new URLSearchParams(window.location.search);
    params.set("lat", loc.latitude.toString());
    params.set("lng", loc.longitude.toString());
    if (location.start_date) params.set("start_date", location.start_date);
    if (location.end_date) params.set("end_date", location.end_date);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }

  return (
    <>
      <MapContainer
        center={markerPosition}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={markerPosition}
          setPosition={handleSetPosition}
        />

        {locationList.map((loc, idx) => (
          <Marker
            key={idx}
            position={[loc.latitude, loc.longitude]}
            icon={blackDotIcon}
            eventHandlers={{
              click: () => {
                updateMarkerPositionFromLocation(loc);
              },
            }}
          >
            <Popup>
              Latitude: {loc.latitude.toFixed(5)}, Longitude:{" "}
              {loc.longitude.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="flex gap-2 mt-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSaveLocation}
        >
          Save location position
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteLocation}
        >
          Delete selected location
        </button>
      </div>
    </>
  );
};

export default InteractiveMap;
