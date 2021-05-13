import { createEffect, createSignal, For, onMount, useContext } from "solid-js";
import CONSTANTS from "../../constants";
import { GlobalContext } from "../../context/context";
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

  const onFocus = (id: string) => {
    if (id !== "contact") return;

    setHeader({ visible: true });
    const windowScrollY = window.scrollY || window.pageYOffset;

    if (windowScrollY <= 90) return;
    setHeader({ shadow: true });
  };

  onMount(() => {
    const hash = window.location.hash.slice(1);

    if (!links.includes(hash)) return;
    console.log({ hash });

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

const Link = ({ content, onClick, onFocus }: LinkProps) => {
  const [context] = useContext(GlobalContext);
  const [active, setActive] = createSignal(
    context.header.activeLink === content
  );

  createEffect(() => {
    if (context.header.activeLink === null) {
      window.history.replaceState("", "", location.origin);
    }

    if (context.header.activeLink === content) {
      const url = `${location.origin}/#${content}`;

      window.history.replaceState("", "", url);

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
        onFocus={(e) => onFocus(content)}
      >
        <span class="nav-list-link-content">{content}</span>
      </a>
    </li>
  );
};
export default Links;
