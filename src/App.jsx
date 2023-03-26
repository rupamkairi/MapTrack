import CustomMap from "./components/CustomMap";
import MapComponent from "./components/Map/MapComponent";

function App() {
  return (
    <div>
      {/* <p>Drag The Marker to see Line drawn.</p>
      <p>Line made with PolyLine</p>
      <p>On Marker DragStart and DragEnd marks two points</p>
      <p>Watching those points Line Can be drawn</p>
      <div>
        <CustomMap />
      </div> */}
      <MapComponent />
    </div>
  );
}

export default App;
