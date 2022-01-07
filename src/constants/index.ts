import threeNRowHeroImgPng from "../assets/3nRow/img/hero.png";
import facifyHeroImgPng from "../assets/facify/img/hero.png";
import solidDismissHeroImgPng from "../assets/solid-dismiss/img/hero.png";
import threeNRowHeroImgAvif from "../assets/3nRow/img/hero.avif";
import facifyHeroImgAvif from "../assets/facify/img/hero.avif";
import solidDismissHeroImgAvif from "../assets/solid-dismiss/img/hero.avif";

const CONSTANTS = {
  links: ["skills", "projects", "contact"],
  projects: [
    {
      project: "Solid Dismiss",
      about: `A library that handles "click outside" behavior to close dropdowns/popups for SolidJS.`,
      img: {
        src: {
          avif: solidDismissHeroImgAvif,
          png: solidDismissHeroImgPng,
        },
        alt: "banner of solid dismiss",
      },
      links: {
        website: "https://aquaductape.github.io/solid-dismiss/",
        sourceCode: "https://github.com/aquaductape/solid-dismiss",
      },
      skills: {
        frontend: ["solidJS", "typescript", "sass"],
        backend: [],
        buildTool: ["vite", "rollup"],
        api: [],
        testing: ["testcafe"],
        packageManager: ["npm"],
      },
    },
    {
      project: "facify",
      about:
        "Locate human faces from an image. Also estimates age, gender and multicultural appearance.",
      img: {
        src: {
          avif: facifyHeroImgAvif,
          png: facifyHeroImgPng,
        },
        alt: "screenshot of facify application",
      },
      links: {
        website: "https://facify.vercel.app/",
        sourceCode: "https://github.com/aquaductape/facify",
      },
      skills: {
        frontend: ["react", "redux", "typescript", "css", "svg"],
        backend: ["nodejs"],
        buildTool: [],
        api: ["clarifai"],
        testing: [],
        packageManager: [],
      },
    },
    {
      project: "3nRow",
      about:
        "A versatile tic-tac-toe game! Has multiplayer, color/shape choices, play against AI, along with neat animations.",
      img: {
        src: {
          avif: threeNRowHeroImgAvif,
          png: threeNRowHeroImgPng,
        },
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
        testing: [],
        packageManager: [],
      },
    },
  ],
};

export default CONSTANTS;
