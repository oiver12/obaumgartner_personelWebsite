import React, { useRef, useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  drawPhasor,
  drawPhasorBackground,
  drawTimeDomainGraph,
  drawVerticalProjection,
  drawRealValueLabel,
  drawSinusoid,
  drawTimePoint,
} from "../zeiger_logic";

interface Phasor {
  name: string;
  amplitude: number; // in V
  phase: number; // in radians
  color: string;
  show: boolean;
}

const ZeigerPage: React.FC = () => {
  // Canvas ref - we'll use a single canvas for both phasor and time domain
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation states
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [frequency, setFrequency] = useState(0.5); // Default to 0.5 Hz

  // Phasor states
  const [phasors, setPhasors] = useState<Phasor[]>([
    { name: "U₀", amplitude: 80, phase: 0, color: "#2196F3", show: true },
    {
      name: "U₁",
      amplitude: 60,
      phase: Math.PI / 3,
      color: "#E91E63",
      show: true,
    },
  ]);

  // Toggle for sum vector
  const [showSum, setShowSum] = useState(true);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = 0;
    const omega = 2 * Math.PI * frequency;

    const render = (timestamp: number) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      if (lastFrameTime === 0) lastFrameTime = timestamp;
      const deltaTime = (timestamp - lastFrameTime) / 1000;
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Layout dimensions
      const { width, height } = ctx.canvas;
      const phasorCenterX = width / 2;
      const phasorCenterY = height * 0.4;
      const phasorRadius = 100;

      // Time domain graph dimensions
      const graphY = height * 0.75;
      const graphHeight = 60;
      const graphStartX = width * 0.2;
      const graphEndX = width * 0.8;

      // Draw the phasor diagram background
      drawPhasorBackground(ctx, phasorCenterX, phasorCenterY, phasorRadius);

      // Draw the time domain graph background
      drawTimeDomainGraph(ctx, graphStartX, graphEndX, graphY, graphHeight);

      // Current angle based on time
      const angle = omega * time;

      // Track sum of components
      let sumX = 0;
      let sumY = 0;
      let labelIndex = 0;
      const visiblePhasorCount =
        phasors.filter((p) => p.show).length + (showSum ? 1 : 0);

      // Draw each visible phasor
      phasors.forEach((phasor) => {
        if (!phasor.show) return;

        const totalAngle = angle + phasor.phase;
        const x = phasor.amplitude * Math.cos(totalAngle);
        const y = phasor.amplitude * Math.sin(totalAngle);

        // Add to sum
        sumX += x;
        sumY += y;

        // Draw the phasor in the circle
        drawPhasor(
          ctx,
          totalAngle,
          phasor.amplitude,
          phasor.color,
          phasor.name,
          phasorCenterX,
          phasorCenterY,
          phasorRadius
        );

        // Draw vertical projection line straight down to show x component (real value)
        drawVerticalProjection(
          ctx,
          phasorCenterX,
          phasorCenterY,
          x,
          phasor.color
        );

        const labelWidth = 110;
        const totalLabelsWidth = visiblePhasorCount * labelWidth;
        const labelsStartX = phasorCenterX - totalLabelsWidth / 2;
        // Display the real value at the bottom with a label
        drawRealValueLabel(
          ctx,
          labelsStartX + labelIndex * labelWidth, // X position based on index
          phasorCenterY +
            phasors[0].amplitude * Math.cos(phasors[0].phase) +
            40,
          x,
          phasor.name,
          phasor.color
        );
        labelIndex++;

        // Draw the sinusoid in the time domain graph
        drawSinusoid(
          ctx,
          phasor.amplitude,
          phasor.phase,
          phasor.color,
          graphStartX,
          graphEndX,
          graphY,
          graphHeight
        );

        // Draw the current point on the sinusoid
        drawTimePoint(
          ctx,
          angle,
          phasor.amplitude,
          phasor.phase,
          phasor.color,
          graphStartX,
          graphEndX,
          graphY,
          graphHeight
        );
      });

      // Draw sum vector if enabled
      if (showSum && phasors.some((p) => p.show)) {
        const sumAngle = Math.atan2(sumY, sumX);
        const sumMagnitude = Math.sqrt(sumX * sumX + sumY * sumY);

        // Draw sum phasor if we have visible phasors
        drawPhasor(
          ctx,
          sumAngle,
          sumMagnitude,
          "#4CAF50",
          "Sum",
          phasorCenterX,
          phasorCenterY,
          phasorRadius
        );

        // Draw vertical projection for sum
        drawVerticalProjection(
          ctx,
          phasorCenterX,
          phasorCenterY,
          sumX,
          "#4CAF50"
        );

        // Display sum real value label
        drawRealValueLabel(
          ctx,
          phasorCenterX + 110,
          phasorCenterY +
            phasors[0].amplitude * Math.cos(phasors[0].phase) +
            40,
          sumX,
          "Sum",
          "#4CAF50"
        );

        // Draw sum sinusoid
        drawSinusoid(
          ctx,
          sumMagnitude,
          phasors[0].phase + phasors[1].phase,
          "#4CAF50",
          graphStartX,
          graphEndX,
          graphY,
          graphHeight
        );

        // Draw sum time point
        drawTimePoint(
          ctx,
          angle,
          sumMagnitude,
          phasors[0].phase + phasors[1].phase,
          "#4CAF50",
          graphStartX,
          graphEndX,
          graphY,
          graphHeight
        );
      }

      if (isRunning) {
        setTime((prevTime) => prevTime + deltaTime);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, time, phasors, frequency, showSum]);

  // Handle phasor amplitude change
  const handleAmplitudeChange = (index: number, value: number) => {
    setPhasors((prev) =>
      prev.map((p, i) => (i === index ? { ...p, amplitude: value } : p))
    );
  };

  // Handle phasor phase change
  const handlePhaseChange = (index: number, value: number) => {
    setPhasors((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, phase: (value * Math.PI) / 180 } : p
      )
    );
  };

  // Handle phasor visibility toggle
  const handleVisibilityToggle = (index: number) => {
    setPhasors((prev) =>
      prev.map((p, i) => (i === index ? { ...p, show: !p.show } : p))
    );
  };

  return (
    <Layout>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Electrical Circuit Phasors</h1>

        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: "2" }}>
            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9",
              }}
            />
          </div>

          <div style={{ flex: "1" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3>Simulation Controls</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Frequency (Hz): {frequency.toFixed(1)} Hz
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    style={{ width: "200px" }}
                  />
                </div>

                <button
                  onClick={() => setIsRunning(!isRunning)}
                  style={{
                    padding: "0.6rem 1.2rem",
                    backgroundColor: isRunning ? "#f44336" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {isRunning ? "Stop" : "Start"}
                </button>
              </div>
            </div>

            <h3>Phasor Settings</h3>

            {/* Individual Phasor Controls */}
            {phasors.map((phasor, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  backgroundColor: phasor.show ? "#fff" : "#f5f5f5",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: "bold",
                      color: phasor.color,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={phasor.show}
                      onChange={() => handleVisibilityToggle(index)}
                    />
                    {phasor.name}
                  </label>
                </div>

                {/* Amplitude slider */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.25rem" }}>
                    Amplitude: {phasor.amplitude}V
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={phasor.amplitude}
                    onChange={(e) =>
                      handleAmplitudeChange(index, parseInt(e.target.value))
                    }
                    disabled={!phasor.show}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Phase slider */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem" }}>
                    Phase: {Math.round((phasor.phase * 180) / Math.PI)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={Math.round((phasor.phase * 180) / Math.PI)}
                    onChange={(e) =>
                      handlePhaseChange(index, parseInt(e.target.value))
                    }
                    disabled={!phasor.show}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}

            {/* Sum Vector Toggle */}
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: showSum ? "#e8f5e9" : "#f5f5f5",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "bold",
                  color: "#4CAF50",
                }}
              >
                <input
                  type="checkbox"
                  checked={showSum}
                  onChange={() => setShowSum(!showSum)}
                />
                Sum Vector
              </label>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ZeigerPage;
