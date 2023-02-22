import {
  DrawingManager,
  GoogleMap,
  InfoBox,
  LoadScript,
  LoadScriptNext,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { MAP_API_KEY } from "../constnts";

const containerStyle = {
  width: "800px",
  height: "800px",
};

const center = {
  lat: 48.85,
  lng: 2.35,
};

const locations = [
  {
    details: "AbC",
    coordinates: center,
  },
];

const lineOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1,
};

function CustomMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAP_API_KEY,
  });

  const [map, setMap] = useState(null);

  const [marks, setMarks] = useState(locations.at(0));
  const [selectedMark, setSelectedMark] = useState(null);

  // to track by index to update end of the started drag & not any other
  const [dragIndex, setDragIndex] = useState(0);
  const [dragPoints, setDragPoints] = useState([]);
  const [dragPath, setDragPath] = useState([]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    console.log(dragIndex);
    let _dragPath = [];
    for (let i = 0; i < dragPoints.length; i++) {
      let el = dragPoints[i];
      if (i < dragIndex - 1) _dragPath.push(el.start);
      if (i === dragIndex - 1) {
        _dragPath.push(el.start);
        _dragPath.push(el.end);
      }
    }
    setDragPath(_dragPath);
  }, [dragIndex]);
  // dragIndex changes each time when mouse drag ends

  return isLoaded ? (
    <Fragment>
      {/* <LoadScriptNext googleMapsApiKey={MAP_API_KEY}> */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          <Marker
            draggable
            position={marks.coordinates}
            label={marks.details}
            onClick={() => {
              setSelectedMark(marks);
            }}
            onDrag={(val) => {
              // console.log("drag", val);
            }}
            onDragStart={(e) => {
              const dragStartPoint = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };

              let _dragPoints = dragPoints;
              _dragPoints.push({});
              _dragPoints.at(dragIndex).start = dragStartPoint;
              setDragPoints(_dragPoints);
            }}
            onDragEnd={(e) => {
              const dragEndPoint = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              };

              let _dragPoints = dragPoints;
              _dragPoints.at(dragIndex).end = dragEndPoint;
              setDragPoints(_dragPoints);
              setDragIndex(dragIndex + 1);
            }}
          />
          <Polyline path={dragPath} />
        </>
      </GoogleMap>
      {/* </LoadScriptNext> */}
      <pre>{JSON.stringify(dragPath, null, 2)}</pre>
    </Fragment>
  ) : (
    <Fragment></Fragment>
  );
}

export default memo(CustomMap);
