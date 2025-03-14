import { useLocation } from "@reach/router";
import { Link, navigate } from "gatsby";
import React from "react";

const navbarStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 20px",
  backgroundColor: "#2c3e50",
  color: "white",
  width: "100%",
  margin: 0,
};

const navLinksStyles = {
  display: "flex",
  gap: "15px",
};

const linkStyles = {
  color: "white",
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "bold",
  padding: "5px 10px",
  transition: "0.2s",
};

const buttonStyles = {
  backgroundColor: "transparent",
  border: "none",
  color: "white",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  padding: "5px 10px",
};

const Navbar = () => {
  const location = useLocation();
  return (
    <nav style={navbarStyles}>
      {location.pathname !== "/" && (
        <button
          style={buttonStyles}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      <div style={navLinksStyles}>
        <Link to="/" style={linkStyles}>
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
