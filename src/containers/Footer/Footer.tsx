import resumePDF from "../../assets/pdf/Caleb_Taylor_Resume.pdf";
import {
  iconGithubJSX,
  iconLinkedinJSX,
  iconStackOverflowJSX,
} from "../../components/font-awesome/icons";
import S_Link from "../../components/S_Link/S_Link";

const Footer = () => {
  return (
    <footer className="pfooter">
      <div className="pfooter-contact">
        <div className="pfooter-contact-item">
          <S_Link>
            <a
              aria-label="Download PDF Resume"
              title="Download PDF Resume"
              href={resumePDF}
              download="Caleb_Taylor_Resume.pdf"
            >
              Download my Resume
            </a>
          </S_Link>
        </div>
      </div>
      <div className="pfooter-social">
        <div className="pfooter-social-item">
          <a
            className="pfooter-social-item-link"
            // aria-label="Github"
            title="Github"
            href="https://github.com/aquaductape"
            target="_blank"
            // innerHTML={iconGithubJSX}
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
            target="_blank"
            // innerHTML={iconLinkedinJSX}
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
            target="_blank"
            // innerHTML={iconStackOverflowJSX}
          >
            {iconStackOverflowJSX()}
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
