import {
  createEffect,
  createSignal,
  For,
  lazy,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { GlobalContext } from "../../context/context";
import CONSTANTS from "../../constants";
import { capitalize } from "../../utils";
import { flip } from "../../utils/flip";
import LoaderLogo from "../../components/Loader/LoaderLogo";
import {
  iconLinkJSX,
  iconSourceCodeJSX,
} from "../../components/font-awesome/icons";
import TechIcons from "./TechIcons";
// const TechIcons = lazy(() => import("./TechIcons"));

const Project = ({
  name,
  img,
  about,
  links,
  skills,
  hasBlog,
  onClick: onClickReadMore,
}: {
  name: string;
  img: { src: { png: string; avif: string }; alt: string };
  about: string;
  links: { website: string; sourceCode: string };
  skills: {
    frontend: string[];
    backend: string[];
    buildTool: string[];
    api: string[];
    testing: string[];
    packageManager: string[];
  };
  hasBlog: boolean;
  onClick: () => void;
}) => {
  const [context] = useContext(GlobalContext);
  const collapsedIcons = [
    ...skills.frontend,
    ...skills.backend,
    ...skills.buildTool,
    ...skills.api,
    ...skills.testing,
    ...skills.packageManager,
  ];
  const [toggleTech, setToggleTech] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  let iconsBCRs: DOMRect[] = [];
  let animationRunning = false;

  const onClickToggleTech = (e: MouseEvent) => {
    if (animationRunning) return true;

    const buttonRef = e.currentTarget as HTMLElement;

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
    if (!toggleTech()) return;

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
    <div data-flip-key={`card-${name}`} class="card">
      <div class="card-img-container">
        <picture>
          <source srcset={img.src.avif} type="image/avif" />
          <img
            class={`card-img ${!hasBlog ? "card-img-not-clickable" : ""}`}
            src={img.src.png}
            alt={img.alt}
            data-flip-key={`img-${name}`}
            onClick={() => {
              if (!hasBlog) return;
              onClickReadMore();
            }}
          />
        </picture>

        <div class="card-link-container">
          <a
            class="card-link-item"
            href={links.website}
            target="_blank"
            rel="noopener"
            data-flip-key={`link-website-${name}`}
          >
            <span>{iconLinkJSX()}</span>
            Website
          </a>
          <a
            class="card-link-item"
            href={links.sourceCode}
            target="_blank"
            rel="noopener"
            data-flip-key={`link-source-code-${name}`}
          >
            <span>{iconSourceCodeJSX()}</span>
            Source Code
          </a>
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">
          <span data-flip-key={`title-${name}`}>{capitalize(name)}</span>
        </h3>

        <div class="tech-icons-container">
          <TechIcons
            onClick={onClickToggleTech}
            toggle={toggleTech}
            skills={skills}
            collapsedIcons={collapsedIcons}
            ref={buttonRef}
          ></TechIcons>
        </div>

        {/* <button
          class={`tech-icons ${toggleTech() ? "active" : ""}`}
          aria-label={`Tech Used: ${collapsedIcons.join(", ")}`}
          onClick={onClickToggleTech}
          ref={buttonRef}
        >
          {toggleTech() ? (
            <div class="expanded">
              <TechIconsExpanded skills={skills}></TechIconsExpanded>
            </div>
          ) : (
            <div class="collapsed">
              <TechIconsCollapsed icons={collapsedIcons}></TechIconsCollapsed>
            </div>
          )}
        </button> */}

        <p class="card-pg">{about}</p>
        <Show when={hasBlog}>
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
        </Show>
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
    <section id="projects" class="projects" tabindex="-1">
      <h2 class="section-title">Projects</h2>
      <div class="card-container">
        <For each={projects}>
          {({ project, about, img, links, skills, hasBlog }) => (
            <div class="flex-gap">
              <Project
                name={project}
                about={about}
                img={img}
                links={links}
                skills={skills}
                hasBlog={hasBlog}
                onClick={() => onClickReadMore(project as "3nRow")}
              />
            </div>
          )}
        </For>
      </div>
    </section>
  );
};

export default Projects;
