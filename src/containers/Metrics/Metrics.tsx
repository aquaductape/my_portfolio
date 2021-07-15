import { For, JSX, onMount } from "solid-js";
import {
  fusionCharts,
  inkscape,
  solidJS,
} from "../../components/svg/icons/animated-icons";
import { Percentage } from "../../components/svg/icons/icons";
import { MainTimeline } from "../AboutMe/animateProjectPromise";

const Metrics = () => {
  const madeWithItems: {
    icon?: (id: number) => JSX.Element;
    text: string;
    link?: string;
  }[] = [
    {
      text: "Solid",
      icon: solidJS,
      link: "https://www.solidjs.com/",
    },
    {
      text: "FusionCharts",
      icon: fusionCharts,
      link: "https://www.fusioncharts.com/",
    },
    {
      text: "Inkscape",
      icon: inkscape,
      link: "https://inkscape.org/",
    },
    {
      text: "Animations - from scratch!",
    },
    {
      text: "ScrollSpy - from scratch!",
    },
  ];

  // const statsItems: {
  //   text: string;
  //   aria?: string;
  //   hasIcon?: boolean;
  //   lightHouseInfo?: boolean;
  // }[] = [
  //   {
  //     text: "Performance",
  //     hasIcon: true,
  //     aria: "score is 100 out of 100",
  //   },
  //   {
  //     text: "Accessibility",
  //     hasIcon: true,
  //     aria: "score is 100 out of 100",
  //   },
  //   {
  //     text: "Best Practices",
  //     hasIcon: true,
  //     aria: "score is 100 out of 100",
  //   },
  //   {
  //     text: "SEO",
  //     hasIcon: true,
  //     aria: "score is 100 out of 100",
  //     lightHouseInfo: true,
  //   },
  //   {
  //     text: "2.3 MB upon initial page load",
  //   },
  //   {
  //     text: "142 files",
  //   },
  // ];
  let id = 1;

  let sentinelEl!: HTMLDivElement;
  let statsEl!: HTMLDivElement;

  const animatePercentage = (el: Element, timeline: MainTimeline) => {
    const percentProgressBar = el.querySelector(".percent-progress-bar")!;
    const percentText = el.querySelector(".percent-text")!;

    timeline.animate(
      percentProgressBar,
      [
        {
          strokeDashoffset: 16.97,
        },
        {
          strokeDashoffset: 0,
        },
      ],
      { duration: 2000 }
    );

    timeline.countAnimation({
      el: percentText,
      startNum: 0,
      endNum: 100,
      duration: 1000,
    });
  };

  onMount(() => {
    let timeline = new MainTimeline("metrics");

    const observer = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        // debugger;
        if (entry.boundingClientRect.top > entry.rootBounds!.height * 0.8) {
          return;
        }

        if (!entry.isIntersecting) {
          const statIcons = statsEl.querySelectorAll(".list-icon")!;
          statIcons.forEach((statIcon, idx) => {
            setTimeout(() => {
              animatePercentage(statIcon, timeline);
            }, 1000 * idx);

            if (idx >= statIcons.length - 1) {
              // cleanup
              setTimeout(() => {
                // @ts-ignore
                timeline = null;
              }, 1000 * idx + 8000);
            }
          });
          observer.disconnect();
          return;
        }
      }
    });

    observer.observe(sentinelEl);
  });

  return (
    <section>
      <div className="metrics">
        <div className="sentinel" ref={sentinelEl}></div>
        <div className="made-with">
          <h3 class="section-title-3">Made with</h3>
          <ul>
            <For each={madeWithItems}>
              {({ text, icon, link }) => {
                return (
                  <li class="list">
                    <div className="list-inner">
                      {icon && <span class="list-icon">{icon(id)}</span>}
                      <span class="list-text">
                        {link ? (
                          <a href={link} target="_blank">
                            {text}
                          </a>
                        ) : (
                          text
                        )}
                      </span>
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>

        {/* <div className="stats" ref={statsEl}>
          <h3 class="section-title-3">Stats</h3>
          <ul>
            <For each={statsItems}>
              {({ text, hasIcon, aria }) => {
                return (
                  <li class="list">
                    <div className="list-inner">
                      {hasIcon && (
                        <span class="list-icon">
                          <Percentage></Percentage>
                        </span>
                      )}
                      <span class="list-text">
                        {text}
                        {aria && <span class="sr-only">{" " + aria}</span>}
                      </span>
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </div> */}
      </div>
    </section>
  );
};

export default Metrics;
