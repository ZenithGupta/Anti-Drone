import React, { useState, useEffect, useRef } from "react";
import "./DroneSimulation.css";

export default function DroneSimulation() {
  const [drone, setDrone] = useState({ x: 50, y: 50 });
  const [spoofed, setSpoofed] = useState(false);
  const [message, setMessage] = useState("Use arrow keys to move the drone!");
  const [redirecting, setRedirecting] = useState(false);

  const gameArea = { width: 500, height: 500 };
  const dangerZone = { x: 250, y: 200, radius: 60 };
  const safeZone = { x: 60, y: 420 };

  const intervalRef = useRef(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (spoofed) return; // controls disabled when spoofed
      setDrone((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" || e.key === "w") y -= 10;
        if (e.key === "ArrowDown" || e.key === "s") y += 10;
        if (e.key === "ArrowLeft" || e.key === "a") x -= 10;
        if (e.key === "ArrowRight" || e.key === "d") x += 10;

        // bounds
        x = Math.max(0, Math.min(x, gameArea.width - 20));
        y = Math.max(0, Math.min(y, gameArea.height - 20));

        // Check danger zone entry
        const dx = x - dangerZone.x;
        const dy = y - dangerZone.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= dangerZone.radius) {
          setSpoofed(true);
          setMessage("🚨 Drone spoofed! Redirecting to safe zone…");
          return { ...prev }; // freeze immediately
        }
        return { x, y };
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spoofed]);

  // Auto-redirect to safe zone when spoofed
  useEffect(() => {
    if (spoofed) {
      setRedirecting(true);
      intervalRef.current = setInterval(() => {
        setDrone((prev) => {
          const dx = safeZone.x - prev.x;
          const dy = safeZone.y - prev.y;
          const step = 5;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < step) {
            clearInterval(intervalRef.current);
            setMessage("✅ Drone reached safe zone. Restarting simulation…");
            setTimeout(() => {
              setDrone({ x: 50, y: 50 });
              setSpoofed(false);
              setRedirecting(false);
              setMessage("Use arrow keys to move the drone!");
            }, 2000);
            return safeZone;
          }

          return { x: prev.x + (dx / dist) * step, y: prev.y + (dy / dist) * step };
        });
      }, 30);
    }
    return () => clearInterval(intervalRef.current);
  }, [spoofed]);

  return (
    <div className="game-container">
      <h1>🚁 Anti-Drone Spoofing Simulation</h1>
      <p className="status">{message}</p>

      <div
        className="game-area"
        style={{ width: gameArea.width, height: gameArea.height }}
      >
        {/* Danger Zone (circle) */}
        <div
          className="danger-zone"
          style={{
            left: dangerZone.x - dangerZone.radius,
            top: dangerZone.y - dangerZone.radius,
            width: dangerZone.radius * 2,
            height: dangerZone.radius * 2,
          }}
        ></div>

        {/* Safe Zone */}
        <div
          className="safe-zone"
          style={{ left: safeZone.x, top: safeZone.y }}
        >
          🟢
        </div>

        {/* Drone */}
        <div
          className={`drone ${spoofed ? "spoofed" : ""}`}
          style={{ left: drone.x, top: drone.y }}
        >
          🚁
        </div>
      </div>
    </div>
  );
}
  