import React, { useRef, useEffect, useState } from "react";

const SketchWrapper: React.FC<{ sketch: (p: any) => void }> = ({ sketch }) => {
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const [p5, setP5] = useState<any>(null);

  // Dynamically import the p5 library (only on the client side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("p5").then((p5Module) => {
        setP5(() => p5Module.default);
      });
    }
  }, []);

  // Instantiate the p5 sketch once p5 is loaded and the ref is set
  useEffect(() => {
    if (p5 && sketchRef.current) {
      new p5(sketch, sketchRef.current);
    }
  }, [p5, sketch]);

  return <div ref={sketchRef} />;
};

export default SketchWrapper;
