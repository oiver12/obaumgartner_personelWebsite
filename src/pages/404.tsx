import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import NotFoundImage from "../images/404_meme.jpg";

const pageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  textAlign: "center",
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  padding: "10px",
  fontSize: "2rem",
};

const imageStyles = {
  maxWidth: "100%",
  height: "auto",
  marginBottom: "48px",
};

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <h1 style={headingStyles}>404 site not found</h1>
      <img src={NotFoundImage} alt="404 Meme" style={imageStyles} />
      <p>
        <Link to="/">Zurück zur Startseite</Link>
      </p>
    </Layout>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Seite nicht gefunden</title>;
