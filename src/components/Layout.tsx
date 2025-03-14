import FooterSection from "./Footer";
import Navbar from "./Navbar";
// Fix the import path
import React, { ReactNode } from "react";

const layoutStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  margin: 0,
  padding: 0,
};

const pageStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
  fontFamily: "'Inter', sans-serif",
  color: "#333",
  margin: 0,
  padding: 0,
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={layoutStyles}>
      <Navbar />
      <main style={pageStyles}>{children}</main>
      <FooterSection />
    </div>
  );
};

export default Layout;
