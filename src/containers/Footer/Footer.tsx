import resumePDF from "../../assets/pdf/Caleb_Taylor_Resume.pdf";
import {
  iconGithubJSX,
  iconLinkedinJSX,
  iconStackOverflowJSX,
} from "../../components/font-awesome/icons";

const Footer = () => {
  return (
    <footer className="pfooter">
      <div className="pfooter-contact">
        <div className="pfooter-contact-item pfooter-email">
          <a href="mailto:caleb1taylor2@gmail.com">caleb1taylor2@gmail.com</a>
        </div>
        <div className="pfooter-contact-item">
          <a
            aria-label="Download PDF Resume"
            title="Download PDF Resume"
            href={resumePDF}
            download="Caleb_Taylor_Resume.pdf"
          >
            Download my Resume
          </a>
        </div>
      </div>
      <div className="pfooter-social">
        <div className="pfooter-social-item">
          <a
            className="pfooter-social-item-link"
            // aria-label="Github"
            title="Github"
            href="https://github.com/aquaductape"
            target="blank"
            // innerHTML={iconGithub}
          >
            {iconGithubJSX()}
          </a>
        </div>
        <div className="pfooter-social-item">
          <a
            className="pfooter-social-item-link"
            // aria-label="LinkedIn"
            title="LinkedIn"
            href="https://www.linkedin.com/in/caleb1taylor2/"
            target="blank"
            // innerHTML={iconLinkedin}
          >
            {iconLinkedinJSX()}
          </a>
        </div>
        <div className="pfooter-social-item">
          <a
            className="pfooter-social-item-link"
            // aria-label="Stack Overflow"
            title="Stack Overflow"
            href="https://stackoverflow.com/users/8234457/caleb-taylor"
            target="blank"
            // innerHTML={iconStackOverflow}
          >
            {iconStackOverflowJSX()}
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
