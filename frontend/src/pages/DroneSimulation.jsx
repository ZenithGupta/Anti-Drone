import React, { useEffect, useRef, useState } from "react";
import Dashboard from "../components/Dashboard.jsx";

export default function DroneSimulation() {
  const world = { width: 720, height: 520 };

  // Circles
  const danger = { x: 420, y: 200, radius: 70 };
  const safe   = { x: 100, y: 380, radius: 48 };

  // Invisible warning ring
  const warningBuffer = 90;
  const warningRadius = danger.radius + warningBuffer;

  const [drone, setDrone] = useState({ x: 40, y: 40, width: 28, height: 28 });
  const [speed] = useState(10);
  const [spoofed, setSpoofed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [warning, setWarning] = useState(false);
  const [destroyed, setDestroyed] = useState(false);   // destruction state
  const [status, setStatus] = useState("");

  const moveRef = useRef(null);
  const lastWarnRef = useRef(false);

  // utils
  const clamp = (v, a, b) => Math.max(a, Math.min(v, b));
  const centerOf = (d) => ({ x: d.x + d.width / 2, y: d.y + d.height / 2 });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const angleOf = (C, P) => Math.atan2(P.y - C.y, P.x - C.x);
  const pointOnCircle = (C, r, ang) => ({ x: C.x + r * Math.cos(ang), y: C.y + r * Math.sin(ang) });

  const insideDanger = (pt) => dist(pt, { x: danger.x, y: danger.y }) <= danger.radius;
  const insideWarningOnly = (pt) => {
    const d = dist(pt, { x: danger.x, y: danger.y });
    return d > danger.radius && d <= warningRadius;
  };
  const insideSafe = (pt) => dist(pt, { x: safe.x, y: safe.y }) <= safe.radius;

  // segment-circle intersection
  function segHitsCircle(A, B, C, r) {
    const vx = B.x - A.x, vy = B.y - A.y;
    const wx = C.x - A.x, wy = C.y - A.y;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy;
    const t = c2 === 0 ? 0 : c1 / c2;
    const tt = Math.max(0, Math.min(1, t));
    const Closest = { x: A.x + vx * tt, y: A.y + vy * tt };
    return dist(Closest, C) <= r - 0.0001;
  }

  // animator (guards callbacks)
  function animateTo(targetTL, step = 6, onStep, onDone) {
    if (typeof onStep !== "function") onStep = () => {};
    if (typeof onDone !== "function") onDone = () => {};
    clearInterval(moveRef.current);
    moveRef.current = setInterval(() => {
      setDrone((prev) => {
        const dx = targetTL.x - prev.x;
        const dy = targetTL.y - prev.y;
        const d = Math.hypot(dx, dy);
        if (d <= step) {
          clearInterval(moveRef.current);
          onStep(targetTL);
          onDone();
          return { ...prev, x: targetTL.x, y: targetTL.y };
        }
        const nx = prev.x + (dx / d) * step;
        const ny = prev.y + (dy / d) * step;
        onStep({ x: nx, y: ny });
        return { ...prev, x: nx, y: ny };
      });
    }, 16);
  }

  // exit danger → arc around (r+10) → safe edge → safe center
  function buildArcThenSafePath(exitCenter, C, r, S, rs, droneWH) {
    const bufferR = r + 10;
    const a0 = angleOf(C, exitCenter);
    const aTarget = angleOf(C, S);

    let delta = aTarget - a0;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;

    const stepLen = 12;
    const arcLen = Math.abs(delta) * bufferR;
    const steps = Math.max(8, Math.ceil(arcLen / stepLen));

    const pointsTL = [];
    let lastAng = a0;

    for (let i = 1; i <= steps; i++) {
      const ang = a0 + (i / steps) * delta;
      const p = pointOnCircle(C, bufferR, ang);
      pointsTL.push({ x: p.x - droneWH.w / 2, y: p.y - droneWH.h / 2 });
      lastAng = ang;
    }

    const lastArcCenter = pointsTL.length
      ? { x: pointsTL[pointsTL.length - 1].x + droneWH.w / 2, y: pointsTL[pointsTL.length - 1].y + droneWH.h / 2 }
      : exitCenter;

    const safeEdgeFrom = (P) => {
      const dir = { x: P.x - S.x, y: P.y - S.y };
      const d = Math.hypot(dir.x, dir.y) || 1;
      return { x: S.x + (dir.x / d) * rs, y: S.y + (dir.y / d) * rs };
    };

    let edge = safeEdgeFrom(lastArcCenter);
    let attempts = 0;
    while (segHitsCircle(lastArcCenter, edge, C, r) && attempts < 24) {
      const bump = (delta >= 0 ? 1 : -1) * (Math.PI / 36);
      lastAng += bump;
      const p = pointOnCircle(C, bufferR, lastAng);
      pointsTL.push({ x: p.x - droneWH.w / 2, y: p.y - droneWH.h / 2 });
      const newCenter = { x: p.x, y: p.y };
      edge = safeEdgeFrom(newCenter);
      attempts++;
    }

    const edgeTL = { x: edge.x - droneWH.w / 2, y: edge.y - droneWH.h / 2 };
    const centerTL = { x: S.x - droneWH.w / 2, y: S.y - droneWH.h / 2 };

    pointsTL.push(edgeTL);
    pointsTL.push(centerTL);

    return pointsTL;
  }

  // destruction FX (plays *inside* the safe circle)
  const triggerDestruction = () => {
    clearInterval(moveRef.current);
    setDestroyed(true);
    setStatus("🛡️ Drone neutralized by defense system.");
    setTimeout(() => {
      setDrone({ x: 40, y: 40, width: 28, height: 28 });
      setSpoofed(false);
      setRedirecting(false);
      setWarning(false);
      setDestroyed(false);
      setStatus("Use arrow keys or WASD to move the drone.");
    }, 1400);
  };

  // spoof → exit → arc → safe → destroy
  const startSpoofSequence = (currentCenter) => {
    setSpoofed(true);
    setStatus("🚨 Spoof detected — moving out of danger zone...");

    const C = { x: danger.x, y: danger.y };
    const v = { x: currentCenter.x - C.x, y: currentCenter.y - C.y };
    const d0 = Math.hypot(v.x, v.y) || 1;
    const outward = { x: v.x / d0, y: v.y / d0 };

    const exitCenter = {
      x: C.x + outward.x * (danger.radius + 10),
      y: C.y + outward.y * (danger.radius + 10),
    };
    const exitTL = { x: exitCenter.x - drone.width / 2, y: exitCenter.y - drone.height / 2 };

    const S = { x: safe.x, y: safe.y };
    const pathTL = buildArcThenSafePath(exitCenter, C, danger.radius, S, safe.radius, {
      w: drone.width, h: drone.height,
    });

    const sequence = [exitTL, ...pathTL];
    let i = 0;

    const stepNext = () => {
      if (i >= sequence.length) {
        // At safe center → destroy (FX is rendered inside the safe circle)
        triggerDestruction();
        return;
      }
      const target = sequence[i++];
      setRedirecting(true);
      animateTo(target, 6, undefined, stepNext);
    };

    animateTo(exitTL, 6, undefined, stepNext);
  };

  // keyboard control + warning ring
  useEffect(() => {
    const handler = (e) => {
      if (spoofed || destroyed) return;
      const k = e.key.toLowerCase();
      let dx = 0, dy = 0;
      if (k === "arrowup" || k === "w") dy = -speed;
      if (k === "arrowdown" || k === "s") dy = speed;
      if (k === "arrowleft" || k === "a") dx = -speed;
      if (k === "arrowright" || k === "d") dx = speed;
      if (dx === 0 && dy === 0) return;

      setDrone((prev) => {
        const nx = clamp(prev.x + dx, 0, world.width - prev.width);
        const ny = clamp(prev.y + dy, 0, world.height - prev.height);
        const centerPt = { x: nx + prev.width / 2, y: ny + prev.height / 2 };

        // warning ring
        const warn = insideWarningOnly(centerPt);
        setWarning(warn);
        if (warn && !lastWarnRef.current) {
          setStatus("⚠️ Approaching restricted airspace...");
          lastWarnRef.current = true;
        }
        if (!warn && lastWarnRef.current) {
          if (!spoofed) setStatus("Use arrow keys or WASD to move the drone.");
          lastWarnRef.current = false;
        }

        // danger → spoof
        if (insideDanger(centerPt)) {
          startSpoofSequence(centerPt);
          return { ...prev };
        }

        // direct entry into safe (edge case) → destroy
        if (insideSafe(centerPt)) {
          triggerDestruction();
          return { ...prev, x: nx, y: ny };
        }

        return { ...prev, x: nx, y: ny };
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [spoofed, destroyed, speed]);

  // cleanup
  useEffect(() => () => clearInterval(moveRef.current), []);

  // derived flags for dashboard
  const droneCenter = centerOf(drone);
  const inDanger = insideDanger(droneCenter);
  const inSafe = insideSafe(droneCenter);

  return (
    <div className="layout">
      <div className="stage-card">
        <div className="stage-head">
          <div className="title">🎮 Simulation</div>
          <div className={`badge ${spoofed ? "bad" : destroyed ? "bad" : warning ? "bad" : "good"}`}>
            {spoofed ? "SPOOFED" : destroyed ? "NEUTRALIZED" : warning ? "WARNING" : "LIVE"}
          </div>
        </div>

        <div className="world" style={{ width: world.width, height: world.height }}>
          <div className="grid" />

          {/* Danger circle */}
          <div
            className="zone danger-circle"
            style={{
              left: danger.x - danger.radius,
              top: danger.y - danger.radius,
              width: danger.radius * 2,
              height: danger.radius * 2,
              borderRadius: "50%",
            }}
          >
            <span>Danger</span>
          </div>

          {/* Safe circle (FX will render inside this element) */}
          <div
            className="zone safe-circle"
            style={{
              left: safe.x - safe.radius,
              top: safe.y - safe.radius,
              width: safe.radius * 2,
              height: safe.radius * 2,
              borderRadius: "50%",
              overflow: "hidden" // ensure FX is clipped to the circle
            }}
          >
            <span>Safe</span>

            {/* Destruction FX inside the circle, centered */}
            {destroyed && (
              <div className="destroy-overlay destroy-overlay--centered">
                <div className="blast"></div>
                <div className="shockwave"></div>
                <div className="destroy-text"></div>
              </div>
            )}
          </div>

          {/* Drone */}
          <div
            className={`drone ${spoofed ? "spoofed" : ""} ${destroyed ? "destroyed" : ""}`}
            style={{ left: drone.x, top: drone.y, width: drone.width, height: drone.height }}
          >
            <div className="body">🚁</div>
            <div className="shadow" />
          </div>

          {/* Status */}
          <div className="toast" aria-live="polite">{status}</div>

          {/* Siren during WARNING */}
          {warning && !spoofed && !destroyed && (
            <div className="siren-banner" role="alert" aria-live="assertive">
              <div className="siren-icon" />
              <span>Approaching restricted airspace</span>
            </div>
          )}
        </div>
      </div>

      <Dashboard
        state={{
          x: drone.x,
          y: drone.y,
          width: drone.width,
          height: drone.height,
          speed,
          spoofed,
          redirecting,
          status,
          danger: { x: danger.x, y: danger.y, size: danger.radius * 2 },
          safe:   { x: safe.x,   y: safe.y,   size: safe.radius * 2 },
          inDanger,
          inSafe,
        }}
      />
      
    </div>
    
  );
}
