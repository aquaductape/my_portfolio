import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  useContext,
} from "solid-js";
import CONSTANTS from "../../constants";
import { GlobalContext } from "../../context/context";
import { ChromeForAndroid, MotoG4 } from "../../lib/browserInfo";
import { isBrowser } from "../../utils";
import smoothScrollTo from "../../utils/smoothScrollTo";

type LinkProps = {
  content: string;
  onClick: (id: string) => void;
  onFocus: (id: string) => void;
};

const Links = () => {
  const [context, { setSmoothScroll, setHeader, setBlog }] =
    useContext(GlobalContext);
  const links = CONSTANTS.links;

  const onClick = (id: string) => {
    const el = document.getElementById(id)!;

    setUrlHash({ id });

    setHeader({ activeLink: id });

    if (context.blog.active) {
      setBlog({ active: false });
      return;
    }

    setSmoothScroll({ active: true });

    el.focus({ preventScroll: true });
    smoothScrollTo({
      destination: el,
      duration: 400,
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
    const hash = window.location.hash.slice(1);

    if (!links.includes(hash)) return;
    setHeader({ activeLink: hash });
  });

  return (
    <ul class="nav-desktop-group">
      <For each={links}>
        {(item) => (
          <Link content={item} onClick={onClick} onFocus={onFocus}></Link>
        )}
      </For>
    </ul>
  );
};

// let isDebouncing = false;
/**
 * unfortunately, setting history on low end devices such as Moto G4, will cause scroll jank, its really bad jank
 *
 *
 *  */
export const setUrlHash = ({
  id,
  debounce,
}: {
  id: string | null;
  debounce?: boolean;
}) => {
  // if (isDebouncing) return;

  const run = () => {
    const url = `${location.origin}/#${id}`;
    if (id === null) {
      window.history.replaceState(null, "", "/");
      return;
    }
    window.history.replaceState(null, "", url);
  };

  // const onScroll = () => {
  //   isDebouncing = false;
  //   run();
  //   window.removeEventListener("scroll", onScroll);
  // };

  if (MotoG4 && ChromeForAndroid) {
    // isDebouncing = true;
    // window;
    return;
  }

  run();
};

const Link = ({ content, onClick, onFocus }: LinkProps) => {
  const [context] = useContext(GlobalContext);
  const [active, setActive] = createSignal(
    context.header.activeLink === content
  );

  createEffect(() => {
    if (context.header.activeLink === content) {
      setActive(true);
      return;
    }

    setActive(false);
  });

  return (
    <li class="nav-list">
      <a
        class={`nav-list-link ${active() ? "active" : ""}`}
        href={`#${content}`}
        onClick={(e) => {
          e.preventDefault();
          onClick(content);
        }}
        onFocus={() => onFocus(content)}
      >
        <span class="nav-list-link-content">{content}</span>
      </a>
    </li>
  );
};
export default Links;
