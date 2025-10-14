import React from "react";

export default function SpoofingInfo() {
  return (
    <div className="panel full">
      <h2 className="panel-title">🔍 Types of Spoofing in Anti-Drone Technology</h2>

      <section>
        <h3 className="subhead">1. GNSS/GPS Spoofing</h3>
        <p>
          The attacker transmits counterfeit satellite signals that appear genuine. The drone
          locks onto the fake signals, miscalculating its position, altitude, or time.
        </p>
        <ul className="list">
          <li><b>Example:</b> Redirecting a delivery drone away from its path.</li>
          <li><b>Countermeasures:</b> Multi-GNSS (GPS, Galileo, GLONASS), signal authentication, anomaly detection.</li>
        </ul>
      </section>

      <section>
        <h3 className="subhead">2. Command & Control Spoofing</h3>
        <p>
          Exploits weak or unencrypted links between the drone and its operator. The attacker
          injects fake commands (e.g., “return to home” or “land now”).
        </p>
        <ul className="list">
          <li><b>Example:</b> Forcing an unauthorized drone to land at attacker’s location.</li>
          <li><b>Countermeasures:</b> Encrypted communication protocols, strong authentication.</li>
        </ul>
      </section>

      <section>
        <h3 className="subhead">3. Protocol Exploits</h3>
        <p>
          Attacks target weaknesses in telemetry or navigation protocols, inserting manipulated
          data streams that look legitimate.
        </p>
        <ul className="list">
          <li><b>Example:</b> False altitude data leading the drone to crash or evade detection radar.</li>
          <li><b>Countermeasures:</b> Firmware patching, intrusion detection on control links.</li>
        </ul>
      </section>

      <section>
        <h3 className="subhead">4. Sensor Spoofing</h3>
        <p>
          Instead of attacking navigation signals, adversaries spoof onboard sensors such as IMU,
          magnetometer, or vision. Subtle manipulations bias the drone’s flight control.
        </p>
        <ul className="list">
          <li><b>Example:</b> High-intensity lights or electromagnetic interference trick optical flow sensors.</li>
          <li><b>Countermeasures:</b> Sensor fusion (cross-validating multiple sensors), shielding, anomaly detection.</li>
        </ul>
      </section>

      <section>
        <h3 className="subhead">5. Data Injection Attacks</h3>
        <p>
          Malicious actors insert false correction data (e.g., fake RTK/GBAS base station messages)
          so that navigation solutions drift over time.
        </p>
        <ul className="list">
          <li><b>Example:</b> Slowly steering surveillance drones away from restricted zones.</li>
          <li><b>Countermeasures:</b> Signed correction messages, cross-checking multiple base stations.</li>
        </ul>
      </section>

      <section>
        <h3 className="subhead">Impact of Spoofing</h3>
        <p>
          Spoofing attacks can cause drones to <b>lose mission accuracy</b>, <b>violate airspace</b>,
          or even <b>be hijacked</b>. For security-critical sites (airports, military bases, power
          plants), spoofing represents a major threat.
        </p>
      </section>

      <section>
        <h3 className="subhead">Detection & Defense</h3>
        <ul className="list">
          <li>Use multi-constellation and multi-frequency GNSS receivers.</li>
          <li>Cross-validate position with inertial, vision, and barometric sensors.</li>
          <li>Deploy spoofing detection algorithms that look for anomalies in signal power, Doppler, or timing.</li>
          <li>Use encrypted & authenticated control channels.</li>
          <li>Employ external monitoring systems (radar, RF sensors) to validate drone behavior.</li>
        </ul>
      </section>

      <p className="note">
        👉 In this simulation: entering the <b>Danger Zone</b> triggers a spoofing event.
        The drone’s manual control is frozen, and it is automatically redirected to the <b>Safe Zone</b>.
      </p>
    </div>
  );
}
