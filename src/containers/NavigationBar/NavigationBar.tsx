// import { debounce } from "lodash-es";
import { createSignal, createState, onMount, useContext } from "solid-js";
import MonochromeCircleLogo from "../../components/svg/logos/MonochromeCircleLogo";
import { GlobalContext } from "../../context/context";
import { isBrowser } from "../../utils";
import smoothScrollTo from "../../utils/smoothScrollTo";

import Links from "./Links";

const NavigationBar = () => {
  const [context, { setSmoothScroll, setHeader }] = useContext(GlobalContext);
  const [hasRendered, setHasRendered] = createSignal(true);
  const [navSettings, setNavSettings] = createState({
    navVisible: true,
  });
  let prevWindowScrollY = 0;

  const onScrollHeader = () => {
    // window.pageYOffset is IE9+ browser compatible
    const windowScrollY = window.scrollY || window.pageYOffset;

    if (windowScrollY <= 90) {
      // setHeaderShadow(false);
      setHeader({ shadow: false });
    } else {
      setHeader({ shadow: true });
      // setHeaderShadow(true);
    }
    // setSmoothScroll("debounceActive", true);
    if (context.smoothScroll.active || context.smoothScroll.debounceActive) {
      // if (!smoothScroll.active && smoothScroll.debounceActive) {
      //   setSmoothScroll("debounceActive", false);
      // }
      prevWindowScrollY = windowScrollY;
      return;
    }

    if (hasRendered()) return;

    if (windowScrollY <= 90) return setHeader({ visible: true });
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

  const smartHideHeader = () => {
    // sometimes when reloading the page scroll event runs twice
    // timeout prevents that
    setTimeout(() => {
      window.addEventListener(
        "scroll",
        // debounce(onScrollHeader, 100, {
        //   leading: true,
        //   trailing: true,
        //   maxWait: 400,
        // }),
        onScrollHeader,
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

  onMount(() => {
    if (!isBrowser) return;
    prevWindowScrollY = window.scrollY || window.pageYOffset;
    smartHideHeader();
    onScrollHeader();
    setHasRendered(false);
  });

  return (
    <header>
      <div class={`header-bar ${shadowHeaderCss()} ${hideHeaderCss()}`}>
        <div class="header-bar-inner">
          <a href="#about-me-logo" className="skip-to-content">
            <div class="skip-to-content__inner">Skip to Main Content</div>
          </a>
          <div class="logo">
            <a
              aria-label="Caleb Taylor: Go to Home Page"
              title="Caleb Taylor"
              href="#homepage"
              onClick={(e) => {
                e.preventDefault();
                const prevActiveLink = document.querySelector(
                  ".nav-list-link.active"
                )!;

                if (prevActiveLink) {
                  prevActiveLink.classList.remove("active");
                }

                window.history.replaceState("", "", window.location.origin);
                setSmoothScroll({ active: true });

                smoothScrollTo({
                  container: window,
                  destination: 0,
                  onEnd: () => {
                    setSmoothScroll({ active: false });
                  },
                });
              }}
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
