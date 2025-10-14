import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const SPOOFING = [
  {
    key: "gnss",
    name: "GNSS/GPS Spoofing",
    desc:
      "An attacker transmits counterfeit satellite-like signals so the drone computes a false position, altitude, or time. " +
      "Common defenses: multi-constellation GNSS, signal authentication, and anomaly detection (power, Doppler, timing).",
    video: "https://www.youtube.com/embed/L9nUqtOLbPM?si=Voj_yefBahDN_nGi"
  },
  {
    key: "c2",
    name: "Command & Control Spoofing",
    desc:
      "Exploits weak or unencrypted control links to inject false commands (e.g., land, RTH). " +
      "Defenses: encryption, strong authentication, link intrusion detection.",
      video:"https://www.youtube.com/embed/eEw_VZ5xdcE?si=kYDfq3p0O_7ksCUs"
  },
  {
    key: "protocol",
    name: "Protocol Exploits",
    desc:
      "Manipulates telemetry/navigation protocols to insert crafted data that appears valid. " +
      "Defenses: firmware patching, signed messages, and IDS on control channels.",
      video:"https://www.youtube.com/embed/rbd4ic0Oico?si=rPUQ6WXAGbkxTjwR"
  },
  {
    key: "sensor",
    name: "Sensor Spoofing",
    desc:
      "Deceives onboard sensors (IMU, magnetometer, optical flow/vision) using targeted interference. " +
      "Defenses: sensor fusion, shielding, cross-checks against independent sensors.",
      video:"https://www.youtube.com/embed/80No8NPKkes?si=ZfuAGSM0LmirYz8y"
  },
  {
    key: "injection",
    name: "Data Injection Attacks",
    desc:
      "Corrupts correction streams (e.g., RTK/GBAS) so navigation drifts gradually. " +
      "Defenses: signed corrections, multiple base-station cross-validation.",
      video: "https://www.youtube.com/embed/MGS3Ujw3d6I?si=tHuq4qScBxIKTZUE",
  },
];

export default function Landing() {
  const nav = useNavigate();
  const [selKey, setSelKey] = useState(SPOOFING[0].key);

  const selected = useMemo(() => SPOOFING.find(s => s.key === selKey), [selKey]);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Anti-Drone Technology</h1>
          <p className="hero-sub">
            Explore how spoofing affects UAV navigation and how defenses respond.
            Choose a technique to learn more, then launch the live simulation.
          </p>

          {/* Controls */}
          <div className="hero-controls">
            <label className="select-label" htmlFor="spoofing-type">
              Spoofing Type
            </label>
            <select
              id="spoofing-type"
              className="select"
              value={selKey}
              onChange={(e) => setSelKey(e.target.value)}
            >
              {SPOOFING.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={() => nav("/simulate")}>
              ▶ Start Simulation
            </button>
          </div>

          {/* Info + Media */}
          <div className="info-grid">
            <article className="card info">
              <h3 className="info-title">{selected?.name}</h3>
              <p className="info-text">{selected?.desc}</p>
              <div className="info-meta">
                <span className="tag">Spoofing</span>
                <span className="sep">•</span>
                <span className="muted">Learn more on the Spoofing Types page</span>
              </div>
            </article>

            {/* Media section — YouTube or placeholder */}
            <div className="card media" aria-label="Video/GIF section">
              {selected?.video ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={selected.video}
                  title={selected.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    border: "none",
                    borderRadius: "12px",
                    aspectRatio: "16 / 9",
                  }}
                ></iframe>
              ) : (
                <div className="media-inner">
                  <span className="media-note">Add your video / GIF here</span>
                  <span className="media-sub">(16:9 recommended)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer buttons */}
    </div>
  );
}
