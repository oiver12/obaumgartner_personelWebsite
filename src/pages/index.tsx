import sketch from "../components/FourierName";
import Layout from "../components/Layout";
import SketchWrapper from "../components/sketchWrapper";
import mainPicture from "../images/background.jpg";
import { Link } from "gatsby";
import * as React from "react";

const bannerStyles: React.CSSProperties = {
  width: "100%",
  height: "40vh",
  objectFit: "cover",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  margin: "0",
  borderRadius: "10px",
};

const headerStyles: React.CSSProperties = {
  fontSize: "clamp(2rem, 5vw, 4rem)",
  marginBottom: "20px",
  color: "#2c3e50",
  textAlign: "center",
  padding: "20px",
  fontWeight: "bold",
  textTransform: "uppercase",
};

const descriptionStyles: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "40px",
  textAlign: "center",
  maxWidth: "800px",
  padding: "20px",
  color: "#444",
  lineHeight: "1.6",
};

const lessonContainerStyles: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "30px",
  width: "100%",
};

const boxStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "300px",
  height: "180px",
  padding: "20px",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
  textDecoration: "none",
  color: "#333",
  fontSize: "1.8rem",
  fontWeight: "bold",
  textAlign: "center",
};

const boxHoverStyles: React.CSSProperties = {
  transform: "scale(1.1)",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
};

const lessons = [
  { title: "NuS I HS24", link: "/nus1-hs24" },
  { title: "NuS II FS25", link: "/nus2-fs25" },
];

const contactStyles: React.CSSProperties = {
  marginTop: "50px",
  padding: "30px",
  textAlign: "center",
  fontSize: "1.3rem",
  color: "#2c3e50",
  backgroundColor: "#f7f9fc",
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <style>
        {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
      </style>
      <img src={mainPicture} alt="Banner" style={bannerStyles} />
      <h1 style={headerStyles}>Übungsstunde ETH Zürich</h1>
      <SketchWrapper sketch={sketch} />
      <p style={descriptionStyles}>
        Willkommen auf meiner persönlichen Seite. Hier findest du alle
        Materialien für die Übungsstunden von mir.
      </p>
      <div style={lessonContainerStyles}>
        {lessons.map((lesson, index) => (
          <Link
            key={index}
            to={lesson.link}
            style={boxStyles}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, boxHoverStyles);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            {lesson.title}
          </Link>
        ))}
      </div>
      <div style={contactStyles}>
        <p>Ihr könnt mich immer bei Fragen gerne kontaktieren unter:</p>
        <p>
          <a
            href="mailto:obaumgartner@ethz.ch"
            style={{
              color: "#1a73e8",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            obaumgartner@ethz.ch
          </a>
        </p>
      </div>
      {/* add vertical spacer */}
      <div style={{ height: "50px" }}></div>
    </Layout>
  );
};

export default IndexPage;
