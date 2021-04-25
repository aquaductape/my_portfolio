import { iconCode, iconLink } from "../../components/font-awesome/icons";
import ticTacToeImg from "../../assets/img/tic-tac-toe.png";
import ticTacToeImgWebP from "../../assets/img/tic-tac-toe.webp";
import facifyImg from "../../assets/img/facify.png";
import facifyImgWebP from "../../assets/img/facify.webp";

const Projects = () => {
  return (
    <section id="projects" className="projects" tabindex="-1">
      <h2 className="section-title">Projects</h2>
      <div className="card-container">
        <div className="flex-gap">
          <div className="card">
            <picture>
              <source srcset={ticTacToeImgWebP} type="image/webp" />
              <source srcset={ticTacToeImg} type="image/png" />
              <img
                className="card-img"
                src={ticTacToeImg}
                alt="screenshot of tic-tac-toe game"
                width="100" // just to pass lighthouse, since this image is responsive
                height="100" // just to pass lighthouse, since this image is responsive
              />
            </picture>
            <div className="card-content">
              <h3 className="card-title">3nRow - Tic Tac Toe</h3>
              <p className="card-pg">
                A Tic Tac Toe game where it involved no frameworks, no JQuery,
                everything vanilla. Animations were done using glorious SVG.
              </p>
              <div className="card-link-container">
                <a
                  className="card-link-item"
                  href="https://aquaductape.github.io/3nRow/"
                  target="blank"
                >
                  <span innerHTML={iconLink}></span>
                  Website
                </a>
                <a
                  className="card-link-item"
                  href="https://github.com/aquaductape/3nRow"
                  target="blank"
                >
                  <span innerHTML={iconCode}></span>
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-gap">
          <div className="card">
            <picture>
              <source srcset={facifyImgWebP} type="image/webp" />
              <source srcset={facifyImg} type="image/png" />
              <img
                className="card-img"
                src={facifyImg}
                alt="screenshot of facify application"
                width="100" // just to pass lighthouse, since this image is responsive
                height="100" // just to pass lighthouse, since this image is responsive
              />
            </picture>
            <div className="card-content">
              <h3 className="card-title">Facify</h3>
              <p className="card-pg">
                Locate human faces by sending an image from your local files,
                URL, WebCam(browser), or mobile camera.
              </p>
              <div className="card-link-container">
                <a
                  className="card-link-item"
                  href="https://facify.vercel.app/"
                  target="blank"
                >
                  <span innerHTML={iconLink}></span>
                  Website
                </a>

                <a
                  className="card-link-item"
                  href="https://github.com/aquaductape/facify"
                  target="blank"
                >
                  <span innerHTML={iconCode}></span>
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
