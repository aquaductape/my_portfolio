import { batch, For, SetStateFunction, useContext } from "solid-js";
import { GlobalContext } from "../../context/context";
import smoothScrollTo from "../../utils/smoothScrollTo";

type LinksProps = {
  setSmoothScroll: SetStateFunction<{
    active: boolean;
    debounceActive: boolean;
  }>;
};

type LinkProps = {
  content: string;
  onClick: (e: MouseEvent, id: string) => void;
  onFocus: (e: FocusEvent, id: string) => void;
};

const Links = () => {
  const [_, { setSmoothScroll, setHeader }] = useContext(GlobalContext);
  const links = ["skills", "projects", "contact"];

  const onClick = (e: MouseEvent, id: string) => {
    const target = e.target as HTMLElement;
    const linkTarget = target.closest(".nav-list-link") as HTMLAnchorElement;

    if (!linkTarget) return;

    const prevActiveLink = document.querySelector(".nav-list-link.active")!;
    const el = document.getElementById(id)!;

    if (prevActiveLink) {
      prevActiveLink.classList.remove("active");
    }

    linkTarget.classList.add("active");
    setSmoothScroll({ active: true });

    window.history.replaceState("", "", linkTarget.href);

    el.focus({ preventScroll: true });
    smoothScrollTo({
      destination: el,
      duration: 400,
      onEnd: () => {
        setSmoothScroll({ active: false });
      },
    });
  };

  const onFocus = (e: FocusEvent, id: string) => {
    if (id !== "contact") return;

    setHeader({ visible: true });
    const windowScrollY = window.scrollY || window.pageYOffset;

    if (windowScrollY <= 90) return;
    setHeader({ shadow: true });
  };

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
  return (
    <li class="nav-list">
      <a
        class="nav-list-link"
        href={`#${content}`}
        onClick={(e) => {
          e.preventDefault();
          onClick(e, content);
        }}
        onFocus={(e) => onFocus(e, content)}
      >
        <span class="nav-list-link-content">{content}</span>
      </a>
    </li>
  );
};
export default Links;
