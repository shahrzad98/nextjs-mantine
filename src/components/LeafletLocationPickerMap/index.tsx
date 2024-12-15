import { IGeoLocation } from "@/types/location";
import { Box, BoxProps, LoadingOverlay } from "@mantine/core";
import L from "leaflet";
import React, { FC, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

export interface ISelectedLocation extends IGeoLocation {
  value: string;
}
interface ILeafletLocationPickerMapProps {
  center: {
    lat: number;
    lng: number;
  };
  onClick?: ({ lat, lng }: { lat: number; lng: number }) => void;
  loading: boolean;
  wrapperProps: BoxProps;
}

const LeafletLocationPickerMap: FC<ILeafletLocationPickerMapProps> = ({
  center,
  onClick,
  loading,
  wrapperProps,
}) => {
  const MapWatcher = () => {
    const greenIcon = L.icon({
      iconUrl: "/img/mapPin.png",
      iconSize: [25, 37],
    });

    const map = useMap();

    return <Marker icon={greenIcon} position={map.getCenter()} autoPan />;
  };

  const MoveMapToSelectedLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();

    useEffect(() => {
      map.setView(
        {
          lat,
          lng,
        },
        17,
        {
          animate: false,
        }
      );
    }, [lat, lng]);

    return null;
  };

  const ChangeMarkerLocation = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map = useMapEvents({
      click: (location) => {
        if (onClick && !loading) {
          onClick(location.latlng);
        }
      },
    });

    return null;
  };

  return (
    <>
      <Box {...wrapperProps} pos="relative">
        <MapContainer
          zoom={17}
          style={{ width: "100%", height: "100%" }}
          center={center}
          dragging={!loading}
        >
          <MapWatcher />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MoveMapToSelectedLocation lat={center.lat} lng={center.lng} />
          <ChangeMarkerLocation />
        </MapContainer>
        <LoadingOverlay visible={loading} overlayBlur={8} zIndex={1001} />
      </Box>
    </>
  );
};

export default LeafletLocationPickerMap;
