import { TLogoPath } from "../../../../containers/AboutMe/AboutMeLogo";
import { round } from "../../../../utils";

const numberOfNodes = 30;

export const createDuplicatedPaths = (svgEl: HTMLElement) => {
  const fullNameShadowEl = svgEl.querySelector(
    ".fullname-shadow"
  ) as HTMLElement;
  const fullNameShadowBgContainer = svgEl.querySelector(
    ".fullname-shadow-bg-container"
  ) as HTMLElement;
  let firstEl = fullNameShadowEl.firstElementChild as HTMLElement;

  const transition = "transform 250ms";
  const paths = Array.from({ length: numberOfNodes }, (_, idx) => {
    if (idx === 0) {
      return firstEl;
    }
    const clone = firstEl.cloneNode(true) as HTMLElement;
    clone.style.transition = transition;
    return clone;
  });

  fullNameShadowBgContainer.style.opacity = "1";

  paths.forEach((path) => {
    fullNameShadowEl.appendChild(path);
  });

  setTimeout(() => {
    paths.forEach((path) => (path.style.transition = ""));
  }, 800);

  return paths;
};

let stutter = 0;
let disableStutter = false;
let revertActive = false;
let stutterTimeoutId = null as unknown as number;
let disabledCounter = 0;
const genRandomCounterMax = () => Math.random() * 300 + 100;
let randomCounterMax = genRandomCounterMax();

const stutterRevert = ({
  max,
  paths,
  steps,
  x,
  y,
}: {
  x: number;
  y: number;
  paths: TLogoPath[];
  steps: number;
  max: number;
}) => {
  stutter -= 0.5;
  revertActive = true;

  animatePaths({ max, paths, steps, x, y });

  if (stutter <= 0) {
    stutter = 0;
    disabledCounter = 0;
    revertActive = false;
    return;
  }
  requestAnimationFrame(() => stutterRevert({ max, paths, steps, x, y }));
};

const animateStutter = ({
  max,
  paths,
  steps,
  x,
  y,
}: {
  x: number;
  y: number;
  paths: TLogoPath[];
  steps: number;
  max: number;
}) => {
  disabledCounter++;

  if (disabledCounter <= randomCounterMax) {
    return;
  }

  if (disableStutter || revertActive) {
    return;
  }

  stutter += 0.5;

  window.clearTimeout(stutterTimeoutId);
  stutterTimeoutId = window.setTimeout(() => {
    paths.forEach((path) => (path.style.transition = "transform 250ms"));

    randomCounterMax = genRandomCounterMax();
    stutterRevert({ max, paths, steps, x, y });

    setTimeout(() => {
      paths.forEach((path) => (path.style.transition = ""));
    }, 1200);
  }, 500);

  if (stutter >= 25) {
    revertActive = true;
  }
};

export const animateDuplicatedPath = ({
  deltaX,
  deltaY,
  paths,
  deltaSize,
}: {
  deltaX: number;
  deltaY: number;
  paths: TLogoPath[];
  deltaSize: number;
}) => {
  const max = numberOfNodes;

  deltaX = Math.ceil(deltaX / deltaSize);
  deltaY = Math.ceil(deltaY / deltaSize);

  const deltaXBigger = Math.abs(deltaX) > Math.abs(deltaY);
  let biggerDelta = Math.abs(deltaXBigger ? deltaX : deltaY);
  let smallerDelta = Math.abs(!deltaXBigger ? deltaX : deltaY);

  if (biggerDelta >= max) {
    smallerDelta = smallerDelta / (biggerDelta / max);
    biggerDelta = max;
  }
  const steps = biggerDelta;

  const xStarting = deltaXBigger
    ? round(Math.sign(deltaX) / 5, 4)
    : round((Math.sign(deltaX) * (smallerDelta / biggerDelta)) / 5, 4);
  const yStarting = !deltaXBigger
    ? round(Math.sign(deltaY) / 5, 4)
    : round((Math.sign(deltaY) * (smallerDelta / biggerDelta)) / 5, 4);

  animatePaths({ max, paths, steps, x: xStarting, y: yStarting });

  animateStutter({ max, paths, steps, x: xStarting, y: yStarting });
};

const animatePaths = (props: {
  x: number;
  y: number;
  paths: TLogoPath[];
  steps: number;
  max: number;
}) => {
  const { max, steps, x: xStarting, y: yStarting, paths } = props;
  let x = xStarting;
  let y = yStarting;

  for (let i = 1; i <= max - stutter; i++) {
    if (i <= steps) {
      x += xStarting;
      y += yStarting;
    }

    const path = paths[i - 1];

    if (path) {
      path.style.transform = `translate(${x}px, ${y}px)`;
    }
  }
};

export const hideFullNameLetterCombo = () => {
  const el = document.querySelector(".full-name-letter-combo") as HTMLElement;
  el.style.transform = "scaleX(0)";
  el.style.transformOrigin = "left";
  el.style.transformBox = "fill-box";
  el.style.transition = "transform 800ms 100ms";
};
