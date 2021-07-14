import {
  batch,
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { GlobalContext } from "../../../context/context";
import smoothScrollTo from "../../../utils/smoothScrollTo";
import Marker from "./Marker";
import style from "./TableOfContents.module.scss";
import stylePost from "../Posts/Post.module.scss";
import useMatchMedia from "../../../hooks/useMatchMedia";
import onKeyUpFocus from "./keyUpFocus";

export type TTableOfContentsInput = {
  title: string;
  children?: TTableOfContentsInput[];
};

export type TTableOfContents = {
  id: string;
  index: number;
  title: string;
  depth: number;
  children: string[];
};
// How to Use
// Design
// Tech Stack
// 	Frontend
// 	Backend
// 	Build Tools
// Highlights
// 	Circular Dropdown animation
// 	Content Layout
// Page Speed

const Row = ({
  id,
  title,
  children,
  depth,
  visibleMarker,
}: Omit<TTableOfContents, "index"> & { visibleMarker: boolean }) => {
  const [context, { setTableOfContents, setSmoothScroll }] =
    useContext(GlobalContext);
  const { minWidth_1680, minWidth_400 } = useMatchMedia();
  const paddingLeft = depth === 0 ? "" : `${depth * 50}px`;
  const nextChildren: TTableOfContents[] = children.map((id) => {
    const result = context.tableOfContents.contents!.find(
      (content) => content.id === id
    )!;
    return result;
  });

  const onClick = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    batch(() => {
      setSmoothScroll({ active: true });
      setTableOfContents({
        anchorId: id,
      });
    });

    const el = document.querySelector(`[data-anchor="${id}"]`) as HTMLElement;
    const blogNavHeight = 50;
    const mainHeaderHeight = 58;
    const margin = 30;
    const padding = (blogNavHeight + mainHeaderHeight + margin) * -1;

    smoothScrollTo({
      destination: el,
      duration: 500,
      padding,
      onEnd: () => {
        if (!minWidth_400.matches) {
          setTableOfContents({
            dropdownActive: false,
          });
        }
        setSmoothScroll({ active: false });
      },
    });
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (!minWidth_1680.matches) return;

    onKeyUpFocus(e);
  };

  return (
    <li>
      <button
        aria-label={`Jump to ${title}`}
        class={
          style["content-item"] +
          " " +
          (visibleMarker && id === context.tableOfContents.anchorId
            ? style["active"]
            : "")
        }
        style={{ "padding-left": paddingLeft }}
        onClick={onClick}
        onKeyUp={onKeyUp}
      >
        <span class={style["content-item-text"]}>{title}</span>
      </button>
      {children && (
        <ul>
          <For each={nextChildren}>
            {(props) => {
              return <Row {...props} visibleMarker={visibleMarker}></Row>;
            }}
          </For>
        </ul>
      )}
    </li>
  );
};

const TableOfContents = ({
  observer: _observer = true,
  visualMarker = false,
}: {
  observer?: boolean;
  visualMarker?: boolean;
}) => {
  const [context, { setTableOfContents }] = useContext(GlobalContext);
  const filterTable = () => {
    const result: TTableOfContents[] = [];
    const arr = context.tableOfContents.contents!;

    if (!arr) return [];

    const getAllDecendantsCount = (input: TTableOfContents) => {
      let count = 0;

      const run = (input: TTableOfContents) => {
        count += input.children.length;

        input.children.forEach((id) => {
          const item = arr.find((content) => content.id === id)!;

          run(item);
        });
      };

      run(input);

      return count;
    };

    for (let i = 0; i < arr.length; i++) {
      const content = arr[i];
      result.push(content);

      i += getAllDecendantsCount(content);
    }

    return result;
  };
  const table = filterTable();
  let tabelElREf!: HTMLDivElement;

  onMount(() => {
    if (!_observer) return;
    const observerCb: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          setTableOfContents({ headerActive: true });
          return;
        }

        setTableOfContents({ headerActive: false });
      });
    };

    const observer = new IntersectionObserver(observerCb, {
      rootMargin: "-6%",
    });

    observer.observe(tabelElREf);
  });

  return (
    <div ref={tabelElREf} class={style["table-of-contents"]}>
      <div class={style["table-title"]}>Table Of Contents</div>
      <div class={style["table-root"]}>
        {visualMarker && <Marker></Marker>}

        <ul>
          <For each={table}>
            {(content) => {
              return <Row {...content} visibleMarker={visualMarker}></Row>;
            }}
          </For>
        </ul>
      </div>
    </div>
  );
};

export const TableOfContentsDropdown = () => {
  const [context] = useContext(GlobalContext);
  const [toggleDropdown, setToggleDropdown] = createSignal(false);
  const dropdownDuration = 300;
  let innerElRef!: HTMLDivElement;

  createEffect(() => {
    if (context.tableOfContents.dropdownActive) {
      setToggleDropdown(true);
      return;
    }
    if (context.tableOfContents.dropdownActive === false) {
      setTimeout(() => {
        setToggleDropdown(false);
      }, dropdownDuration + 200);
    }
  });

  return (
    <div class={style["dropdown"]}>
      <div
        class={`${style["inner"]} ${
          context.tableOfContents.dropdownActive ? style["active"] : ""
        }`}
        ref={innerElRef}
      >
        <Show when={toggleDropdown()}>
          <TableOfContents
            visualMarker={true}
            observer={false}
          ></TableOfContents>
        </Show>
      </div>
    </div>
  );
};

export const MainTableOfContents = () => {
  const [_, { setTableOfContents }] = useContext(GlobalContext);
  const { minWidth_1680 } = useMatchMedia({
    addEvents: [{ type: "minWidth_1680", onChange }],
  });
  const [showTable, setShowTable] = createSignal(!minWidth_1680.matches);

  function onChange(e: MediaQueryListEvent) {
    setShowTable(!e.matches);

    if (e.matches) {
      setTableOfContents({ headerActive: false });
    }
  }

  return (
    <Show when={showTable()}>
      <div class={stylePost["table-of-contents"]}>
        <TableOfContents></TableOfContents>
      </div>
    </Show>
  );
};

export const AsideTableOfContents = () => {
  const [context] = useContext(GlobalContext);

  const { minWidth_1680 } = useMatchMedia({
    addEvents: [{ type: "minWidth_1680", onChange }],
  });
  const [showTable, setShowTable] = createSignal(minWidth_1680.matches);

  function onChange(e: MediaQueryListEvent) {
    setShowTable(e.matches && !!context.tableOfContents.contents);
  }

  return (
    <Show when={showTable() && !!context.tableOfContents.contents}>
      <aside class={style["aside"]}>
        <div className={style["inner"]}>
          <TableOfContents
            visualMarker={true}
            observer={false}
          ></TableOfContents>
        </div>
      </aside>
    </Show>
  );
};

export default TableOfContents;
