import React, { CSSProperties, useState } from "react";
import { FaFilePdf } from "react-icons/fa";

interface WeekMaterialProps {
  week: string;
  materialLink: string;
  zusatzLink?: string;
  extraContent?: React.ReactNode;
}

// Updated sexy box design with solid color
const containerStyle: CSSProperties = {
  marginBottom: "25px",
  padding: "22px 25px",
  borderRadius: "12px",
  backgroundColor: "#f8f9ff", // Clean light blue-ish color
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(230, 236, 255, 0.9)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  minHeight: "120px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const containerHoverStyle: CSSProperties = {
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
  transform: "translateY(-4px)",
  backgroundColor: "#f1f4ff", // Slightly darker shade when hovered
};

const weekStyle: CSSProperties = {
  fontSize: "1.6rem",
  marginBottom: "16px",
  fontWeight: "600",
  color: "#333",
  position: "relative",
  paddingBottom: "12px",
  borderBottom: "2px solid rgba(73, 94, 229, 0.15)", // Subtle colored border
};

// Dot decoration instead of gradient
const dotDecoration: CSSProperties = {
  position: "absolute",
  top: "15px",
  right: "15px",
  height: "12px",
  width: "12px",
  borderRadius: "50%",
  backgroundColor: "rgba(73, 94, 229, 0.3)", // Matching accent color
};

const buttonContainerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  zIndex: 2,
  position: "relative",
};

// Updated button style to match the new box color
const buttonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 16px",
  backgroundColor: "#ffffff", // White button on blue-ish background
  color: "#333",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: "500",
  transition: "all 0.2s",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
};

const buttonHoverStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  transform: "translateY(-2px)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const WeekMaterial: React.FC<WeekMaterialProps> = ({
  week,
  materialLink,
  zusatzLink,
  extraContent,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div
      style={{
        ...containerStyle,
        ...(isHovered ? containerHoverStyle : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={dotDecoration} />

      <div style={weekStyle}>{week}</div>

      <div style={{ ...buttonContainerStyle }}>
        <a
          href={materialLink}
          style={{
            ...buttonStyle,
            ...(hoveredButton === "material" ? buttonHoverStyle : {}),
          }}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredButton("material")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <FaFilePdf /> Übungsblatt
        </a>

        {zusatzLink && (
          <a
            href={zusatzLink}
            style={{
              ...buttonStyle,
              ...(hoveredButton === "zusatz" ? buttonHoverStyle : {}),
            }}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredButton("zusatz")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <FaFilePdf /> Lösungen
          </a>
        )}

        {extraContent}
      </div>
    </div>
  );
};

export default WeekMaterial;
