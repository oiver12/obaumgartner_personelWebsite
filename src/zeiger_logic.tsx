// Draw the phasor diagram background with axes and circle
const drawPhasorBackground = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
) => {
  ctx.save();

  // Draw outer circle
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(centerX - radius - 20, centerY);
  ctx.lineTo(centerX + radius + 20, centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius - 20);
  ctx.lineTo(centerX, centerY + radius + 20);
  ctx.stroke();

  // Draw scale markers
  ctx.fillStyle = "#666";
  ctx.font = "12px Arial";
  ctx.fillText("100V", centerX + radius + 5, centerY + 15);

  // Draw small markers at 30° intervals
  for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
    const markerX = centerX + radius * Math.cos(angle);
    const markerY = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(markerX, markerY, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#999";
    ctx.fill();
  }

  ctx.restore();
};

// Draw a phasor
const drawPhasor = (
  ctx: CanvasRenderingContext2D,
  angle: number,
  amplitude: number,
  color: string,
  name: string,
  centerX: number,
  centerY: number,
  maxRadius: number
) => {
  // Scale the amplitude to fit within our circle
  const scaledAmplitude = (amplitude / 100) * maxRadius;

  const x = scaledAmplitude * Math.cos(angle);
  const y = scaledAmplitude * Math.sin(angle);

  ctx.save();

  // Draw the line
  ctx.strokeStyle = color;
  ctx.lineWidth = name === "Sum" ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY - y); // Canvas Y is inverted
  ctx.stroke();

  // Draw an arrowhead
  const headLength = 10;
  const arrowAngle = 0.3; // Angle of the arrowhead

  ctx.beginPath();
  ctx.moveTo(centerX + x, centerY - y);
  ctx.lineTo(
    centerX + x - headLength * Math.cos(angle - arrowAngle),
    centerY - y + headLength * Math.sin(angle - arrowAngle)
  );
  ctx.lineTo(
    centerX + x - headLength * Math.cos(angle + arrowAngle),
    centerY - y + headLength * Math.sin(angle + arrowAngle)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Draw the name label
  ctx.font = "14px Arial";
  ctx.fillText(name, centerX + x * 1.1, centerY - y * 1.1);

  // If it's not the sum, draw the amplitude value
  if (name !== "Sum") {
    ctx.font = "12px Arial";
    ctx.fillText(`${amplitude}V`, centerX + x * 1.1, centerY - y * 1.1 + 16);
  } else if (amplitude > 0) {
    // For sum, just display the amplitude
    ctx.font = "12px Arial";
    ctx.fillText(
      `${Math.round(amplitude)}V`,
      centerX + x * 1.1,
      centerY - y * 1.1 + 16
    );
  }

  ctx.restore();
};

// Draw a vertical projection straight down to show real component
function drawVerticalProjection(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  xComponent: number,
  color: string
) {
  ctx.save();

  // Draw dotted vertical line from phasor tip to x-axis
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX + xComponent, centerY);
  ctx.lineTo(centerX + xComponent, centerY + 15);
  ctx.stroke();

  // Draw dot at the projection point
  ctx.beginPath();
  ctx.arc(centerX + xComponent, centerY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

// Display a text label for the real value
function drawRealValueLabel(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  value: number,
  name: string,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${name}: ${Math.round(value)}V (Real)`, centerX, y);
  ctx.restore();
}

// Draw the horizontal time domain graph (static)
function drawTimeDomainGraph(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  centerY: number,
  height: number
) {
  ctx.save();

  // Draw containing box
  ctx.fillStyle = "#f9f9f9";
  ctx.fillRect(
    startX - 10,
    centerY - height / 2 - 10,
    endX - startX + 20,
    height + 20
  );
  ctx.strokeStyle = "#ddd";
  ctx.strokeRect(
    startX - 10,
    centerY - height / 2 - 10,
    endX - startX + 20,
    height + 20
  );

  // Draw center horizontal axis
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX - 10, centerY);
  ctx.lineTo(endX + 10, centerY);
  ctx.stroke();

  // Draw vertical markings for time intervals
  for (let i = 0; i <= 10; i++) {
    const x = startX + ((endX - startX) / 10) * i;

    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(x, centerY - height / 2);
    ctx.lineTo(x, centerY + height / 2);
    ctx.stroke();

    // Add π labels for key points
    if (i % 2 === 0) {
      ctx.fillStyle = "#666";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      let label = "";

      switch (i) {
        case 0:
          label = "0";
          break;
        case 2:
          label = "π/2";
          break;
        case 4:
          label = "π";
          break;
        case 6:
          label = "3π/2";
          break;
        case 8:
          label = "2π";
          break;
        case 10:
          label = "5π/2";
          break;
        default:
          label = `${i}π/4`;
      }

      ctx.fillText(label, x, centerY + height / 2 + 15);
    }
  }

  // Add amplitude labels
  ctx.textAlign = "right";
  ctx.fillStyle = "#666";
  ctx.fillText("100V", startX - 15, centerY - height / 2 + 5);
  ctx.fillText("0V", startX - 15, centerY + 5);
  ctx.fillText("-100V", startX - 15, centerY + height / 2 + 5);

  // Graph title
  ctx.textAlign = "center";
  ctx.font = "14px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(
    "Time Domain Representation",
    (startX + endX) / 2,
    centerY - height / 2 - 20
  );

  ctx.restore();
}

// Draw a sinusoid on the time domain graph
function drawSinusoid(
  ctx: CanvasRenderingContext2D,
  amplitude: number,
  phase: number,
  color: string,
  startX: number,
  endX: number,
  centerY: number,
  height: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  const graphWidth = endX - startX;

  for (let i = 0; i <= 100; i++) {
    // Map i to angle from 0 to 2.5π (to show a bit more than one period)
    const angle = (i / 100) * 2.5 * Math.PI;

    // Calculate position
    const x = startX + (angle / (2.5 * Math.PI)) * graphWidth;
    const value = amplitude * Math.cos(angle + phase);
    const y = centerY - (value / 100) * (height / 2);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

// Draw a point on the sinusoid at the current animation time
function drawTimePoint(
  ctx: CanvasRenderingContext2D,
  currentAngle: number,
  amplitude: number,
  phase: number,
  color: string,
  startX: number,
  endX: number,
  centerY: number,
  height: number
) {
  ctx.save();

  // Map the current angle to a position on graph
  // We need to take the modulo to ensure we stay within the graph's range
  const displayAngle = currentAngle % (2.5 * Math.PI);
  const graphWidth = endX - startX;

  const x = startX + (displayAngle / (2.5 * Math.PI)) * graphWidth;
  const value = amplitude * Math.cos(displayAngle + phase);
  const y = centerY - (value / 100) * (height / 2);

  // Draw the point
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Draw a vertical line down to the time axis
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, centerY + height / 2 + 5);
  ctx.stroke();

  ctx.restore();
}
export {
  drawPhasorBackground,
  drawPhasor,
  drawVerticalProjection,
  drawRealValueLabel,
  drawTimeDomainGraph,
  drawSinusoid,
  drawTimePoint,
};
