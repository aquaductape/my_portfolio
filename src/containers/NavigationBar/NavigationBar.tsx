import { debounce } from "lodash-es";
import { createSignal, createState, onMount, useContext } from "solid-js";
import MonochromeCircleLogo from "../../components/svg/logos/MonochromeCircleLogo";
import { GlobalContext } from "../../context/context";
import smoothScrollTo from "../../utils/smoothScrollTo";

import Links, { setUrlHash } from "./Links";

const NavigationBar = () => {
  const [context, { setSmoothScroll, setHeader, setBlog }] =
    useContext(GlobalContext);
  const [hasRendered, setHasRendered] = createSignal(true);
  const [navSettings, setNavSettings] = createState({
    navVisible: true,
  });
  let prevWindowScrollY = 0;
  let topPageSentinelElRef!: HTMLDivElement;
  let debounceRef: any = null;
  let onScrollAdded = false;

  const createIntersectionObserver = () => {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const windowScrollY = window.scrollY;
        let isVisible = false;
        if (!onScrollAdded) return;

        if (entry.isIntersecting) {
          isVisible = true;
        }

        if (debounceRef) {
          // @ts-ignore
          debounceRef.cancel();
        }

        prevWindowScrollY = windowScrollY;

        if (context.smoothScroll.active) {
          if (!context.header.visible) {
            setHeader({ shadow: false, visible: true });
          }
          return;
        }

        if (isVisible) {
          setHeader({ shadow: false, visible: true });
          return;
        }
        setHeader({ shadow: false, visible: false });
      });
    });
  };

  const onScrollHeader = () => {
    const windowScrollY = window.scrollY;

    if (context.header.enableShadow) {
      if (windowScrollY <= 90) {
        setHeader({ shadow: false });
      } else {
        setHeader({ shadow: true });
      }
    }

    if (
      !context.header.enableTranslate ||
      context.smoothScroll.active
      // context.smoothScroll.debounceActive
    ) {
      // @ts-ignore
      debounceRef.cancel();
      prevWindowScrollY = windowScrollY;
      return;
    }

    if (hasRendered()) return;

    if (windowScrollY <= 250) return setHeader({ visible: true });
    // if the scroll repeats the same number ignore it
    if (windowScrollY === prevWindowScrollY) return;
    if (windowScrollY > prevWindowScrollY) {
      // scrolling down
      // setToggleHeader(true);
      setHeader({ visible: false });
    } else {
      // scrolling up
      setHeader({ visible: true });
      // setToggleHeader(false);
    }
    prevWindowScrollY = windowScrollY;
  };

  const initOnScrollHeader = () => {
    // sometimes when reloading the page scroll event runs twice
    // timeout prevents that
    setTimeout(() => {
      onScrollAdded = true;

      debounceRef = debounce(onScrollHeader, 200, {
        leading: true,
        trailing: true,
        // maxWait: 1000,
      });

      window.addEventListener(
        "scroll",
        debounceRef,
        // onScrollHeader,
        { passive: true }
      );
    }, 500);
  };

  const hideHeaderCss = () => {
    if (!navSettings.navVisible) return "";

    return !context.header.visible ? "hide" : "";
  };

  const shadowHeaderCss = () => {
    // Since menu slides under from header, it's shadow
    // covers the menu as the header is transitioning out.
    // In order to make menu appear as extension rather than seperate,
    // this new class adds a new transition where the shadow leaves
    // immediately
    if (context.header.shadow && !navSettings.navVisible) return "shadow";
    if (!context.header.visible) return "";

    return context.header.shadow ? "shadow" : "";
  };

  const onClickLogo = (e: MouseEvent) => {
    e.preventDefault();
    setHeader({ activeLink: null });
    setUrlHash({ id: null });

    if (context.blog.active) {
      setBlog({ active: false });
      return;
    }

    setSmoothScroll({ active: true });

    smoothScrollTo({
      container: window,
      destination: 0,
      onEnd: () => {
        setSmoothScroll({ active: false });
      },
    });
  };

  const onFocus = () => {
    setHeader({ visible: true });
    const windowScrollY = window.scrollY || window.pageYOffset;

    if (windowScrollY <= 90) return;
    setHeader({ shadow: true });
  };

  onMount(() => {
    prevWindowScrollY = window.scrollY || window.pageYOffset;
    initOnScrollHeader();
    onScrollHeader();
    setHasRendered(false);
    const observer = createIntersectionObserver();
    observer.observe(topPageSentinelElRef);
  });

  return (
    <header>
      <div class="top-page-sentinel" ref={topPageSentinelElRef}></div>
      <div class={`header-bar ${shadowHeaderCss()} ${hideHeaderCss()}`}>
        <div class="header-bar-inner">
          <a href="#about-me-logo" onFocus={onFocus} class="skip-to-content">
            <div class="skip-to-content__inner">Skip to Main Content</div>
          </a>
          <div class="logo">
            <a
              aria-label="Caleb Taylor: Go to Home Page"
              title="Caleb Taylor"
              href="#homepage"
              onClick={onClickLogo}
              onFocus={onFocus}
            >
              <MonochromeCircleLogo></MonochromeCircleLogo>
            </a>
          </div>

          <div class="nav-desktop">
            <Links></Links>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
