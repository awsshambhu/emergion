import "./App.css";
import InitiateHelp from "./components/InitiateHelp";
import MapViewComponent from "./components/mapView";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Companion from "./components/Companion";
import Home from "./components/Home"
import User from "./components/User";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ marginTop: "100px" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="companion" element={<Companion />} />
        <Route path="needhelp" element={<InitiateHelp />} />
        <Route path="user" element={<User />} />
        <Route path="mapview/:id" element={<MapViewComponent />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
