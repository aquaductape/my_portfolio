import { iconCode, iconLink } from "../../components/font-awesome/icons";
import { createEffect, createSignal, For, onMount, useContext } from "solid-js";
import { GlobalContext } from "../../context/context";
import CONSTANTS from "../../constants";
import { capitalize, isBrowser } from "../../utils";
import { TechIconsCollapsed, TechIconsExpanded } from "./TechIcons";
import { flip } from "../../utils/flip";
import LoaderLogo from "../../components/Loader/LoaderLogo";

const Project = ({
  name,
  img,
  about,
  links,
  skills,
  onClick: onClickReadMore,
}: {
  name: string;
  img: { src: string; alt: string };
  about: string;
  links: { website: string; sourceCode: string };
  skills: {
    frontend: string[];
    backend: string[];
    buildTool: string[];
    api: string[];
  };
  onClick: () => void;
}) => {
  const [context] = useContext(GlobalContext);
  const collapsedIcons = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.buildTool,
    ...skills.api,
  ];
  const [toggleTech, setToggleTech] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  let iconsBCRs: DOMRect[] = [];
  let animationRunning = false;

  const onClickToggleTech = () => {
    if (animationRunning) return true;

    const textEl = buttonRef.querySelector(".text")!;
    const borderEl = buttonRef.querySelector(".border")!;
    const cevronEl = buttonRef.querySelector(".cevron")!;
    const icons = buttonRef.querySelectorAll(".icon")!;
    animationRunning = true;
    iconsBCRs = [];

    icons.forEach((icon) => {
      iconsBCRs.push(icon.getBoundingClientRect());
    });

    if (!toggleTech()) {
      textEl.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 250 });
      borderEl.animate([{ opacity: "1" }, { opacity: "0" }], { duration: 250 });
    }

    const rotateStart = "rotate(0deg)";
    const rotateEnd = toggleTech() ? "rotate(90deg)" : "rotate(-90deg)";
    const cevronAnimation = cevronEl.animate(
      [
        {
          transform: rotateStart,
        },
        {
          transform: rotateEnd,
        },
      ],
      { duration: 250 }
    );

    cevronAnimation.onfinish = () => {
      setToggleTech(!toggleTech());
    };

    setTimeout(() => {
      animationRunning = false;
    }, 250 + (toggleTech() ? 0 : 400));
  };

  createEffect(() => {
    if (!buttonRef || !toggleTech()) return;

    const icons = buttonRef.querySelectorAll(
      ".icon"
    ) as NodeListOf<HTMLElement>;
    const flipAnimations: { firstEl: DOMRect; lastEl: HTMLElement }[] = [];

    icons.forEach((lastIcon, idx) => {
      const firstIconBCR = iconsBCRs[idx];
      flipAnimations.push({
        firstEl: firstIconBCR,
        lastEl: lastIcon,
      });
    });

    flip(flipAnimations, { enableCache: false });

    icons.forEach((icon) => {
      icon.style.opacity = "1";
    });
  });

  return (
    <div data-flip-key={`card-${name}`} className="card">
      <div className="card-img-container">
        <img
          className="card-img"
          src={img.src}
          alt={img.alt}
          data-flip-key={`img-${name}`}
          onClick={onClickReadMore}
        />

        <div className="card-link-container">
          <a
            className="card-link-item"
            href={links.website}
            target="blank"
            data-flip-key={`link-website-${name}`}
          >
            <span innerHTML={iconLink}></span>
            Website
          </a>
          <a
            className="card-link-item"
            href={links.sourceCode}
            target="blank"
            data-flip-key={`link-source-code-${name}`}
          >
            <span innerHTML={iconCode}></span>
            Source Code
          </a>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">
          <span data-flip-key={`title-${name}`}>{capitalize(name)}</span>
        </h3>

        <button
          className={`tech-icons ${toggleTech() ? "active" : ""}`}
          aria-label={`Tech Used: ${collapsedIcons.join(", ")}`}
          onClick={onClickToggleTech}
          ref={buttonRef}
        >
          {toggleTech() ? (
            <div className="expanded">
              <TechIconsExpanded skills={skills}></TechIconsExpanded>
            </div>
          ) : (
            <div className="collapsed">
              <TechIconsCollapsed icons={collapsedIcons}></TechIconsCollapsed>
            </div>
          )}
        </button>
        <p className="card-pg">{about}</p>
        <button class="card-read-more" onClick={onClickReadMore}>
          <span>Read More</span>
          {context.blog.import &&
            !context.blog.finishedStaging &&
            context.blog.type === name && (
              <span class="card-loader Reveal-delay">
                <LoaderLogo></LoaderLogo>
              </span>
            )}
        </button>
      </div>
    </div>
  );
};

const Projects = () => {
  const [_, { setBlog, setHeader }] = useContext(GlobalContext);

  const projects = CONSTANTS.projects;

  const onClickReadMore = (type: "3nRow" | "facify") => {
    setBlog({ type, active: true, import: true });
    setHeader({ activeLink: "projects" });
  };

  onMount(() => {
    const observerCb: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 0) return;

        setBlog({ import: true });

        observer.disconnect();
      });
    };
    const observer = new IntersectionObserver(observerCb);

    setTimeout(() => {
      const projectsEl = document.getElementById("projects")!;
      const readMoreBtnEls = projectsEl.querySelectorAll(
        ".card-read-more"
      ) as NodeListOf<HTMLElement>;

      readMoreBtnEls.forEach((readMoreBtnEl) => {
        observer.observe(readMoreBtnEl);
      });
    }, 500);
  });

  return (
    <section id="projects" className="projects" tabindex="-1">
      <h2 className="section-title">Projects</h2>
      <div className="card-container">
        <For each={projects}>
          {({ project, about, img, links, skills }) => (
            <div className="flex-gap">
              <Project
                name={project}
                about={about}
                img={img}
                links={links}
                skills={skills}
                onClick={() => onClickReadMore(project as "3nRow")}
              ></Project>
            </div>
          )}
        </For>
      </div>
    </section>
  );
};

export default Projects;
