import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
// Assume you have a complex multiplication helper like this:
export const complexMult = (
  a: p5Types.Vector,
  b: p5Types.Vector
): p5Types.Vector => {
  // (a.real, a.imag) * (b.real, b.imag) = (a.real*b.real - a.imag*b.imag, a.real*b.imag + a.imag*b.real)
  return a.copy().set(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
};

// Dummy Fourier coefficients as used in your TypeScript code.
// The structure is:
//   positive: coefficients for k = 1, 2, … (e.g., positive[0] corresponds to k = 1)
//   negative: coefficients for k = -1, -2, … (e.g., negative[0] corresponds to k = -1)
//   zero: coefficient for k = 0.
const dummyCoefficients = {
  positive: [
    { x: -20.8309, y: 25.3019 },
    { x: -0.2778, y: -0.3737 },
    { x: -1.594, y: -1.2298 },
    { x: -5.9919, y: 1.7959 },
    { x: -0.4445, y: 3.8446 },
    { x: 1.4656, y: 2.3848 },
    { x: -0.0703, y: -0.5096 },
    { x: -1.0343, y: 0.6342 },
    { x: 0.7821, y: 1.8973 },
    { x: 0.1897, y: -0.3962 },
    { x: -1.0374, y: 0.4018 },
    { x: -0.4765, y: 1.3835 },
    { x: 0.7722, y: 0.8422 },
    { x: 0.1492, y: -0.1094 },
    { x: -0.8376, y: 1.0008 },
    { x: 1.0158, y: 1.1544 },
    { x: 0.2514, y: 0.1703 },
    { x: -0.4657, y: 0.3374 },
    { x: -0.0461, y: 0.9675 },
    { x: 1.3501, y: 0.6841 },
    { x: 0.3624, y: -0.3693 },
    { x: -0.2612, y: 1.0163 },
    { x: 0.162, y: 0.8145 },
    { x: 0.6048, y: 0.0749 },
    { x: -0.1078, y: 0.0291 },
    { x: 0.285, y: 1.1594 },
    { x: 0.8939, y: 0.2321 },
    { x: 0.1137, y: -0.1535 },
    { x: -0.4399, y: 0.486 },
    { x: 0.1783, y: 0.5973 },
    { x: 0.9758, y: -0.0609 },
    { x: -0.3201, y: 0.0626 },
    { x: -0.6974, y: 0.5217 },
    { x: 0.0088, y: 0.1897 },
    { x: 0.0795, y: 0.0315 },
    { x: -0.6248, y: -0.5462 },
    { x: -0.3748, y: 1.0306 },
    { x: -0.0773, y: 0.155 },
    { x: -0.0075, y: -0.4093 },
    { x: -0.7168, y: -0.3762 },
    { x: 0.2179, y: 0.9825 },
    { x: -0.0318, y: 0.3163 },
    { x: 0.092, y: 0.1795 },
    { x: -0.2854, y: 0.7243 },
    { x: -0.1914, y: 0.2148 },
    { x: 0.298, y: 0.28 },
    { x: 0.2795, y: 0.1705 },
    { x: 0.8325, y: 0.6729 },
    { x: -0.2085, y: 0.1758 },
    { x: 0.0946, y: 0.3975 },
    { x: -0.1105, y: -0.2913 },
    { x: -0.0767, y: 0.3457 },
    { x: -0.5176, y: 0.5178 },
    { x: -0.2593, y: 0.4222 },
    { x: -0.2344, y: 0.123 },
    { x: -0.0268, y: 0.2022 },
    { x: -0.3765, y: -0.2475 },
    { x: -0.4675, y: -0.5061 },
    { x: -0.2038, y: 0.5466 },
    { x: 0.4878, y: 0.0364 },
    { x: 0.2859, y: 0.393 },
    { x: 0.3811, y: 0.3988 },
    { x: -0.4156, y: -0.1568 },
    { x: -0.0192, y: 0.1463 },
    { x: -0.5087, y: 0.1671 },
    { x: -0.0633, y: 0.2802 },
    { x: 0.2065, y: 0.0666 },
    { x: -0.5361, y: -0.1512 },
    { x: -0.1226, y: 0.3112 },
    { x: 0.4654, y: 0.3477 },
    { x: -0.0222, y: 0.2872 },
    { x: 0.2175, y: 0.2646 },
    { x: 0.091, y: -0.0621 },
    { x: -0.0613, y: 0.0828 },
    { x: 0.1931, y: 0.1913 },
    { x: -0.0619, y: 0.2698 },
    { x: -0.0132, y: -0.245 },
    { x: 0.0182, y: -0.0297 },
    { x: -0.1896, y: 0.4172 },
    { x: -0.084, y: 0.0429 },
    { x: -0.1516, y: 0.0825 },
    { x: -0.2441, y: -0.1662 },
    { x: -0.1824, y: 0.4417 },
    { x: 0.1078, y: 0.0926 },
    { x: 0.0705, y: 0.1171 },
    { x: 0.1119, y: 0.2353 },
    { x: -0.0554, y: 0.3589 },
    { x: -0.1083, y: -0.0601 },
    { x: -0.0512, y: 0.1372 },
    { x: -0.029, y: 0.1967 },
    { x: -0.1217, y: 0.2637 },
    { x: -0.0069, y: 0.132 },
    { x: 0.0583, y: 0.0714 },
    { x: -0.0412, y: 0.1638 },
    { x: 0.0147, y: -0.0616 },
    { x: -0.0623, y: 0.071 },
    { x: -0.0558, y: 0.1352 },
    { x: -0.0406, y: 0.0577 },
    { x: -0.0744, y: 0.0935 },
    { x: 0.009, y: 0.0364 },
    { x: 0.1106, y: -0.0459 },
    { x: -0.1316, y: 0.1697 },
    { x: -0.1952, y: 0.1584 },
    { x: -0.0623, y: 0.1952 },
    { x: 0.0156, y: 0.0417 },
    { x: 0.1159, y: 0.0961 },
    { x: -0.0814, y: 0.2111 },
    { x: -0.0255, y: 0.0558 },
    { x: -0.0919, y: -0.0014 },
    { x: -0.0532, y: 0.0294 },
    { x: -0.0516, y: 0.199 },
    { x: 0.0613, y: -0.0629 },
    { x: -0.1666, y: 0.0821 },
    { x: -0.1408, y: 0.0948 },
    { x: -0.0677, y: 0.1413 },
    { x: 0.0439, y: 0.0292 },
    { x: 0.0234, y: 0.0515 },
    { x: 0.0366, y: 0.0882 },
    { x: 0.1271, y: 0.08 },
    { x: 0.0063, y: -0.0174 },
    { x: -0.0211, y: 0.0488 },
    { x: -0.0767, y: 0.0429 },
    { x: 0.069, y: 0.0378 },
    { x: -0.0343, y: 0.0915 },
    { x: -0.0459, y: 0.1553 },
    { x: 0.0196, y: 0.055 },
    { x: -0.0519, y: 0.0433 },
    { x: -0.0994, y: 0.1127 },
  ],
  negative: [
    { x: -20.7221, y: -25.2032 },
    { x: 0.5675, y: 0.6934 },
    { x: -1.9608, y: 0.2852 },
    { x: -5.268, y: -3.123 },
    { x: -1.0323, y: -3.4826 },
    { x: 1.8211, y: -2.1539 },
    { x: -0.1456, y: -0.6064 },
    { x: -0.3375, y: -1.0938 },
    { x: -0.2773, y: -1.9208 },
    { x: 0.0749, y: -0.258 },
    { x: -0.8772, y: -0.3836 },
    { x: -0.4828, y: -1.479 },
    { x: 0.4111, y: -0.8084 },
    { x: 0.1036, y: -0.3986 },
    { x: -1.0837, y: -0.7436 },
    { x: -0.4992, y: -1.1996 },
    { x: 0.2931, y: -0.2425 },
    { x: -0.6075, y: 0.0117 },
    { x: -0.4868, y: -0.8361 },
    { x: -0.1701, y: -1.5069 },
    { x: 0.0841, y: -0.4805 },
    { x: -1.0682, y: -0.1274 },
    { x: 0.021, y: -1.0607 },
    { x: 0.0887, y: -0.482 },
    { x: -0.3213, y: -0.1567 },
    { x: -1.0977, y: -0.5411 },
    { x: -0.02, y: -1.1359 },
    { x: -0.0468, y: -0.3708 },
    { x: -0.5448, y: -0.1462 },
    { x: 0.0627, y: -0.7268 },
    { x: -0.0479, y: -0.9866 },
    { x: -0.0856, y: 0.0243 },
    { x: -0.0376, y: -0.4178 },
    { x: 0.6048, y: 0.0521 },
    { x: 0.3996, y: -0.3006 },
    { x: 0.2744, y: -0.8049 },
    { x: 0.2078, y: -0.1833 },
    { x: 0.6849, y: 0.1386 },
    { x: 0.3177, y: -0.4327 },
    { x: 0.9686, y: -0.5744 },
    { x: 0.1736, y: 0.0604 },
    { x: 0.7037, y: 0.2295 },
    { x: -0.3529, y: -0.2961 },
    { x: 0.0737, y: -0.1825 },
    { x: 1.0241, y: 0.3882 },
    { x: -0.0043, y: -0.0995 },
    { x: -0.7451, y: -0.738 },
    { x: -0.6095, y: -0.4898 },
    { x: 0.4728, y: 0.3459 },
    { x: -0.2415, y: 0.0098 },
    { x: 0.3327, y: -0.4576 },
    { x: -0.0651, y: 0.3132 },
    { x: -0.0488, y: 0.2573 },
    { x: -0.2284, y: -0.1414 },
    { x: 0.3856, y: -0.0614 },
    { x: 0.0114, y: 0.1312 },
    { x: 0.4152, y: -0.2819 },
    { x: 0.8912, y: -0.3168 },
    { x: 0.1455, y: 0.4696 },
    { x: -0.1298, y: -0.047 },
    { x: -0.3449, y: 0.4829 },
    { x: -0.7081, y: 0.1391 },
    { x: 0.7148, y: 0.0278 },
    { x: -0.0256, y: -0.1034 },
    { x: 0.5588, y: -0.1663 },
    { x: 0.6397, y: -0.1883 },
    { x: 0.0656, y: 0.1252 },
    { x: 0.436, y: -0.5044 },
    { x: 0.357, y: -0.0279 },
    { x: -0.235, y: 0.5272 },
    { x: 0.0221, y: 0.1723 },
    { x: -0.2918, y: -0.2125 },
    { x: 0.2395, y: -0.2446 },
    { x: 0.1989, y: -0.0834 },
    { x: -0.3606, y: -0.2808 },
    { x: 0.0406, y: -0.3839 },
    { x: 0.3798, y: -0.3459 },
    { x: -0.1702, y: 0.0414 },
    { x: 0.5769, y: 0.1614 },
    { x: 0.2095, y: -0.1583 },
    { x: 0.3694, y: -0.1612 },
    { x: -0.1458, y: -0.5362 },
    { x: 0.3946, y: -0.0056 },
    { x: 0.0412, y: 0.0044 },
    { x: 0.0017, y: -0.041 },
    { x: -0.0697, y: -0.0408 },
    { x: 0.1101, y: -0.0255 },
    { x: 0.0517, y: 0.0146 },
    { x: -0.1205, y: -0.18 },
    { x: 0.1935, y: -0.0495 },
    { x: 0.1642, y: 0.071 },
    { x: -0.04, y: -0.0969 },
    { x: -0.2266, y: -0.1685 },
    { x: 0.185, y: 0.103 },
    { x: -0.1134, y: 0.0001 },
    { x: -0.0458, y: -0.1518 },
    { x: -0.0347, y: -0.1263 },
    { x: 0.1222, y: -0.0362 },
    { x: -0.0069, y: -0.0101 },
    { x: 0.0024, y: -0.0291 },
    { x: 0.0419, y: -0.0751 },
    { x: 0.0364, y: 0.1044 },
    { x: -0.0171, y: -0.1805 },
    { x: 0.1087, y: -0.0481 },
    { x: 0.1742, y: 0.0353 },
    { x: -0.1539, y: 0.0715 },
    { x: 0.1527, y: -0.1222 },
    { x: 0.1973, y: -0.1834 },
    { x: -0.0234, y: -0.0968 },
    { x: -0.0542, y: -0.0263 },
    { x: 0.188, y: -0.1295 },
    { x: -0.0103, y: -0.0805 },
    { x: 0.0734, y: -0.0659 },
    { x: 0.0621, y: -0.1981 },
    { x: 0.2117, y: 0.0268 },
    { x: 0.0616, y: 0.0439 },
    { x: -0.0936, y: -0.0037 },
    { x: 0.0998, y: -0.0566 },
    { x: 0.0451, y: 0.0417 },
    { x: -0.0137, y: -0.0781 },
    { x: 0.0186, y: -0.047 },
    { x: 0.0926, y: -0.1337 },
    { x: 0.0763, y: 0.0734 },
    { x: -0.0618, y: -0.126 },
    { x: 0.0859, y: -0.1664 },
    { x: 0.106, y: -0.0388 },
    { x: 0.0023, y: -0.1011 },
    { x: 0.0428, y: -0.1618 },
  ],
  zero: { x: 111.1256, y: 17.9988 },
};

// const dummyCoefficients = {
//   positive: [
//     { x: 30, y: 0 }, // k = 1
//     { x: 20, y: 10 }, // k = 2
//     { x: 15, y: -10 }, // k = 3
//   ],
//   negative: [
//     { x: -25, y: -5 }, // k = -1
//     { x: -18, y: 8 }, // k = -2
//     { x: -12, y: -6 }, // k = -3
//   ],
//   zero: { x: 0, y: 0 }, // k = 0
// };

export default function sketch(p: p5Types) {
  // Time variable for animation and trace storage
  let time = 0;
  let dt = 0;
  let tracePoints: p5Types.Vector[] = [];

  p.preload = () => {};
  p.setup = () => {
    const canvasWidth = Math.min(p.windowWidth * 0.8, 1920 * 0.6);
    p.createCanvas(canvasWidth, p.windowHeight / 3);
    p.background(240);
    dt = p.TWO_PI / 300; // Adjust the rotation speed as needed
  };

  p.draw = () => {
    p.background(240);
    const complexScale = Math.min(p.width, p.height) / 90; // Adjust scale based on canvas size
    // Translate origin to center of canvas
    const xShiftPercent = -35; // shift circles to the left by 50% of the canvas width
    const yShiftPercent = 0; // adjust vertical position for larger text
    const xShift = (xShiftPercent / 100) * p.width;
    const yShift = (yShiftPercent / 100) * p.height;
    p.translate(p.width / 2 + xShift, p.height / 2 + yShift);
    // Draw epicycles based on the dummy coefficients.
    // The idea: start at (0,0) and, for each coefficient,
    // rotate it by (time * k) and add it to the current position.
    p.stroke(0);
    p.strokeWeight(1);
    let currentPos = p.createVector(0, 0);

    // Helper function that "applies" one Fourier coefficient.
    // 'coef' is a p5.Vector representing the coefficient,
    // 'n' is the frequency (for k=0, n=0; for positive, n > 0; for negative, n < 0)
    const handleArrow = (coef: p5Types.Vector, n: number) => {
      // Create a unit vector (representing phase 0) and rotate it.
      let rot = p.createVector(1, 0);
      rot.rotate(time * n);
      // Multiply coefficient (as a complex number) with the rotation.
      // This simulates the time evolution of the epicycle.
      let v = complexMult(coef, rot);

      // Scale the complex number
      v.mult(complexScale);

      // Draw the epicycle circle (with radius = |v|)
      p.noFill();
      p.stroke(150, 150); // Set stroke with alpha for opacity
      const circleScale = 1; // scale factor for circle magnitudes
      const scaledRadius = v.mag() * circleScale;
      p.ellipse(currentPos.x, currentPos.y, scaledRadius * 2);
      // Draw a line from current position to the new endpoint.
      p.stroke(0);
      p.line(
        currentPos.x,
        currentPos.y,
        currentPos.x + v.x,
        currentPos.y + v.y
      );
      // Update the current position.
      currentPos.add(v);
    };

    // First, handle the DC (zero) component.
    handleArrow(
      p.createVector(dummyCoefficients.zero.x, dummyCoefficients.zero.y),
      0
    );

    // Then, handle the positive and negative frequency components.
    // For each index, positive[0] corresponds to k=1 and negative[0] to k=-1.
    for (let i = 0; i < dummyCoefficients.positive.length; i++) {
      handleArrow(
        p.createVector(
          dummyCoefficients.positive[i].x,
          dummyCoefficients.positive[i].y
        ),
        i + 1
      );
      handleArrow(
        p.createVector(
          dummyCoefficients.negative[i].x,
          dummyCoefficients.negative[i].y
        ),
        -(i + 1)
      );
    }

    // Draw the endpoint of the epicycles (the "traced" point)
    p.fill(255, 27, 27);
    p.noStroke();
    p.circle(currentPos.x, currentPos.y, 5);
    // Save the endpoint to trace its path.
    tracePoints.unshift(currentPos.copy());

    // Draw the trace path.
    p.stroke(255, 27, 27);
    p.noFill();
    p.beginShape();
    for (let pt of tracePoints) {
      p.vertex(pt.x, pt.y);
    }
    p.endShape();

    // Increase the number of trace points stored
    if (tracePoints.length > 500) {
      // Increase this number to store more points
      tracePoints.pop();
    }

    time += dt;
    if (time > p.TWO_PI) {
      time = 0;
      tracePoints = [];
    }
  };
}
