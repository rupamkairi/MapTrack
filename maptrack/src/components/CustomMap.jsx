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
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
    details: "Drag to See the Path",
    coordinates: center,
  },
];

const movePath = [
  {
    lat: 48.85,
    lng: 2.35,
  },
  {
    lat: 48.850070599189486,
    lng: 2.349943673610695,
  },
  {
    lat: 48.849991175094324,
    lng: 2.349953061342247,
  },
  {
    lat: 48.85005471438054,
    lng: 2.349902099370964,
  },
  {
    lat: 48.849979702714606,
    lng: 2.3499061226844864,
  },
  {
    lat: 48.85004412450512,
    lng: 2.349865889549263,
  },
  {
    lat: 48.84997440776926,
    lng: 2.3498645484447556,
  },
  {
    lat: 48.85003794707676,
    lng: 2.349826997518547,
  },
  {
    lat: 48.84996734784125,
    lng: 2.34982029199601,
  },
  {
    lat: 48.85001941478709,
    lng: 2.3497921288013535,
  },
  {
    lat: 48.849962935385726,
    lng: 2.3497827410698013,
  },
  {
    lat: 48.8500035299619,
    lng: 2.349749213457115,
  },
  {
    lat: 48.84994352057683,
    lng: 2.349742507934578,
  },
  {
    lat: 48.84999735252853,
    lng: 2.349718368053444,
  },
  {
    lat: 48.84993469566118,
    lng: 2.349703615903862,
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

  // this controls the auto moving marker's initial state
  const [autoMove, setAutoMove] = useState({
    details: "Auto Moving Marker",
    coordinates: movePath[0],
  });

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

  const markerRef = useRef(null);
  // by this index, moving markers location is being set
  const [autoMoveIndex, setAutoMoveIndex] = useState(0);
  // this is to watch intervalState, to flush otherwise multiple interval instance might be created
  const [intervalEnable, setIntervalEnable] = useState(true);
  useEffect(() => {
    let timer;
    if (intervalEnable) {
      timer = setInterval(() => {
        setAutoMoveIndex((prev) => prev + 1);
      }, 1500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [intervalEnable]);

  useEffect(() => {
    if (autoMoveIndex < movePath.length - 1)
      setAutoMove({ ...autoMove, coordinates: movePath.at(autoMoveIndex) });
  }, [autoMoveIndex]);

  return isLoaded ? (
    <Fragment>
      <code>{`autoMoveIndex ${autoMoveIndex}, lat: ${
        movePath.at(autoMoveIndex).lat
      } & lng: ${movePath.at(autoMoveIndex).lng}`}</code>
      {/* <LoadScriptNext googleMapsApiKey={MAP_API_KEY}> */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          {/* <Marker
            draggable
            position={marks.coordinates}
            label={marks.details}
            onClick={() => {
              setSelectedMark(marks);
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
          /> */}
          <Marker
            ref={markerRef}
            draggable
            position={autoMove.coordinates}
            label={autoMove.details}
            onClick={() => {
              setSelectedMark(marks);
            }}
            onPositionChanged={(e) => {
              // get the marker position to create the path
              let _dragPath = dragPath;
              _dragPath = [..._dragPath, markerRef.current?.props?.position];
              setDragPath(_dragPath);
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
