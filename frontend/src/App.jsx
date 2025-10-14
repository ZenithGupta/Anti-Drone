// File: anti-drone-system/frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import DroneSimulation from "./pages/DroneSimulation.jsx";
import SpoofingInfo from "./pages/SpoofingInfo.jsx";
import "./styles.css";

export default function App() {
  return (
    <Router>
      <header className="app-header">
        <div className="brand">🛡️ Anti-Drone Control</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/simulate">Simulation</Link>
          <Link to="/spoofing-info">Spoofing Types</Link>
          <a href="http://localhost:5000/api/logs" target="_blank" rel="noreferrer">Backend Logs</a>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/simulate" element={<DroneSimulation />} />
          <Route path="/spoofing-info" element={<SpoofingInfo />} />
        </Routes>
      </main>

      
    </Router>
  );
}
