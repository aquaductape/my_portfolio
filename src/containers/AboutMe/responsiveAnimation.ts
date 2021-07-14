import {
  MainTimeline,
  TInteractivity,
  TKeyframeStyle,
} from "./animateProjectPromise";

let theme = "dark" as "light" | "dark";

const interactivity: TInteractivity[] = [
  {
    selector: ".main-container",
    event: ({ currentTarget }) => {
      const changeTheme = (theme: "light" | "dark") => {
        const pageTextEls = currentTarget.querySelectorAll(
          ".page-text"
        ) as NodeListOf<HTMLElement>;
        const pageChatEl = currentTarget.querySelector(
          ".page-chat-input"
        ) as HTMLElement;
        const pageBodyEl = currentTarget.querySelector(
          ".page-body"
        ) as HTMLElement;
        const navBarBgEl = currentTarget.querySelector(
          ".navbar-bg"
        ) as HTMLElement;

        const textColor = theme === "light" ? "#9597a5" : "#fff";
        const pageColor = theme === "light" ? "#fff" : "#333";
        const navColor = theme === "light" ? "#5d8aff" : "#88a3e9";
        const transition = "fill 500ms";

        pageTextEls.forEach((pageTextEl) => {
          pageTextEl.style.fill = textColor;
          pageTextEl.style.transition = transition;
        });

        pageBodyEl.style.fill = pageColor;
        pageChatEl.style.fill = pageColor;
        navBarBgEl.style.fill = navColor;

        pageBodyEl.style.transition = transition;
        pageChatEl.style.transition = transition;
        navBarBgEl.style.transition = transition;
      };

      changeTheme(theme);

      if (theme === "dark") {
        theme = "light";
      } else {
        theme = "dark";
      }
    },
  },
];

export const responsiveAnimation = ({
  target,
  mTimeline,
}: {
  target: HTMLElement;
  mTimeline: MainTimeline;
}) => {
  const query = (s: string): HTMLElement =>
    target.querySelector(s) as HTMLElement;
  const screenContainer = query(".screen-container");
  const pageInnerEl = query(".page-inner");
  const pageEl = query(".page");
  const mobileEl = query(".mobile");
  const monitorBorderEl = query(".monitor-border");
  const monitorMaskEl = query(".monitor-mask");
  const logoEl = query(".logo");
  const desktopStandEl = query(".desktop-stand");
  const laptopBottomEl = query(".laptop-bottom");
  const tabletBarsEl = query(".tablet-bars");
  const tabletBarBottomEl = query(".tablet-bar-bottom");
  const tabletBarTopEl = query(".tablet-bar-top");
  const mainContainerEl = query(".main-container");
  const pageChatEl = query(".page-chat");
  const pageContentColumn0El = query(".page-content-column-0");
  const pageContentColumn1El = query(".page-content-column-1");
  const pageContentColumn2El = query(".page-content-column-2");
  const navLinksEl = query(".nav-links");
  const navLink0El = query(".nav-link-0");
  const navLink1El = query(".nav-link-1");
  const navLink2El = query(".nav-link-2");

  // img: deno, "one punch man ok", "doge icon", "starcrafts zergling", "need for madness 1 radical one",
  // colors: light yellow, light blue, white, light magenta
  // window those 3 everytime you click (the reason is that there's three images on desktop and one on mobile )

  const start = () => {
    mTimeline.scene(
      () => {
        mTimeline.animate(
          mobileEl,
          [
            {
              y: 0,
            },
            {
              y: 3.5,
            },
          ],
          {
            duration: 600,
          }
        );
      },
      { duration: 600 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          target,
          [
            {
              scale: 1,
              x: 0,
            },
            {
              scale: 1.5,
              x: -2,
            },
          ],
          {
            duration: 800,
          }
        );

        mTimeline.animate(
          mainContainerEl,
          [
            {
              scale: 1,
              y: 0,
            },
            {
              y: -1,
              scale: 1.6,
            },
          ],
          {
            duration: 800,
            basedBBox: screenContainer,
          }
        );

        mTimeline.animate(
          pageEl,
          [
            {
              opacity: 0,
              scale: 1,
              x: 0,
              y: 0,
            },
            {
              opacity: 1,
              scale: 0.56,
              x: 0.3,
              y: -0.2,
            },
          ],
          {
            duration: 800,
          }
        );
      },
      { duration: 1200 }
    );
  };

  const loop = () => {
    mTimeline.scene(
      () => {
        const translate: TKeyframeStyle[] = [
          {
            y: -1,
            offset: 0,
          },
          {
            y: -1.2,
            offset: 0.3,
          },
          {
            y: 0,
            offset: 1,
          },
        ];

        mTimeline.animate(mainContainerEl, translate, {
          duration: 800,
          easing: "ease-in",
        });

        mTimeline.animate(
          desktopStandEl,
          [
            {
              y: 0,
              offset: 0,
            },
            {
              y: 0.2,
              offset: 0.3,
            },
            {
              y: -1.1,
              offset: 1,
            },
          ],
          {
            duration: 800,
            easing: "ease-in",
          }
        );
      },
      { duration: 900 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          laptopBottomEl,
          [
            { opacity: 1, scaleX: 0 },
            {
              opacity: 1,
              scaleX: 1,
            },
          ],
          {
            duration: 800,
            easing: "ease-in-out",
          }
        );

        mTimeline.animate(
          mainContainerEl,
          [
            {
              y: 0.5,
              scale: 1.4,
            },
          ],
          {
            duration: 700,
            easing: "ease-in",
          }
        );

        mTimeline.animate(
          monitorBorderEl,
          [
            {
              strokeWidth: 0.253,
              ry: 0.483,
            },
            {
              strokeWidth: 0.15,
              ry: 0.2,
            },
          ],
          { duration: 700 }
        );

        mTimeline.animate(
          monitorMaskEl,
          [
            {
              ry: 0.483,
            },
            {
              ry: 0.2,
            },
          ],
          { duration: 700 }
        );
      },
      { duration: 1300 }
    );

    mTimeline.scene(
      () => {
        const animateColumn = (el: HTMLElement) => {
          mTimeline.animate(
            el,
            [
              {
                x: 0,
              },
              {
                x: 0.8,
              },
            ],
            {
              duration: 500,
              delay: 500,
            }
          );
        };

        const animateNavLink = (el: HTMLElement, multiply: number) => {
          const translate = 1.4;
          mTimeline.animate(
            el,
            [
              {
                scale: 1,
                x: 0,
                y: 0,
              },
              {
                scale: 0.7,
                x: translate * multiply,
                y: -(translate / 4.5) * multiply,
              },
            ],
            {
              duration: 500,
              delay: 500,
            }
          );
        };

        mTimeline.animate(
          tabletBarBottomEl,
          [
            {
              scaleX: 0,
              scaleY: 1,
              y: 0,
              x: 0,
            },
            {
              scaleX: 1,
              scaleY: 1,
              y: 0,
              x: 0,
            },
          ],
          {
            duration: 700,
            origin: "right",
            easing: "ease-in",
          }
        );

        mTimeline.animate(
          tabletBarTopEl,
          [
            {
              scaleX: 0,
              scaleY: 1,
              x: 0,
              y: 0,
            },
            {
              scaleX: 1,
              scaleY: 1,
              x: 0,
              y: 0,
            },
          ],
          {
            duration: 700,
            origin: "left",
            easing: "ease-in",
          }
        );

        mTimeline.animate(
          tabletBarsEl,
          [
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 0,
          }
        );
        mTimeline.animate(
          laptopBottomEl,
          [
            {
              scaleX: 0,
            },
          ],
          {
            duration: 600,
            easing: "ease-in",
          }
        );
        mTimeline.animate(
          pageChatEl,
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 500,
            delay: 500,
          }
        );

        animateColumn(pageContentColumn0El);
        animateColumn(pageContentColumn1El);
        animateColumn(pageContentColumn2El);
        animateNavLink(navLink2El, 0);
        animateNavLink(navLink1El, 1);
        animateNavLink(navLink0El, 2);

        mTimeline.animate(
          navLinksEl,
          [
            {
              y: 0,
              x: 0,
            },
            {
              y: 0.2,
              x: -0.1,
            },
          ],
          {
            duration: 500,
            delay: 500,
          }
        );
      },
      { duration: 1200 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          mainContainerEl,
          [
            {
              rotate: 0,
            },
            {
              rotate: 90,
            },
          ],
          {
            basedBBox: screenContainer,
            duration: 300,
          }
        );

        mTimeline.animate(tabletBarsEl, [{ rotate: 0 }, { rotate: 90 }], {
          duration: 300,
        });
      },
      { duration: 800 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          navLinksEl,
          [
            {
              x: -0.2,
            },
          ],
          { duration: 100 }
        );

        mTimeline.animate(
          pageInnerEl,
          [
            {
              rotate: 0,
            },
            {
              rotate: -90,
            },
          ],
          {
            duration: 100,
          }
        );

        mTimeline.animate(
          pageContentColumn0El,
          [
            {
              x: 0.8,
              y: 0,
              scale: 1,
            },
            {
              x: 4.2,
              y: 1.7,
              scale: 1.8,
            },
          ],
          {
            duration: 100,
          }
        );

        mTimeline.animate(
          pageContentColumn1El,
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 0,
          }
        );

        mTimeline.animate(
          pageContentColumn2El,
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 0,
          }
        );

        mTimeline.animate(
          logoEl,
          [
            {
              x: 1,
            },
            {
              x: 2.5,
            },
          ],
          {
            duration: 100,
          }
        );
      },
      { duration: 800 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          tabletBarsEl,
          [
            {
              scaleX: 1,
              scaleY: 1,
            },
            {
              scaleX: 0.7,
              scaleY: 0.5,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          tabletBarBottomEl,
          [
            {
              scaleX: 0,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          tabletBarTopEl,
          [
            {
              scaleX: 0,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          pageContentColumn0El,
          [
            {
              scale: 1.6,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          logoEl,
          [
            {
              y: 0,
            },
            {
              y: -0.3,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          navLinksEl,
          [
            {
              y: 0,
            },
          ],
          { duration: 300 }
        );

        mTimeline.animate(
          mainContainerEl,
          [
            {
              scale: 1,
            },
          ],
          {
            duration: 300,
          }
        );

        mTimeline.animate(
          monitorBorderEl,
          [
            {
              strokeWidth: 0.253,
              ry: 0.483,
            },
          ],
          { duration: 300 }
        );

        mTimeline.animate(
          monitorMaskEl,
          [
            {
              ry: 0.483,
            },
          ],
          { duration: 300 }
        );
      },
      { duration: 1300 }
    );

    mTimeline.scene(
      () => {
        mTimeline.reset([tabletBarsEl], { duration: 0 });

        mTimeline.reset(
          [
            pageContentColumn0El,
            pageContentColumn1El,
            pageContentColumn2El,
            logoEl,
            navLinksEl,
            navLink0El,
            navLink1El,
            navLink2El,
            pageChatEl,
            desktopStandEl,
            pageInnerEl,
          ],
          { duration: 400 }
        );

        mTimeline.animate(
          mainContainerEl,
          [
            {
              y: -1,
              scale: 1.6,
              rotate: 0,
            },
          ],
          {
            duration: 400,
            easing: "ease-in",
          }
        );
      },
      { duration: 800 }
    );
  };

  mTimeline.svg = target;
  mTimeline.interactivity = interactivity;
  // start();
  // loop();
  mTimeline.start = start;
  mTimeline.loop = loop;
  mTimeline.play();
};

export const responsiveEnd = ({ mTimeline }: { mTimeline: MainTimeline }) => {
  mTimeline.stop();
};
