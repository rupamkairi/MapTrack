import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { Fragment } from "react";
import { MAP_API_KEY } from "../../constnts";

const containerStyle = {
  width: "800px",
  height: "800px",
};
const center = {
  lat: 0,
  lng: 0,
};

export default function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAP_API_KEY,
  });

  return isLoaded ? (
    <Fragment>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={3}
      ></GoogleMap>
    </Fragment>
  ) : (
    <Fragment></Fragment>
  );
}
