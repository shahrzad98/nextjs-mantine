import { Box, BoxProps } from "@mantine/core";
import L, { LatLngExpression } from "leaflet";
import { FC } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

interface ILeafletMapProps extends BoxProps {
  position: LatLngExpression | undefined;
}
const LeafletMap: FC<ILeafletMapProps> = (props) => {
  const greenIcon = L.icon({
    iconUrl: "/img/mapPin.png",
    iconSize: [25, 37],
  });
  const initialPosition = {
    lat: 43.70404030217445,
    lng: -79.43319475268419,
  };

  return (
    <Box
      {...props}
      sx={{
        "& .leaflet-container": {
          zIndex: 0,
          "& .leaflet-right": {
            display: "none",
          },
        },
      }}
    >
      <MapContainer
        zoom={17}
        style={{ width: "100%", height: "100%" }}
        center={props.position ?? initialPosition}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker icon={greenIcon} position={props.position ?? initialPosition} />
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
