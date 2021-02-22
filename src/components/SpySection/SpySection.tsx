import { JSX, onMount, useContext } from "solid-js";
import { GlobalContext, TGlobalState } from "../../context/context";
import { isBrowser } from "../../utils";

type SpySectionProps = {
  hash: string;
  hasNavLink?: boolean;
  children: JSX.Element;
  sentinelTop?: number;
};

const callback: IntersectionObserverCallback = (entries, observer) => {
  if (init) {
    init = false;
    return;
  }
  entries.forEach((entry) => {
    if (context.smoothScroll.active) return;

    const { rootBounds, boundingClientRect, target } = entry;
    if (boundingClientRect.top / rootBounds?.height! > 0.5) return;
    const targetId = (target as HTMLElement).dataset.hash!;
    const targetHasNavLink = (target as HTMLElement).dataset.navLink!;

    if (currentId === targetId) return;
    // console.log("pass ", currentId);

    currentId = targetId;
    const prevAnchorEl = document.querySelector(`.nav-list-link.active`);
    let url = `${location.origin}/#${targetId}`;

    if (prevAnchorEl) {
      prevAnchorEl.classList.remove("active");
    }

    if (currentId === "about-me") {
      url = location.origin;
    }

    if (targetHasNavLink) {
      const anchorEl = document.querySelector(
        `.nav-list-link[href="#${currentId}"]`
      );
      if (!anchorEl) return;
      anchorEl.classList.add("active");
    }

    window.history.replaceState("", "", url);
    // console.log(entry.target);
  });
};

const observer = isBrowser
  ? new IntersectionObserver(callback, { threshold: [1] })
  : ({} as IntersectionObserver);
let currentId = "";
let init = true;
let context: TGlobalState;

const SpySection = ({
  children,
  hash,
  hasNavLink,
  sentinelTop,
}: SpySectionProps) => {
  context = useContext(GlobalContext)[0];
  let sentinelRef!: HTMLDivElement;
  onMount(() => {
    if (!isBrowser) return;
    // observer.observe(divRef.querySelector(".section-title")!);
    observer.observe(sentinelRef);
  });
  const sentinelStyle: JSX.CSSProperties = {
    position: "absolute",
    top: sentinelTop ? `${sentinelTop}px` : null,
  };
  return (
    <div style={{ position: "relative" }}>
      <div
        className="sentinel"
        style={sentinelStyle}
        data-hash={hash}
        data-nav-link={hasNavLink}
        ref={sentinelRef}
      ></div>
      {children}
    </div>
  );
};

export default SpySection;
