import "./App.css";
import LeafletMap from "./LeafletMap";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="map">
       <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
      <Route path="/" element={<LeafletMap />} />
        <Route path="/:latitude/:longitude/:zoom" element={<LeafletMap />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
