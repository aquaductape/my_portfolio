export const flip = (
  inputs: {
    firstEl: HTMLElement | DOMRect;
    lastEl: HTMLElement;
    scale?: boolean;
    translateOnly?: "x" | "y";
    hideFirstEl?: boolean;
    endKeyframe?: string;
    commitStyles?: boolean;
  }[],
  { enableCache = true }: { enableCache?: boolean } = {}
) => {
  const cache = new Map<HTMLElement, DOMRect>();

  const run = ({
    firstEl,
    lastEl,
    translateOnly,
    hideFirstEl = true,
    scale = true,
    endKeyframe = "none",
    commitStyles = false,
  }: {
    firstEl: HTMLElement | DOMRect;
    lastEl: HTMLElement;
    scale?: boolean;
    translateOnly?: "x" | "y";
    hideFirstEl?: boolean;
    endKeyframe?: string;
    commitStyles?: boolean;
  }) => {
    const getBCR = (el: HTMLElement) => {
      if (!enableCache) return el.getBoundingClientRect();
      const result = cache.get(el);
      if (result) return result;

      const elBCR = el.getBoundingClientRect();
      cache.set(el, elBCR);
      return elBCR;
    };

    const first = "top" in firstEl ? firstEl : getBCR(firstEl);
    const last = getBCR(lastEl);

    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;

    const translateOnlyVal = () => {
      switch (translateOnly) {
        case "x":
          return `translateX(${deltaX}px)`;
        case "y":
          return `translateY(${deltaY}px)`;
        default:
          return "";
      }
    };

    const translateVal = translateOnly
      ? translateOnlyVal()
      : `translate(${deltaX}px, ${deltaY}px)`;
    const scaleVal = scale ? `scale(${deltaW}, ${deltaH})` : "";

    const transform = `${translateVal} ${scaleVal}`;

    if (hideFirstEl) {
      if (!("top" in firstEl)) {
        firstEl.style.opacity = "0";
      }
    }

    const lastElAnimate = lastEl.animate(
      [
        {
          transformOrigin: "top left",
          transform,
        },
        {
          transformOrigin: "top left",
          transform: endKeyframe,
        },
      ],
      {
        duration: 400,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );

    if (!commitStyles) return;

    lastElAnimate.onfinish = (e) => {
      // @ts-ignore
      lastElAnimate.commitStyles();
      lastElAnimate.cancel();
    };
  };

  inputs.forEach((input) => run(input));
};
