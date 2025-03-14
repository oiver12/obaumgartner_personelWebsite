import { Github, Mail } from "lucide-react";
import React from "react";
import "../styles/footer.css";

const FooterSection: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-copyright">© 2025 Oliver Baumgartner</div>

        <div className="footer-links">
          <a
            href="mailto:obaumgartner@ethz.ch"
            className="footer-icon-link"
            title="Email me"
          >
            <Mail className="footer-icon" />
          </a>

          <a
            href="https://github.com/oiver12/obaumgartner_personelWebsite"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon-link"
            title="Visit my GitHub"
          >
            <Github className="footer-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
