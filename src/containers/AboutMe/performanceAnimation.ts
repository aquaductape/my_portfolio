import {
  MainTimeline,
  TInteractivity,
  TKeyframeStyle,
} from "./animateProjectPromise";

const state = {
  os: "mac",
  color: {
    green: "#7ada7a",
    blue: "#43b7ff",
    grey: "#b3b3b3",
  },
  closed: false,
  expanded: false,
  collapsed: false,
};

const interactivity: TInteractivity[] = [
  {
    selector: ".page-btn",
    event: ({ currentTarget }) => {
      const query = (s: string): HTMLElement =>
        currentTarget.querySelector(s) as HTMLElement;

      const heroBg = query(".hero-bg");
      const heroWindows10 = query(".hero-windows10");
      const heroWindowsXp = query(".hero-windowsxp");
      const heroMac = query(".hero-mac");
      const titleWindows10 = query(".title-bar-windows10");
      const browserWindowsXp = query(".browser-windowsxp");
      const titleMac = query(".title-bar-mac");
      const pageImgBg = query(".page-img-bg");
      const browserBody = query(".browser-body");

      const fromTo = (swapEl: HTMLElement[][], color: string) => {
        for (const els of swapEl) {
          const [fromEl, toEl] = els;

          fromEl.style.transition = "opacity 300ms";
          toEl.style.transition = "opacity 300ms";
          fromEl.style.opacity = "0";
          fromEl.style.pointerEvents = "none";
          toEl.style.pointerEvents = "";
          toEl.style.opacity = "1";
        }
        heroBg.style.fill = color;
        pageImgBg.style.fill = color;
        heroBg.style.transition = "fill 300ms";
        pageImgBg.style.transition = "fill 300ms";
      };

      if (state.os === "mac") {
        fromTo(
          [
            [titleMac, titleWindows10],
            [heroWindows10, heroWindowsXp],
          ],
          state.color.green
        );
        browserBody.setAttribute("ry", "0");
        state.os = "windows10";
        return;
      }

      if (state.os === "windows10") {
        fromTo(
          [
            [titleWindows10, browserWindowsXp],
            [heroWindowsXp, heroMac],
          ],
          state.color.grey
        );
        state.os = "windowsxp";
        return;
      }

      if (state.os === "windowsxp") {
        fromTo(
          [
            [browserWindowsXp, titleMac],
            [heroMac, heroWindows10],
          ],
          state.color.blue
        );
        browserBody.setAttribute("ry", "0.237");
        state.os = "mac";
        return;
      }
    },
  },
  {
    selector: ".title-bar-close",
    event: ({ currentTarget, mTimeline }) => {
      const perfContainer = currentTarget.querySelector(".perf-container")!;
      mTimeline.animate(perfContainer, [{ scaleY: 1 }, { scaleY: 0 }], {
        duration: 200,
      });
    },
  },
  {
    selector: "svg",
    event: ({ currentTarget, mTimeline }) => {
      if (!state.collapsed) return;
      state.collapsed = false;
      const browserBodyContainer = currentTarget.querySelector(
        ".browser-body-container"
      )!;
      const browser = currentTarget.querySelector(".browser")!;
      const titleBars = currentTarget.querySelector(".title-bars")!;

      mTimeline.animate(browserBodyContainer, null, {
        duration: 200,
        origin: "top",
      });

      mTimeline.animate(browser, null, {
        duration: 200,
        disable: false,
        resetSavedStyle: true,
      });

      mTimeline.animate(
        titleBars,
        [
          {
            opacity: 1,
          },
        ],
        {
          duration: 200,
        }
      );
    },
  },
  {
    selector: ".title-bar-collapse",
    event: ({ currentTarget, mTimeline }) => {
      if (state.collapsed) return;
      state.collapsed = true;
      // 3.3970000743865967

      const browser = currentTarget.querySelector(".browser")!;
      const browserBodyContainer = currentTarget.querySelector(
        ".browser-body-container"
      )!;
      const titleBars = currentTarget.querySelector(".title-bars")!;

      mTimeline.animate(
        browserBodyContainer,
        [
          {
            y: 0,
            scaleY: 1,
          },
          {
            y: 0.4,
            scaleY: 0.882,
          },
        ],
        {
          duration: 200,
          origin: "top",
        }
      );

      mTimeline.animate(
        browser,
        [
          {
            x: -3,
            y: 1.6,
            scale: 0.2,
          },
        ],
        {
          duration: 200,

          disable: true,
        }
      );

      mTimeline.animate(
        titleBars,
        [
          {
            opacity: 0,
          },
        ],
        {
          duration: 200,
        }
      );
    },
  },
  {
    selector: ".title-bar-expand",
    event: ({ currentTarget, mTimeline }) => {
      const query = (s: string): HTMLElement =>
        currentTarget.querySelector(s) as HTMLElement;

      const loadingBarMask = query(".loading-bar-mask");
      const loadingBar = query(".loading-bar");
      const titleWindows10 = query(".title-bar-windows10");
      const browserWindowsXp = query(".browser-windowsxp");
      const titleMac = query(".title-bar-mac");
      const browserBody = query(".browser-body");
      const heroBg = query(".hero-bg");
      const frameWindowsXp = query(".frame");
      const herosImg = query(".heros-img");
      const resultScore = query(".result-score");
      const duration = 400;

      state.expanded = !state.expanded;

      const toggleExpMinIcon = (el: HTMLElement) => {
        const minimizeIcon = el.querySelector(".minimize")!;
        const expandIcon = el.querySelector(".expand")!;

        mTimeline.animate(
          minimizeIcon,
          [
            {
              opacity: 1,
            },
          ],
          { duration: 0, reset: !state.expanded }
        );
        mTimeline.animate(
          expandIcon,
          [
            {
              opacity: 0,
            },
          ],
          { duration: 0, reset: !state.expanded }
        );
      };

      const animateBodies = (el: HTMLElement) => {
        mTimeline.animate(
          el,
          [
            {
              width: 7.435,
              height: 4,
              attrX: 1.64,
              attrY: 3.9,
            },
          ],
          { duration, reset: !state.expanded }
        );
      };

      const animateTitleButtons = (
        type: "windows10" | "mac" | "windowsxp",
        titleBar: HTMLElement
      ) => {
        const titleBarButtons = titleBar.querySelector(
          ".title-bar-buttons"
        ) as HTMLElement;

        let endKeyframe: TKeyframeStyle;

        switch (type) {
          case "mac":
            endKeyframe = { x: -0.5, y: -0.5 };
            break;
          default:
            endKeyframe = {
              x: 1.8,
              y: -0.5,
            };
        }

        mTimeline.animate(
          titleBarButtons,
          [
            {
              x: 0,
              y: 0,
            },
            endKeyframe,
          ],
          { duration, reset: !state.expanded }
        );
      };

      const animateTitleSections = (titleBar: HTMLElement) => {
        const titleLeft = titleBar.querySelector(".title-left")!;
        const titleMid = titleBar.querySelector(".title-mid")!;
        const titleRight = titleBar.querySelector(".title-right")!;

        mTimeline.animate(
          titleLeft,
          [
            {
              x: 0,
              y: 0,
            },
            {
              x: -0.5,
              y: -0.5,
            },
          ],
          { duration, reset: !state.expanded }
        );

        mTimeline.animate(
          titleRight,
          [
            {
              x: 0,
              y: 0,
            },
            {
              x: 1.815,
              y: -0.5,
            },
          ],
          { duration, reset: !state.expanded }
        );

        mTimeline.animate(
          titleMid,
          [
            {
              scaleX: 1,
              x: 0,
              y: 0,
            },
            {
              scaleX: 1.55,
              x: 0.65,
              y: -0.5,
            },
          ],
          { duration, reset: !state.expanded }
        );
      };

      animateTitleSections(titleWindows10);
      animateTitleSections(browserWindowsXp);
      animateTitleSections(titleMac);
      animateBodies(browserBody);
      animateBodies(frameWindowsXp);
      animateTitleButtons("windows10", titleWindows10);
      animateTitleButtons("mac", titleMac);
      animateTitleButtons("windowsxp", browserWindowsXp);
      toggleExpMinIcon(titleWindows10);
      toggleExpMinIcon(browserWindowsXp);

      mTimeline.animate(
        herosImg,
        [
          { x: 0, y: 0 },
          { x: 1.17, y: -0.2 },
        ],
        {
          duration,
          reset: !state.expanded,
        }
      );

      mTimeline.animate(resultScore, [{ x: 0 }, { x: 1.57 }], {
        duration,
        reset: !state.expanded,
      });

      if (state.expanded) {
        loadingBar.style.strokeDasharray = "7.31";
        loadingBar.style.strokeDashoffset = "7.31";
        loadingBar.setAttribute("d", "m2.132 4.799h7.3");
        loadingBar.classList.add("active");
      } else {
        loadingBar.style.strokeDasharray = "5.1";
        loadingBar.setAttribute("d", "m2.132 4.799h5.1");
        loadingBar.classList.remove("active");
      }

      mTimeline.animate(
        loadingBar,
        [
          {
            x: 0,
            y: 0,
          },
          {
            x: -0.4,
            y: -0.5,
          },
        ],
        { duration: 0, reset: !state.expanded }
      );

      mTimeline.animate(
        loadingBarMask,
        [
          {
            x: 0,
            scaleX: 1,
          },
          {
            x: -0.09,
            scaleX: 1.442,
          },
        ],
        { duration, origin: "left", reset: !state.expanded }
      );

      mTimeline.animate(
        heroBg,
        [
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
          },
          {
            x: 0.655,
            y: -0.18,
            scaleX: 1.442,
            scaleY: 1.25,
          },
        ],
        { duration, reset: !state.expanded }
      );
    },
  },
];

// 104.198.14.52
export const performanceAnimation = ({
  target,
  mTimeline,
}: {
  target: HTMLElement;
  mTimeline: MainTimeline;
}) => {
  const query = (s: string): HTMLElement =>
    target.querySelector(s) as HTMLElement;

  const loadingBar = query(".loading-bar");
  const airplaneEl = query(".airplane");
  const airplaneRotateEl = query(".airplane-rotate");
  const browserEl = query(".browser");
  const browserRotateEl = query(".browser-rotate");
  const pageEl = query(".page");
  const urlBarEl = query(".url-bar");
  const filesEl = query(".files");
  const fileImg0El = query(".file-img-0");
  const fileImg1El = query(".file-img-1");
  const fileImg2El = query(".file-img-2");
  const fileJSEl = query(".file-js");
  const fileCSSEl = query(".file-css");
  const fileHTMLEl = query(".file-html");
  const percentEl = query(".percent");
  const percentProgressBarEl = query(".percent-progress-bar");
  const percentTextEl = query(".percent-text");
  const checkmarkEl = query(".checkmark");
  const pageBtn = query(".page-btn");

  const start = () => {
    const duration = 600;
    const delayCut = 193.846;

    if (loadingBar.classList.contains("active")) {
      loadingBar.style.strokeDasharray = "";
      loadingBar.setAttribute("d", "m2.132 4.799h5.1");
      loadingBar.classList.remove("active");
    }
    // 450
    mTimeline.scene(
      () => {
        mTimeline.animate(
          airplaneEl,
          [
            {
              x: 0,
              y: 0,
              scale: 1,
            },
            {
              x: -1.5,
              y: -0.5,
              scale: 0,
            },
          ],
          {
            duration,
          }
        );

        mTimeline.animate(
          airplaneRotateEl,
          [
            {
              rotate: 0,
            },
            {
              rotate: -90,
            },
          ],
          {
            duration,
            origin: "-5 50%",
          }
        );

        mTimeline.animate(
          browserRotateEl,
          [
            {
              rotate: 90,
            },
            {
              rotate: 0,
            },
          ],
          {
            duration: duration * 1.7,
            delay: duration - delayCut,
            origin: "250% -350%",
          }
        );

        mTimeline.animate(
          browserEl,
          [
            {
              x: -1.59,
              y: -2.6,
              scale: 0.01,
            },
            {
              x: -2.15,
              y: 2.2,
              scale: 0.2,
            },
            {
              x: 0,
              y: -1,
              scale: 1,
            },
          ],
          {
            duration: duration * 1.7,
            delay: duration - delayCut,
          }
        );

        mTimeline.animate(
          target,
          [
            {
              scale: 1,
              x: 0,
            },
            {
              scale: 2.5,
              x: -2,
            },
          ],
          {
            duration: 500,
          }
        );
      },
      { duration: 1300 }
    );
  };

  const loop = () => {
    mTimeline.scene(
      () => {
        mTimeline.animate(
          urlBarEl,
          [
            { y: -1, scale: 0 },
            { y: -1, scale: 1 },
          ],
          {
            duration: 500,
          }
        );
      },
      { duration: 800 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          browserEl,
          [
            {
              x: 0,
              y: 0.5,
              scale: 0.5,
            },
          ],
          {
            duration: 800,
          }
        );

        mTimeline.animate(urlBarEl, [{ y: -4, scale: 1.2 }], {
          duration: 800,
        });
      },
      { duration: 500 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          filesEl,
          [
            { opacity: 0, y: 1 },
            { opacity: 1, y: 1 },
          ],
          {
            duration: 500,
          }
        );
        mTimeline.animate(urlBarEl, [{ opacity: 1 }, { opacity: 0 }], {
          duration: 500,
        });
      },
      { duration: 800 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          filesEl,
          [
            {
              scale: 1,
            },
            {
              scale: 1.8,
            },
          ],
          {
            duration: 500,
          }
        );
      },
      { duration: 800 }
    );

    mTimeline.scene(
      () => {
        const animateFiles = (el: Element, multiplier: number) => {
          mTimeline.animate(
            el,
            [
              {
                x: 0,
              },
              {
                x: 0.3 * multiplier,
              },
            ],
            { duration: 300, easing: "linear" }
          );
        };

        animateFiles(fileCSSEl, 1);
        animateFiles(fileJSEl, 2);
        animateFiles(fileImg0El, 3);
        animateFiles(fileImg1El, 4);
        animateFiles(fileImg2El, 5);
      },
      { duration: 500 }
    );

    mTimeline.scene(
      () => {
        let loadingBarDashoffset = 5.1;

        const animateFiles = (el: Element, multiplier: number) => {
          const prevFileTranslateX = 0.3;

          mTimeline.animate(
            el,
            [
              {
                x: prevFileTranslateX * multiplier,
                y: 0,
              },
              {
                x: 0,
                y: 0,
              },
              { y: 2.25 },
            ],
            { duration: 800, delay: 200 * multiplier, easing: "linear" }
          );
        };

        animateFiles(fileHTMLEl, 0);
        animateFiles(fileCSSEl, 1);
        animateFiles(fileJSEl, 2);
        animateFiles(fileImg0El, 3);
        animateFiles(fileImg1El, 4);
        animateFiles(fileImg2El, 5);

        if (loadingBar.classList.contains("active")) {
          loadingBarDashoffset = 7.31;
        }

        mTimeline.animate(
          loadingBar,
          [{ opacity: 1, strokeDashoffset: loadingBarDashoffset }],
          { duration: 0 }
        );

        mTimeline.setTimeout(() => {
          mTimeline.animate(
            loadingBar,
            [
              {
                strokeDashoffset: loadingBarDashoffset,
                offset: 0,
              },
              {
                strokeDashoffset: 4.5,
                offset: 0.1,
              },
              {
                strokeDashoffset: 4.5,
                offset: 0.2,
              },
              {
                strokeDashoffset: 2.5,
                offset: 0.5,
              },
              {
                strokeDashoffset: 2.5,
                offset: 0.6,
              },
              {
                strokeDashoffset: 2.0,
                offset: 0.7,
              },
              {
                strokeDashoffset: 0,
                offset: 1,
              },
            ],
            { duration: 1500 }
          );
        }, 800);
      },
      { duration: 2500 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(filesEl, [{ opacity: 0 }], {
          duration: 0,
        });
        mTimeline.animate(
          browserEl,
          [
            {
              scale: 1.2,
              x: -1,
              y: -2,
            },
          ],
          {
            duration: 500,
          }
        );
        mTimeline.animate(
          pageEl,
          [
            {
              opacity: 1,
            },
          ],
          {
            duration: 300,
            onEnd: () => {
              mTimeline.animate(loadingBar, [{ opacity: 0 }], { duration: 0 });
            },
          }
        );
        mTimeline.animate(
          pageBtn,
          [
            {
              opacity: 1,
            },
          ],
          {
            delay: 300,
            duration: 300,
          }
        );
      },
      { duration: 1000 }
    );

    mTimeline.scene(
      () => {
        const totalLength = 8;
        percentProgressBarEl.style.strokeDasharray = `${totalLength}px`;
        percentProgressBarEl.style.strokeDashoffset = `${totalLength}px`;

        mTimeline.animate(
          percentEl,
          [
            {
              x: -0.5,
              y: -1.5,
              scale: 0,
            },
            { scale: 1, x: -0.5, y: -1.5 },
          ],
          { duration: 500 }
        );

        mTimeline.setTimeout(() => {
          mTimeline.countAnimation({
            el: percentTextEl,
            startNum: 0,
            endNum: 100,
            duration: 1200,
          });
        }, 500);

        mTimeline.animate(
          percentProgressBarEl,
          [
            {
              strokeDashoffset: totalLength,
            },
            {
              strokeDashoffset: 0,
            },
          ],
          { duration: 1400, delay: 500 }
        );
      },
      { duration: 1900 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          checkmarkEl,
          [
            {
              scale: 0,
              x: -0.5,
              y: -1.5,
              rotate: 90,
            },
            {
              scale: 1,
              x: -0.5,
              y: -1.5,
              rotate: 0,
            },
          ],
          { duration: 500 }
        );
      },
      { duration: 1000 }
    );

    mTimeline.scene(
      () => {
        mTimeline.reset(
          [
            percentEl,
            filesEl,
            fileHTMLEl,
            fileCSSEl,
            fileJSEl,
            fileImg0El,
            fileImg1El,
            fileImg2El,
            urlBarEl,
          ],
          { duration: 0 }
        );

        mTimeline.reset([checkmarkEl, pageEl, pageBtn], { duration: 500 });
      },
      { duration: 500 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          browserEl,
          [
            {
              x: 0,
              y: -1,
              scale: 1,
            },
          ],
          {
            duration: 500,
          }
        );
      },
      { duration: 500 }
    );
  };

  mTimeline.interactivity = interactivity;
  mTimeline.svg = target;
  // mTimeline.addInteractivity();
  // start();
  // loop();
  mTimeline.start = start;
  mTimeline.loop = loop;
  mTimeline.play();
};

export const performanceEnd = ({ mTimeline }: { mTimeline: MainTimeline }) => {
  mTimeline.stop();
};
