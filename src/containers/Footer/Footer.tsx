import resumePDF from "../../assets/pdf/Caleb_Taylor_Resume.pdf";
import {
  iconGithubJSX,
  iconLinkedinJSX,
  iconStackOverflowJSX,
} from "../../components/font-awesome/icons";
import S_Link from "../../components/S_Link/S_Link";

const Footer = () => {
  return (
    <footer class="pfooter">
      <div class="pfooter-contact">
        <div class="pfooter-contact-item">
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
      <div class="pfooter-social">
        <div class="pfooter-social-item">
          <a
            class="pfooter-social-item-link"
            title="Github"
            href="https://github.com/aquaductape"
            target="_blank"
            rel="noopener"
          >
            {iconGithubJSX()}
          </a>
        </div>
        <div class="pfooter-social-item">
          <a
            class="pfooter-social-item-link"
            title="LinkedIn"
            href="https://www.linkedin.com/in/caleb1taylor2/"
            target="_blank"
            rel="noopener"
          >
            {iconLinkedinJSX()}
          </a>
        </div>
        <div class="pfooter-social-item">
          <a
            class="pfooter-social-item-link"
            title="Stack Overflow"
            href="https://stackoverflow.com/users/8234457/caleb-taylor"
            target="_blank"
            rel="noopener"
          >
            {iconStackOverflowJSX()}
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
