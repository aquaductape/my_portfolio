import threeNRowHeroImg from "../assets/3nRow/img/hero.png";
import facifyHeroImg from "../assets/facify/img/hero.png";

const CONSTANTS = {
  links: ["skills", "projects", "contact"],
  projects: [
    {
      project: "3nRow",
      about:
        "A versatile tic-tac-toe game! Has multiplayer, color/shape choices, play against AI, along with neat animations.",
      img: {
        src: threeNRowHeroImg,
        alt: "screenshot of tic-tac-toe game",
      },
      links: {
        website: "https://aquaductape.github.io/3nRow/",
        sourceCode: "https://github.com/aquaductape/3nRow",
      },
      skills: {
        frontend: ["html", "sass", "svg", "typescript"],
        backend: ["colyseus", "nodejs"],
        buildTool: ["webpack", "bash"],
        api: [],
      },
    },
    {
      project: "facify",
      about:
        "Locate human faces from an image. Also estimates age, gender and multicultural appearance.",
      img: {
        src: facifyHeroImg,
        alt: "screenshot of facify application",
      },
      links: {
        website: "https://facify.vercel.app/",
        sourceCode: "https://github.com/aquaductape/facify",
      },
      skills: {
        frontend: ["react", "redux", "css", "svg"],
        backend: ["nodejs"],
        buildTool: [],
        api: ["clarifai"],
      },
    },
  ],
};

export default CONSTANTS;
