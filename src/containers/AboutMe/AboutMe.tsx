import {
  iconGithubJSX,
  iconLinkedinJSX,
  iconStackOverflowJSX,
} from "../../components/font-awesome/icons";

import resumePDF from "../../assets/pdf/Caleb_Taylor_Resume.pdf";
import {
  For,
  JSX,
  createState,
  createEffect,
  batch,
  createSignal,
  useContext,
} from "solid-js";
import { ResumeIcon } from "../../components/svg/icons/icons";
import {
  A11yIcon,
  PerformanceIcon,
  ResponsiveIcon,
} from "../../components/svg/icons/hero-icons";
import {
  endAnimateProjectPromise,
  startAnimateProjectPromise,
} from "./animateProjectPromise";
import useMatchMedia from "../../hooks/useMatchMedia";
import { GlobalContext } from "../../context/context";
import AboutMeLogo from "./AboutMeLogo";

type TSocialLink = {
  href: string;
  ariaLabel: string;
  download?: string;
  icon: () => JSX.Element;
};

type TProjectPromise = {
  type: string;
  active: boolean;
  content: string;
  icon: () => JSX.Element;
};

const AboutMe = () => {
  const [_, { setHero }] = useContext(GlobalContext);
  const { minWidth_400 } = useMatchMedia();

  const socialLinks: TSocialLink[] = [
    {
      ariaLabel: "Github",
      href: "https://github.com/aquaductape",
      icon: iconGithubJSX,
    },
    {
      ariaLabel: "Stack Overflow",
      href: "https://stackoverflow.com/users/8234457/caleb-taylor",
      icon: iconStackOverflowJSX,
    },
    {
      ariaLabel: "LinkedIn",
      href: "https://github.com/aquaductape",
      icon: iconLinkedinJSX,
    },
    {
      ariaLabel: "Download PDF Resume",
      href: resumePDF,
      download: "Caleb_Taylor_Resume.pdf",
      icon: ResumeIcon as any,
    },
  ];

  const [projectPromises, setProjectPromises] = createState<TProjectPromise[]>([
    {
      type: "responsive",
      active: false,
      content: "Responsive",
      icon: ResponsiveIcon,
    },
    {
      type: "performance",
      active: false,
      content: "Performant",
      icon: PerformanceIcon,
    },
    {
      type: "a11y",
      active: false,
      content: "Accessible",
      icon: A11yIcon,
    },
  ]);

  const [projectPromiseAnimationActive, setProjectPromiseAnimationActive] =
    createSignal("");

  const [init, setInit] = createSignal(true);
  let projectPromisesGroupEl!: HTMLUListElement;

  const updateProjectPromise = (idx: number) => {
    batch(() => {
      setInit(false);
      setHero({ bgActive: false });
      setProjectPromises({}, "active", false);
      setProjectPromises(idx, "active", true);
      setProjectPromiseAnimationActive(projectPromises[idx].type);
    });
  };

  const mouseEnterProjectPromise = (idx: number) => {
    if (!minWidth_400.matches && !projectPromiseAnimationActive()) {
      const heroShadowDuration = 450;

      setTimeout(() => {
        setHero({ shadowActive: false });
        updateProjectPromise(idx);
      }, heroShadowDuration);

      return;
    }
    updateProjectPromise(idx);
  };

  const mouseLeaveProjectPromise = (e: MouseEvent) => {
    const heroIconCloseDuration = 900;
    const isMobile = !minWidth_400.matches;

    batch(() => {
      setHero({ bgActive: !isMobile });
      setProjectPromiseAnimationActive("");
      setProjectPromises({}, "active", false);
    });

    if (!isMobile) return;

    setTimeout(() => {
      setHero({
        bgActive: true,
        shadowActive: true,
        clientCoordinates: { x: e.clientX, y: e.clientY },
      });
    }, heroIconCloseDuration);
  };

  createEffect(() => {
    if (init()) return;

    projectPromises.forEach((proj) => {
      const el = projectPromisesGroupEl.querySelector(
        `[data-project-promise-id="${proj.type}"]`
      ) as HTMLElement;
      const svgEl = el.querySelector("svg") as unknown as HTMLElement;

      if (proj.active) {
        startAnimateProjectPromise(svgEl, proj.type as "a11y");
      } else {
        endAnimateProjectPromise(proj.type as "a11y");
      }
    });
  });

  return (
    <section id="about-me" class="about-me">
      <div class="about-me-inner">
        <div class="about-me-content">
          <AboutMeLogo></AboutMeLogo>
          <div class="about-me-intro">
            <p class="about-me-intro__declaration">
              Dedicated self-taught Front-End developer.
            </p>
            <p id="project-promises">Building projects that are:</p>
            <ul
              aria-labelledby="project-promises"
              class="about-me-group-list"
              onMouseLeave={mouseLeaveProjectPromise}
              ref={projectPromisesGroupEl}
            >
              <For each={projectPromises}>
                {(props, idx) => {
                  const Icon = props.icon;

                  return (
                    <li
                      data-project-promise-id={props.type}
                      class={`about-me-list ${props.active ? "active" : ""} ${
                        props.active && props.type === "performance"
                          ? "active-performance"
                          : ""
                      } ${
                        props.active && props.type === "responsive"
                          ? "active-responsive"
                          : ""
                      } ${
                        props.active && props.type === "a11y"
                          ? "active-a11y"
                          : ""
                      } ${
                        !props.active &&
                        projectPromiseAnimationActive() === "performance"
                          ? "deactivate"
                          : ""
                      }`}
                    >
                      <div
                        className="capture-interaction"
                        onMouseEnter={() => mouseEnterProjectPromise(idx())}
                        style={{
                          display: props.active ? "none" : "block",
                          "z-index": 2,
                        }}
                      ></div>
                      <span class="about-me-icon-container">
                        <span
                          class={`about-me-icon ${
                            !props.active && !!projectPromiseAnimationActive()
                              ? "deactivate"
                              : ""
                          }`}
                        >
                          <Icon></Icon>
                        </span>
                      </span>
                      <span
                        class={`about-me-promise-description ${
                          !props.active && !!projectPromiseAnimationActive()
                            ? "deactivate"
                            : ""
                        }`}
                      >
                        {props.content}
                      </span>
                    </li>
                  );
                }}
              </For>
            </ul>
          </div>
        </div>
      </div>
      <div class="about-me-social-links">
        <ul class="social-links">
          <For each={socialLinks}>
            {(item) => {
              return (
                <li class="social-links__li" data-link-name={item.ariaLabel}>
                  <a
                    title={item.ariaLabel}
                    href={item.href}
                    rel="noreferrer noopener"
                    download={item.download ? item.download : null}
                    // innerHTML={
                    //   typeof item.icon === "string" ? item.icon : undefined
                    // }
                  >
                    {item.icon()}
                  </a>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </section>
  );
};

export default AboutMe;
