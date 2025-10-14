import React from "react";

function Dashboard({ state = {} }) {
  // Safe defaults to avoid crashes if a field is missing
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    speed = 0,
    spoofed = false,
    redirecting = false,
    status = "",
    danger = { x: 0, y: 0, size: 0 },
    safe = { x: 0, y: 0, size: 0 },
    inDanger = false,
    inSafe = false,
  } = state ?? {};

  return (
    <aside className="panel">
      <h3 className="panel-title">📊 Drone Dashboard</h3>

      <div className="kv">
        <div>
          <span>Position</span>
          <strong>{`(${Math.round(x)}, ${Math.round(y)})`}</strong>
        </div>
        <div>
          <span>Velocity</span>
          <strong>{speed}px/step</strong>
        </div>
        <div>
          <span>Size (w×h)</span>
          <strong>
            {width}×{height}
          </strong>
        </div>
        <div>
          <span>Status</span>
          <strong className={spoofed ? "chip danger" : "chip ok"}>
            {spoofed ? "SPOOFED" : "NORMAL"}
          </strong>
        </div>
        <div>
          <span>Redirecting</span>
          <strong className={redirecting ? "chip warn" : "chip muted"}>
            {redirecting ? "YES" : "NO"}
          </strong>
        </div>
      </div>

      <h4 className="subhead">🟥 Danger Zone (Square)</h4>
      <div className="kv small">
        <div>
          <span>Top-Left</span>
          <strong>({danger.x}, {danger.y})</strong>
        </div>
        <div>
          <span>Size</span>
          <strong>
            {danger.size}×{danger.size}
          </strong>
        </div>
        <div>
          <span>Inside?</span>
          <strong className={inDanger ? "chip danger" : "chip ok"}>
            {inDanger ? "YES" : "NO"}
          </strong>
        </div>
      </div>

      <h4 className="subhead">🟩 Safe Zone (Square)</h4>
      <div className="kv small">
        <div>
          <span>Top-Left</span>
          <strong>({safe.x}, {safe.y})</strong>
        </div>
        <div>
          <span>Size</span>
          <strong>
            {safe.size}×{safe.size}
          </strong>
        </div>
        <div>
          <span>Inside?</span>
          <strong className={inSafe ? "chip ok" : "chip muted"}>
            {inSafe ? "YES" : "NO"}
          </strong>
        </div>
      </div>

      <div className="status-card">
        <div className="status-dot" data-danger={spoofed} />
        <div className="status-text">{status}</div>
      </div>

      <div className="help">
        <div className="kbd">W</div>
        <div className="kbd">A</div>
        <div className="kbd">S</div>
        <div className="kbd">D</div>
        <div className="sep"></div>
        <div className="kbd">↑</div>
        <div className="kbd">←</div>
        <div className="kbd">↓</div>
        <div className="kbd">→</div>
      </div>
    </aside>
  );
}

export default React.memo(Dashboard);
