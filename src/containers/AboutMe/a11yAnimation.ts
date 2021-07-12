import { MainTimeline, TInteractivity } from "./animateProjectPromise";

const msg = ["Hi", "is", "it", "ok", "to", "be", "an", "ai", "or", "no"];
let msgIdx = 0;

type TColors = {
  rgb: string;
  p: string;
  d: string;
  t: string;
  a: string;
};
// the svg filters that I used don't work in Safari, results in blank graphic. Instead hard-coded colors from a map, it's doable because there's not a lot of colors
const graphic = {
  text: {
    rgb: "#a52c2c",
    p: "#3e3a2b",
    d: "#584e2b",
    t: "#c4232d",
    a: "#464646",
  },
  greenDark: {
    rgb: "green",
    p: "#876500",
    d: "#6e5606",
    t: "#007758",
    a: "#5c5c5c",
  },
  greenLight: {
    rgb: "#8fff8f",
    p: "#ffe78a",
    d: "#efda94",
    t: "#86f7dc",
    a: "#dfdfdf",
  },
  moon: {
    rgb: "#5858ff",
    p: "#3669ff",
    d: "#3260fa",
    t: "#3a718b",
    a: "#646464",
  },
  petal0: {
    rgb: "#d42100",
    p: "#433200",
    d: "#6a5200",
    t: "#ff0e18",
    a: "#454545",
  },
  petal1: {
    rgb: "#ff2d79",
    p: "#3d4d7c",
    d: "#696b74",
    t: "#ff2845",
    a: "#5f5f5f",
  },
  petal2: {
    rgb: "#ff2db5",
    p: "#3153bb",
    d: "#5b6eae",
    t: "#ff3157",
    a: "#636363",
  },
  petal3: {
    rgb: "#fe2dff",
    p: "#225aff",
    d: "#4a71f6",
    t: "#ff3c6e",
    a: "#696969",
  },
};

const interactivity: TInteractivity[] = [
  {
    selector: ".card",
    event: ({ currentTarget }) => {
      const cardTextEls = currentTarget.querySelectorAll(
        ".card-text"
      ) as NodeListOf<HTMLElement>;
      msgIdx = (msgIdx + 1) % msg.length;

      if (Number(cardTextEls[0].style.opacity) < 0.8) return;

      cardTextEls.forEach((cardTextEl) => {
        cardTextEl.textContent = msg[msgIdx];
      });
    },
  },
];

export const a11yAnimation = ({
  target,
  mTimeline,
}: {
  target: HTMLElement;
  mTimeline: MainTimeline;
}) => {
  const query = (s: string): HTMLElement =>
    target.querySelector(s) as HTMLElement;
  const cardEl = query(".card");

  const contrastEndNum = 7;
  const contrastStartNum = 2;
  const cardTextEndColor = "#a52c2c";
  const cardTextStartColor = "#ff9b9b";

  const cardContent = query(".card-content");
  const contrastEl = query(".contrast");
  const talkBubbleEl = query(".talk-bubble");
  const talkBubbleContent = query(".talk-bubble-content");
  const talkBubbleContentMask = query(".talk-bubble-content-mask");
  const talkBubbleRect = query(".talk-bubble-rect");
  const talkBubbleTail = query(".talk-bubble-tail");
  const talkBubbleTailRect = query(".talk-bubble-tail-rect");
  const colorEl = query(".color");
  const contrastSmallFailEl = query(".contrast-small-fail");
  const contrastLargeFailEl = query(".contrast-large-fail");
  const contrastSmallSuccessEl = query(".contrast-small-success");
  const contrastLargeSuccessEl = query(".contrast-large-success");
  const contrastTextEl = query(".contrast-text");
  const cardTextEl = query(".card-text");
  const rgbEl = query(".rgb");
  const rgbREl = query(".rgb-r");
  const rgbGEl = query(".rgb-g");
  const rgbBEl = query(".rgb-b");
  const blockREl = query(".block-r");
  const blockGEl = query(".block-g");
  const blockBEl = query(".block-b");
  const personEl = query(".person");
  const moonEl = query(".moon");
  const flowerClosedBudEl = query(".flower-closed-bud");
  const flowerPetal0 = query(".flower-petal-0");
  const flowerPetal1 = query(".flower-petal-1");
  const flowerPetal2 = query(".flower-petal-2");
  const flowerPetal3 = query(".flower-petal-3");
  const flowerLeaf0El = query(".flower-leaf-0");
  const leafLight0 = query(".leaf-light-0");
  const leafDark0 = query(".leaf-dark-0");
  const flowerLeaf1El = query(".flower-leaf-1");
  const leafLight1 = query(".leaf-light-1");
  const leafDark1 = query(".leaf-dark-1");
  const flowerStemEl = query(".flower-stem");
  const personContainerEl = query(".person-container");

  const graphicElColorMap: [HTMLElement, TColors, boolean?][] = [
    [moonEl, graphic.moon],
    [cardTextEl, graphic.text],
    [flowerStemEl, graphic.greenDark, true],
    [leafDark0, graphic.greenDark],
    [leafDark1, graphic.greenDark],
    [leafLight0, graphic.greenLight],
    [leafLight1, graphic.greenLight],
    [flowerPetal0, graphic.petal0],
    [flowerPetal1, graphic.petal1],
    [flowerPetal2, graphic.petal2],
    [flowerPetal3, graphic.petal3],
  ];

  const emulateVision = (
    type:
      | "protanopia"
      | "deuteranopia"
      | "tritanopia"
      | "achromatopsia"
      | "none",
    transition: boolean = true
  ) => {
    const getColorProp = (): keyof TColors => {
      switch (type) {
        case "protanopia":
        case "deuteranopia":
        case "tritanopia":
        case "achromatopsia":
          return type[0] as keyof TColors;
        default:
          return "rgb";
      }
    };

    const colorProp = getColorProp();

    graphicElColorMap.forEach((items) => {
      const [el, colors, changeStroke] = items;
      const styleColorProp = changeStroke ? "stroke" : "fill";

      el.style[styleColorProp] = colors[colorProp];

      if (transition) {
        el.style.transition = `${styleColorProp} 1500ms`;
      } else {
        el.style.transition = "";
      }
    });
  };

  const resetStyles = () => {
    contrastTextEl.textContent = contrastStartNum.toFixed(1);
    colorEl.style.fill = cardTextStartColor;
    cardTextEl.style.fill = cardTextStartColor;
    cardTextEl.style.transition = "";
    colorEl.style.transition = "";

    rgbREl.style.fill = "";
    rgbGEl.style.fill = "";
    rgbBEl.style.fill = "";
  };

  const start = () => {
    emulateVision("none", false);

    mTimeline.scene(
      () => {
        mTimeline.animate(
          cardEl,
          [
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 500,
          }
        );
        mTimeline.animate(
          personContainerEl,
          [
            {
              scale: 1,
              x: 0,
              y: 0,
            },
            {
              scale: 0.25,
              x: 0.325,
              y: 0.755,
            },
          ],
          {
            duration: 500,
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
              x: -45,
            },
          ],
          {
            duration: 500,
          }
        );
      },
      { duration: 500 }
    );

    mTimeline.scene(
      () => {
        const duration = 500;

        mTimeline.animate(
          flowerClosedBudEl,
          [
            {
              scale: 0,
              y: 1.8,
            },
            {
              scale: 0.8,
              y: 1.8,
            },
            {
              scale: 1,
              y: 0,
            },
          ],
          {
            duration,
          }
        );

        mTimeline.animate(
          flowerStemEl,
          [
            {
              scaleY: 0,
            },
            {
              scaleY: 1,
            },
          ],
          {
            duration,
            origin: "bottom",
            delay: 100,
          }
        );

        mTimeline.animate(
          moonEl,
          [
            {
              scale: 0,
            },
            {
              scale: 1,
            },
          ],
          {
            duration,
          }
        );
        mTimeline.animate(
          flowerLeaf0El,
          [
            {
              scale: 0,
              rotate: 0,
            },
            {
              scale: 1,
              rotate: -35,
            },
          ],
          {
            duration,
            delay: duration - 100,
            origin: "left",
          }
        );
        mTimeline.animate(
          flowerLeaf1El,
          [
            {
              scale: 0,
              rotate: 0,
              y: 0,
            },
            {
              scale: 1,
              y: 0.1,
              rotate: 25,
            },
          ],
          {
            duration,
            delay: duration - 100,
            origin: "right",
          }
        );
      },
      { duration: 1000 }
    );

    mTimeline.scene(
      () => {
        cardTextEl.style.fill = cardTextStartColor;

        mTimeline.animate(
          cardTextEl,
          [
            {
              opacity: 0,
            },
            {
              opacity: 1,
            },
          ],
          {
            duration: 500,
            delay: 500,
          }
        );

        mTimeline.animate(
          personContainerEl,
          [
            {
              x: 0.556,
            },
          ],
          {
            duration: 100,
          }
        );

        mTimeline.animate(
          personEl,
          [
            {
              rotate: 0,
              x: 0,
            },
            {
              rotate: -20,
              x: 4.8,
            },
          ],
          { duration: 500 }
        );
      },
      { duration: 1400 }
    );
  };

  const loop = () => {
    mTimeline.scene(
      () => {
        mTimeline.animate(
          target,
          [
            {
              x: -55,
            },
          ],
          {
            duration: 500,
          }
        );

        mTimeline.animate(
          cardEl,
          [
            {
              x: 0,
            },
            {
              x: 2.25,
            },
          ],
          {
            duration: 500,
          }
        );

        mTimeline.animate(
          talkBubbleEl,
          [
            {
              opacity: 0,
              x: 0,
            },
            {
              opacity: 1,
              x: -1,
            },
          ],
          {
            delay: 200,
            duration: 500,
          }
        );

        mTimeline.animate(
          talkBubbleTail,
          [
            {
              scaleX: 0,
            },
            {
              scaleX: 1,
            },
          ],
          {
            origin: "left",
            delay: 500,
            duration: 500,
          }
        );
        mTimeline.animate(
          talkBubbleTailRect,
          [
            {
              scaleX: 1,
              x: 0,
            },
            {
              scaleX: 1.75,
              x: 0.01,
            },
          ],
          {
            origin: "right",
            delay: 600,
            duration: 500,
          }
        );
      },
      { duration: 950 }
    );

    mTimeline.scene(
      () => {
        cardTextEl.style.fill = cardTextEndColor;
        colorEl.style.fill = cardTextEndColor;
        cardTextEl.style.transition = "fill 2000ms";
        colorEl.style.transition = "fill 2000ms";

        const animateChecks = (
          failEl: Element,
          sucessEl: Element,
          delay: number
        ) => {
          // stroke-dasharray=".69"
          const successCheckStroke = sucessEl.querySelector(
            ".success-check"
          ) as HTMLElement;
          const strokeDashoffset = 0.69;
          successCheckStroke.style.strokeDashoffset =
            strokeDashoffset.toString();

          mTimeline.animate(
            successCheckStroke,
            [
              {
                strokeDashoffset,
              },
              {
                strokeDashoffset: 0,
              },
            ],
            { duration: 300, delay: delay + 200 }
          );

          mTimeline.animate(
            failEl,
            [
              {
                opacity: 1,
              },
              {
                opacity: 0,
              },
            ],
            { duration: 200, delay }
          );

          mTimeline.animate(
            sucessEl,
            [
              {
                opacity: 0,
              },
              {
                opacity: 1,
              },
            ],
            { duration: 200, delay }
          );
        };

        mTimeline.countAnimation({
          el: contrastTextEl,
          duration: 2000,
          startNum: contrastStartNum,
          endNum: contrastEndNum,
          fixed: 1,
        });

        animateChecks(contrastSmallFailEl, contrastSmallSuccessEl, 800);
        animateChecks(contrastLargeFailEl, contrastLargeSuccessEl, 1800);
      },
      { duration: 3000 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          talkBubbleRect,
          [
            {
              attrX: 3.556,
              width: 1.742,
            },
          ],
          { duration: 500, easing: "ease-in" }
        );

        mTimeline.animate(
          talkBubbleContent,
          [
            {
              x: 0,
            },
            {
              x: 2.5,
            },
          ],
          { duration: 500, easing: "ease-in" }
        );

        mTimeline.animate(
          contrastEl,
          [
            {
              opacity: 0,
            },
          ],
          { duration: 300, delay: 200 }
        );
      },
      { duration: 500 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(talkBubbleRect, null, { duration: 500 });

        mTimeline.animate(talkBubbleContent, null, { duration: 500 });

        mTimeline.animate(
          rgbEl,
          [
            {
              opacity: 0,
              x: 0,
            },
            {
              opacity: 1,
              x: 0.3,
            },
          ],
          { duration: 400 }
        );
      },
      { duration: 1000 }
    );

    const animateRGBTitle = ({
      reset,
      set,
    }: {
      set?: HTMLElement[][];
      reset?: HTMLElement[][];
    }) => {
      if (set) {
        set.forEach((els) => {
          const [rgbEl, blockEl] = els;

          rgbEl.style.fill = "#b3b3b3";
          rgbEl.style.transition = "fill 250ms";

          mTimeline.animate(
            blockEl,
            [
              {
                strokeDashoffset: 0,
              },
            ],
            { duration: 500 }
          );
        });
      }

      if (!reset) return;

      reset.forEach((els) => {
        const [rgbEl, blockEl] = els;

        const fill = rgbEl.getAttribute("fill")!;
        rgbEl.style.fill = fill;

        mTimeline.animate(blockEl, null, { duration: 500 });
      });
    };

    mTimeline.scene(
      () => {
        emulateVision("protanopia");
        animateRGBTitle({ set: [[rgbREl, blockREl]] });
      },
      { duration: 1800 }
    );

    mTimeline.scene(
      () => {
        emulateVision("deuteranopia");
        animateRGBTitle({
          set: [[rgbGEl, blockGEl]],
          reset: [[rgbREl, blockREl]],
        });
      },
      { duration: 1800 }
    );

    mTimeline.scene(
      () => {
        emulateVision("tritanopia");
        animateRGBTitle({
          set: [[rgbBEl, blockBEl]],
          reset: [[rgbGEl, blockGEl]],
        });
      },
      { duration: 1800 }
    );

    mTimeline.scene(
      () => {
        emulateVision("achromatopsia");
        animateRGBTitle({
          set: [
            [rgbREl, blockREl],
            [rgbGEl, blockGEl],
          ],
        });
      },
      { duration: 1800 }
    );

    mTimeline.scene(
      () => {
        mTimeline.animate(
          target,
          [
            {
              x: -45,
            },
          ],
          {
            duration: 400,
          }
        );
        mTimeline.animate(talkBubbleEl, [{ opacity: 0 }], {
          duration: 380,
          delay: 100,
        });
        mTimeline.animate(talkBubbleRect, [{ width: 2.042 }], {
          duration: 400,
        });
        mTimeline.animate(cardEl, [{ x: 0 }], { duration: 400 });
        mTimeline.animate(talkBubbleTail, [{ x: -2.2 }], { duration: 400 });
        mTimeline.animate(talkBubbleContentMask, [{ x: -2.2 }], {
          duration: 400,
        });
      },
      { duration: 400 }
    );

    mTimeline.scene(
      () => {
        emulateVision("none");
        setTimeout(() => {
          cardTextEl.style.fill = cardTextStartColor;
        });

        mTimeline.reset(
          [
            talkBubbleEl,
            talkBubbleContent,
            talkBubbleContentMask,
            talkBubbleRect,
            talkBubbleTail,
            talkBubbleTailRect,
            contrastEl,
            contrastSmallFailEl,
            contrastSmallSuccessEl,
            contrastLargeFailEl,
            contrastLargeSuccessEl,
            rgbEl,
            blockREl,
            blockGEl,
            blockBEl,
          ],
          { duration: 0 }
        );
      },
      { duration: 1800 }
    );
  };

  mTimeline.svg = target;
  mTimeline.resetStyles = resetStyles;
  mTimeline.interactivity = interactivity;
  mTimeline.start = start;
  mTimeline.loop = loop;
  mTimeline.play();
};

export const a11yEnd = ({ mTimeline }: { mTimeline: MainTimeline }) => {
  mTimeline.stop();
};
