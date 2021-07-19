import { batch, createEffect, Show, useContext } from "solid-js";
import {
  BackArrowIcon,
  TableOfContentsIcon,
} from "../../../components/svg/icons/icons";
import { GlobalContext } from "../../../context/context";
import useFocusOut from "../../../hooks/useFocusOut";
import useMatchMedia from "../../../hooks/useMatchMedia";
import { capitalize } from "../../../utils";
import smoothScrollTo from "../../../utils/smoothScrollTo";
import style from "../Blog.module.scss";
import { TableOfContentsDropdown } from "../TableOfContents/TableOfContents";

type TNavProps = {
  project: string;
  refs: {
    blogTitle: HTMLDivElement;
    navBg: HTMLDivElement;
    backBtn: HTMLButtonElement;
  };
  navActive: () => boolean;
  setScrollToId: (v: string) => void;
};
const Nav = ({ project, navActive, refs, setScrollToId }: TNavProps) => {
  const [context, { setBlog, setTableOfContents, setSmoothScroll }] =
    useContext(GlobalContext);
  const [[_, setToggle], { onFOBlur, onFOClick, onFOFocus }] = useFocusOut({
    onToggle,
  });
  const { minWidth_1680 } = useMatchMedia();

  function onToggle(toggle: boolean) {
    setTableOfContents({
      dropdownActive: toggle,
    });
  }

  // TODO, try to pass context to be feed into useFocusOut createEffect, currently doesn't work, ask Ryan for help
  createEffect(() => {
    const dropdownActive = context.tableOfContents.dropdownActive;
    if (dropdownActive) return;

    setToggle(dropdownActive);
  });

  const onClickBackBtn = () => {
    // scrollToId = "project-link";
    batch(() => {
      setScrollToId("project-link");
      setBlog({ active: false });
    });
  };

  const onClickTitle = (e: MouseEvent) => {
    e.preventDefault();
    setSmoothScroll({ active: true });
    setTableOfContents({ anchorId: context.tableOfContents.contents![0].id });

    smoothScrollTo({
      destination: 0,
      duration: 300,
      onEnd: () => {
        setSmoothScroll({ active: false });
      },
    });
  };

  createEffect(() => {});

  return (
    <div
      class={`${style["nav"]}  ${
        !context.header.visible ? style["translate-active"] : ""
      }`}
    >
      <div
        class={`${style["nav-bg-hider"]} ${
          navActive() ? style["passed-hero-active"] : ""
        }`}
      ></div>
      <div
        class={`${style["nav-shadow"]} ${
          navActive() ? style["passed-hero-active"] : ""
        }`}
      ></div>
      <div
        class={`${style["nav-inner"]} ${
          navActive() ? style["passed-hero-active"] : ""
        } `}
      >
        <div class={style["nav-bg"]} ref={refs.navBg}></div>
        <div class={style["nav-content"]}>
          <button
            class={style["back-btn"]}
            onClick={onClickBackBtn}
            ref={refs.backBtn}
          >
            <BackArrowIcon></BackArrowIcon>
          </button>
          <h1 class={style["title"]}>
            <span onClick={onClickTitle} ref={refs.blogTitle}>
              {capitalize(project)}
            </span>
          </h1>
          <Show
            when={
              context.tableOfContents.headerActive && !minWidth_1680.matches
            }
          >
            <div
              class={`${style["util-bar"]}`}
              // @ts-ignore
              onFocusOut={onFOBlur}
              // @ts-ignore
              onFocusIn={onFOFocus}
              tabindex={-1}
            >
              <button
                class={
                  style["table-of-contents-btn"] +
                  " " +
                  (context.tableOfContents.dropdownActive
                    ? style["active"]
                    : "") +
                  (context.tableOfContents.headerActive
                    ? " Reveal-Notice-Me"
                    : "")
                }
                onClick={onFOClick}
              >
                <TableOfContentsIcon></TableOfContentsIcon>
              </button>
              <TableOfContentsDropdown></TableOfContentsDropdown>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Nav;
