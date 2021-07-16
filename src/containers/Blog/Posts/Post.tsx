import { onMount, useContext } from "solid-js";
import S_Link from "../../../components/S_Link/S_Link";
import { GlobalContext, TGlobalContext } from "../../../context/context";
import { isBrowser } from "../../../utils";
import smoothScrollTo from "../../../utils/smoothScrollTo";
import style from "./Post.module.scss";

const videoMap = new Map<Element, { init: boolean }>();
const observerVideoCb: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    const result = videoMap.get(entry.target);

    if (!result) return;

    const { init } = result;
    const videoEl = entry.target as HTMLVideoElement;

    if (!init) {
      result.init = true;
      return;
    }

    try {
      if (!entry.isIntersecting) {
        videoEl.pause();
        return;
      }
      videoEl.play();
    } catch (err) {}
  });
};

const videoObserver = isBrowser
  ? new IntersectionObserver(observerVideoCb, {
      rootMargin: "250px 0px 250px 0px",
    })
  : ({} as IntersectionObserver);

export const Video = ({ src }: { src: string }) => {
  let videoElRef!: HTMLVideoElement;

  onMount(() => {
    videoMap.set(videoElRef, { init: false });
    videoObserver.observe(videoElRef);
  });

  return (
    <div className={style["video-container"]}>
      <video
        ref={videoElRef}
        muted
        loop
        controls
        playsinline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export const ImgContainer = ({
  alt,
  styleSize,
  src,
}: {
  src: string;
  alt: string;
  styleSize?: "xs-small" | "small" | "medium";
}) => {
  return (
    <div
      className={`${style["img-container"]} ${
        styleSize ? style[`media-${styleSize}`] : ""
      }`}
    >
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
};

export const HyperLink = ({
  text,
  href = "javascript: void(0)",
  anchorId,
}: {
  text: string;
  href?: string;
  anchorId?: string;
}) => {
  const [_, { setTableOfContents, setSmoothScroll }] =
    useContext(GlobalContext);

  const onClick = (e: MouseEvent) => {
    if (!anchorId) return;

    e.preventDefault();
    anchorId = anchorId.trim().toLowerCase().replace(/\s/g, "-");

    setSmoothScroll({ active: true });
    setTableOfContents({
      dropdownActive: false,
      anchorId: anchorId,
    });

    const el = document.querySelector(
      `[data-anchor="${anchorId}"]`
    ) as HTMLElement;
    const blogNavHeight = 50;
    const mainHeaderHeight = 58;
    const margin = 30;
    const padding = (blogNavHeight + mainHeaderHeight + margin) * -1;

    smoothScrollTo({
      destination: el,
      duration: 500,
      padding,
      onEnd: () => {
        el.focus();
        setSmoothScroll({ active: false });
      },
    });
  };
  return (
    <S_Link>
      <span>
        {text[0] === " " ? " " : ""}
        <a class={style["hyperlink"]} href={href} onClick={onClick}>
          {text.trim()}
        </a>
        {text[text.length - 1] === " " ? " " : ""}
      </span>
    </S_Link>
  );
};

const headingMap = new Set<Element>();

const observerHeadingCb: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    const [context, { setTableOfContents }] = globalContext;
    if (!headingsMounted) return;

    if (context.smoothScroll.active) return;
    const result = headingMap.has(entry.target);

    if (!result) return;

    const anchorId = (entry.target as HTMLElement).dataset.anchor;

    if (entry.boundingClientRect.top > entry.rootBounds!.height * 0.8) {
      return;
    }

    setTableOfContents({ anchorId });
  });
};

const headingObserver = isBrowser
  ? new IntersectionObserver(observerHeadingCb)
  : ({} as IntersectionObserver);

let globalContext: TGlobalContext;
let headingsMounted = false;
let headingMountingTimerId = 0;

const Heading = ({
  level,
  text,
}: {
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5";
}) => {
  globalContext = useContext(GlobalContext);
  const dataAttr = text.trim().toLowerCase().replace(/\s/g, "-");
  let headingSentinel!: HTMLDivElement;

  onMount(() => {
    window.clearTimeout(headingMountingTimerId);
    headingMountingTimerId = window.setTimeout(() => {
      headingsMounted = true;
    }, 300);
    headingsMounted = false;
    headingMap.add(headingSentinel);
    headingObserver.observe(headingSentinel);
  });

  switch (level) {
    case "h1":
      return (
        <h1 data-anchor={dataAttr} tabIndex={-1}>
          <div
            ref={headingSentinel}
            tabIndex={-1}
            class={style["heading-sentinel"]}
          ></div>
          {text}
        </h1>
      );
    case "h2":
      return (
        <h2 data-anchor={dataAttr} tabIndex={-1}>
          <div
            ref={headingSentinel}
            data-anchor={dataAttr}
            class={style["heading-sentinel"]}
          ></div>
          {text}
        </h2>
      );
    case "h3":
      return (
        <h3 data-anchor={dataAttr} tabIndex={-1}>
          <div
            ref={headingSentinel}
            data-anchor={dataAttr}
            tabIndex={-1}
            class={style["heading-sentinel"]}
          ></div>
          {text}
        </h3>
      );
    case "h4":
      return (
        <h4 data-anchor={dataAttr} tabIndex={-1}>
          <div
            ref={headingSentinel}
            data-anchor={dataAttr}
            tabIndex={-1}
            class={style["heading-sentinel"]}
          ></div>
          {text}
        </h4>
      );
    case "h5":
      return (
        <h5 data-anchor={dataAttr} tabIndex={-1}>
          <div
            ref={headingSentinel}
            data-anchor={dataAttr}
            tabIndex={-1}
            class={style["heading-sentinel"]}
          ></div>
          {text}
        </h5>
      );
  }
};

export const Heading2 = ({ children }: { children: string }) => {
  return Heading({ level: "h2", text: children });
};
export const Heading3 = ({ children }: { children: string }) => {
  return Heading({ level: "h3", text: children });
};
export const Heading4 = ({ children }: { children: string }) => {
  return Heading({ level: "h4", text: children });
};
