import * as React from "react";
import { CSSProperties } from "react";
import WeekMaterial from "../components/WeekMaterial";
import Layout from "../components/Layout";
import { FaMapMarkerAlt, FaClock, FaBolt } from "react-icons/fa";
import { Link } from "gatsby";

const pageStyles: CSSProperties = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const infoBoxStyles: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "30px",
  padding: "20px",
  margin: "20px 0",
  borderRadius: "12px",
  background: "#3a3f58",
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
};

const iconStyle: CSSProperties = {
  fontSize: "2rem",
};

const textStyle: CSSProperties = {
  padding: "20px",
};

const buttonContainerStyles: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  margin: "40px 0",
};

const buttonStyles: CSSProperties = {
  padding: "15px 25px",
  background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
  color: "white",
  borderRadius: "30px",
  textDecoration: "none",
  fontSize: "1.2rem",
  fontWeight: "bold",
  boxShadow: "0 5px 15px rgba(34, 34, 34, 0.5)",
  transition: "all 0.3s ease-in-out",
};

// Enhanced zeiger button style
const zeigerButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 20px",
  backgroundImage: "linear-gradient(135deg, #833ab4, #fd1d1d)",
  color: "white",
  borderRadius: "8px", // Match other buttons radius
  textDecoration: "none",
  fontWeight: "bold",
  boxShadow: "0 4px 15px rgba(131, 58, 180, 0.3)",
  transition: "all 0.3s ease, transform 0.2s ease",
  border: "none",
  fontSize: "0.95rem", // Match other buttons font size
  position: "relative",
  overflow: "hidden",
};

// Add placeholder weeks to ensure consistent appearance
const weeks = [
  {
    week: "Week 1",
    materialLink: "/~obaumgartner/NuS2_FS25/Übung01_Leer.pdf",
    zusatzLink: "/~obaumgartner/NuS2_FS25/Übung01_Lsg.pdf",
  },
  {
    week: "Week 2",
    materialLink: "/~obaumgartner/NuS2_FS25/Übung02_Leer.pdf",
    zusatzLink: "/~obaumgartner/NuS2_FS25/Übung02_Lsg.pdf",
    extraContent: (
      <Link to="/zeiger" style={zeigerButtonStyle}>
        <FaBolt /> Zeigersimulation
      </Link>
    ),
  },
  // {
  //   week: "Week 3",
  //   materialLink: "#", // Placeholder
  //   zusatzLink: "#", // Placeholder
  // },
  // {
  //   week: "Week 4",
  //   materialLink: "#", // Placeholder
  //   zusatzLink: "#", // Placeholder
  // },
  // {
  //   week: "Week 5",
  //   materialLink: "#", // Placeholder
  //   zusatzLink: "#", // Placeholder
  // },
  // ...remaining weeks...
];

const SubjectPage: React.FC = () => {
  return (
    <Layout>
      <div style={buttonContainerStyles}>
        <a
          href="https://polybox.ethz.ch/index.php/s/cpO2Ul9JOkaln0G"
          target="_blank"
          style={{
            ...buttonStyles,
            background: "linear-gradient(135deg, #36D1DC, #5B86E5)",
          }}
        >
          Polybox
        </a>
      </div>
      <div style={infoBoxStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaMapMarkerAlt style={iconStyle} />
          <span>Ort: HG D5.1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaClock style={iconStyle} />
          <span>Zeit: Freitag 10:15-12:00</span>
        </div>
      </div>
      <h1 style={textStyle}>Netzwerk und Schaltungen 2</h1>

      {/* Container for weeks with consistent styling */}
      <div
        style={{
          padding: "10px 30px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "25px",
          margin: "0 auto",
        }}
      >
        {weeks.map((weekData, index) => (
          <WeekMaterial
            key={index}
            week={weekData.week}
            materialLink={weekData.materialLink}
            zusatzLink={weekData.zusatzLink}
            extraContent={weekData.extraContent}
          />
        ))}
      </div>
    </Layout>
  );
};

export default SubjectPage;
