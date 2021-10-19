import { debounce } from "lodash-es";
import { createEffect, createSignal, onMount, useContext } from "solid-js";
import {
  animateDuplicatedPath,
  createDuplicatedPaths,
  hideFullNameLetterCombo,
} from "../../components/svg/logos/Fullname/animation";
import FullnameLogo from "../../components/svg/logos/Fullname/FullnameLogo";
import { GlobalContext } from "../../context/context";
import useMatchMedia from "../../hooks/useMatchMedia";

export type TLogoPath = HTMLElement;

/**
 * Problem in Mobile: When selecting hero icon, it jitters while shadow animation is moving due to bloated shadow mask
 *
 * Solution:
 * 1. when selecting hero icon and no other icons are running, pause hero icon, and then run after shadow animation is done.
 * 2. When selecting hero icon and other icon is running, don't move shadow.
 * 3. When selection outside hero icon to close hero icon animation, run shadow animation after hero icon animation is done
 */

const AboutMeLogo = () => {
  const [context, { setHero }] = useContext(GlobalContext);
  const [animationReady, setAnimationReady] = createSignal(false);

  const { minWidth_400 } = useMatchMedia();

  let hasCalcBCR = false;
  let bcr!: DOMRect;
  let svgEl!: HTMLElement;
  let paths: TLogoPath[];
  let deltaSize = 15;
  let sentinelHeroAnimationEl!: HTMLDivElement;
  let addedEventsListeners = false;
  let touchstartFired = false;

  const getBCR = () => {
    if (hasCalcBCR) return bcr;

    hasCalcBCR = true;
    bcr = svgEl.getBoundingClientRect();
    return bcr;
  };

  const getPositionAndAnimate = (
    x: number,
    y: number,
    transition?: boolean
  ) => {
    if (!animationReady) return;

    if (transition && touchstartFired) {
      touchstartFired = false;
      paths.forEach((path) => (path.style.transition = "transform 350ms"));

      setTimeout(() => {
        paths.forEach((path) => (path.style.transition = ""));
      }, 400);
    }

    const bcr = getBCR();
    const midX = bcr.width / 2;
    const midY = bcr.height / 2;
    const deltaX = x - bcr.left - midX;
    const deltaY = y - bcr.top - midY;

    animateDuplicatedPath({ deltaX, deltaY, paths, deltaSize });
  };

  const onMousemove = (e: MouseEvent) => {
    getPositionAndAnimate(e.clientX, e.clientY, true);
  };

  const onTouchmove = (e: TouchEvent) => {
    const touch = e.touches[0] || e.changedTouches[0];

    getPositionAndAnimate(touch.clientX, touch.clientY);
  };

  const onTouchStart = () => {
    touchstartFired = true;
  };

  const createIntersectionObserver = () => {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        setHero({ active: isVisible });
      });
    });
  };

  const addHeroEvents = () => {
    if (addedEventsListeners) return;
    addedEventsListeners = true;

    document.body.addEventListener("mousemove", onMousemove);
    document.body.addEventListener("touchstart", onTouchStart);
    document.body.addEventListener("touchmove", onTouchmove, { passive: true });
  };
  const removeHeroEvents = () => {
    document.body.removeEventListener("touchstart", onTouchStart);
    document.body.removeEventListener("mousemove", onMousemove);
    document.body.removeEventListener("touchmove", onTouchmove);
  };

  onMount(() => {
    const observer = createIntersectionObserver();
    observer.observe(sentinelHeroAnimationEl);

    deltaSize = minWidth_400.matches ? 15 : devicePixelRatio;

    minWidth_400.addEventListener("change", (e) => {
      deltaSize = e.matches ? 15 : devicePixelRatio;
    });

    window.addEventListener(
      "resize",
      debounce(
        () => {
          bcr = svgEl.getBoundingClientRect();
        },
        100,
        { trailing: true }
      )
    );

    const generate = () => {
      if (paths) return;

      paths = createDuplicatedPaths(svgEl);
      hideFullNameLetterCombo();
      setAnimationReady(true);
    };

    document.body.addEventListener("mousemove", function init() {
      generate();
      document.body.removeEventListener("mousemove", init);
    });

    document.body.addEventListener("touchmove", function init() {
      generate();
      document.body.removeEventListener("touchmove", init);
    });
  });

  createEffect(() => {
    if (animationReady()) {
      setAnimationReady(false);
      addHeroEvents();
    }

    if (
      context.hero.active &&
      context.hero.shadowActive &&
      !context.blog.active
    ) {
      addHeroEvents();

      if (context.hero.clientCoordinates.x) {
        const { x, y } = context.hero.clientCoordinates;
        touchstartFired = true;
        getPositionAndAnimate(x, y!, true);
      }
    } else {
      addedEventsListeners = false;
      removeHeroEvents();
    }
  });

  return (
    <h1 id="about-me-logo" class="about-me-logo" tabindex="-1">
      <span class="sr-only">Caleb Taylor</span>
      <div
        class="sentinel-hero-animation"
        aria-hidden="true"
        ref={sentinelHeroAnimationEl}
      ></div>
      <FullnameLogo ref={svgEl}></FullnameLogo>
    </h1>
  );
};

export default AboutMeLogo;
