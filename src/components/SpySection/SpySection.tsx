import { JSX, onMount, useContext } from "solid-js";
import CONSTANTS from "../../constants";
import { setUrlHash } from "../../containers/NavigationBar/Links";
import { GlobalContext, TGlobalContext } from "../../context/context";
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
  const [context, { setHeader }] = globalContext;
  entries.forEach((entry) => {
    if (context.smoothScroll.active || context.blog.active) return;

    const { rootBounds, boundingClientRect, target } = entry;
    if (boundingClientRect.top / rootBounds?.height! > 0.5) return;

    const targetId = (target as HTMLElement).dataset.hash!;
    const targetHasNavLink = (target as HTMLElement).dataset.navLink!;
    const links = CONSTANTS.links;

    if (targetId === "about-me") {
      setHeader({ activeLink: null });
      setUrlHash({ id: null });
      return;
    }

    if (!links.includes(targetId)) return;

    if (context.header.activeLink === targetId) return;
    setUrlHash({ id: targetId });
    setHeader({ activeLink: targetId });
  });
};

const observer = isBrowser
  ? new IntersectionObserver(callback)
  : ({} as IntersectionObserver);
let currentId = "";
let init = true;
let globalContext: TGlobalContext;

const SpySection = ({
  children,
  hash,
  hasNavLink,
  sentinelTop,
}: SpySectionProps) => {
  globalContext = useContext(GlobalContext);
  let sentinelRef!: HTMLDivElement;
  const sentinelStyle: JSX.CSSProperties = {
    position: "absolute",
    top: sentinelTop ? `${sentinelTop}px` : null,
  };

  onMount(() => {
    observer.observe(sentinelRef);
  });

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
