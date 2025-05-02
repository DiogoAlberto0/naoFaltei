"use client";
import markerIconSvg from "./markerIcon.svg";
import userIconSvg from "./userIcon.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DetailedHTMLProps, HTMLAttributes, useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

interface IMapProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onPress?: (pos: { Lat: number; Lng: number }) => void;
  markerPosition?: {
    latitude: number;
    longitude: number;
  };
  markerRadius?: number;
  userLocationPosition?: {
    latitude: number;
    longitude: number;
  };
}

const markerIcon = new L.Icon({
  iconUrl: markerIconSvg.src,
  iconSize: [35, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: userIconSvg.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ClickHandler({
  setPosition,
}: {
  setPosition: (pos: { Lat: number; Lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ Lat: e.latlng.lat, Lng: e.latlng.lng });
    },
  });
  return null;
}
const MapUpdater = ({
  position,
}: {
  position?: { latitude: number; longitude: number };
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.latitude, position.longitude], map.getZoom());
    }
  }, [position, map]);

  return null;
};
export const Map = ({
  onPress,
  markerPosition,
  userLocationPosition,
  markerRadius,
  ...otherProps
}: IMapProps) => {
  const defCenter = () => {
    if (userLocationPosition)
      return new L.LatLng(
        userLocationPosition.latitude,
        userLocationPosition.longitude,
      );
    if (markerPosition)
      return new L.LatLng(markerPosition.latitude, markerPosition.longitude);
    else return new L.LatLng(-10.3333, -53.2);
  };

  return (
    <div {...otherProps}>
      <MapContainer
        center={defCenter()}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full "
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markerPosition && (
          <>
            <Marker
              position={[markerPosition.latitude, markerPosition.longitude]}
              icon={markerIcon}
            />
          </>
        )}

        {markerRadius && markerPosition && (
          <>
            <Circle
              center={[markerPosition.latitude, markerPosition.longitude]}
              radius={markerRadius}
            />
          </>
        )}

        {userLocationPosition && (
          <>
            <Marker
              position={[
                userLocationPosition.latitude,
                userLocationPosition.longitude,
              ]}
              zIndexOffset={10}
              icon={userIcon}
            >
              <Popup>Você está aqui</Popup>
            </Marker>
          </>
        )}

        {(markerPosition || userLocationPosition) && (
          <MapUpdater position={userLocationPosition || markerPosition} />
        )}
        {onPress && <ClickHandler setPosition={onPress} />}
      </MapContainer>
    </div>
  );
};
