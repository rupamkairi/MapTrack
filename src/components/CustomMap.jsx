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

// created a center
const center = {
  lat: 48.85,
  lng: 2.35,
};

// and a location to put the marker from the beginning
const locations = [
  {
    details: "AbC",
    coordinates: center,
  },
];

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
  // points are the start and end coordinates of the drag
  const [dragPoints, setDragPoints] = useState([]);
  // it will contain all starting points and starting & end point of the last drag
  // otherwise the last line wont be drawn
  const [dragPath, setDragPath] = useState([]);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // this useeffect watched on the change of dragIndex value
  useEffect(() => {
    // console.log(dragIndex);
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

              // stores the drag point at start
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

              // stores the drag point at end
              let _dragPoints = dragPoints;
              _dragPoints.at(dragIndex).end = dragEndPoint;
              setDragPoints(_dragPoints);

              // updates the index of the drag for the next dragStart
              setDragIndex(dragIndex + 1);
            }}
          />
          <Polyline path={dragPath} />
        </>
      </GoogleMap>
      {/* </LoadScriptNext> */}
      <pre>{JSON.stringify({ dragPoints, dragPath }, null, 2)}</pre>
    </Fragment>
  ) : (
    <Fragment></Fragment>
  );
}

export default memo(CustomMap);
