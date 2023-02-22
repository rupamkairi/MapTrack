import CustomMap from "./components/CustomMap";

function App() {
  return (
    <div className="App">
      <p>Drag The Marker to see Line drawn.</p>
      <p>Line made with PolyLine</p>
      <p>On Marker DragStart and DragEnd marks two points</p>
      <p>Watching those points Line Can be drawn</p>
      <div>
        <CustomMap />
      </div>
    </div>
  );
}

export default App;
