import { createState, createContext, batch } from "solid-js";
import {
  TTableOfContents,
  TTableOfContentsInput,
} from "../containers/Blog/TableOfContents/TableOfContents";

type TSmoothScroll = {
  active: boolean;
  debounceActive: boolean;
};

type THeader = {
  activeLink: string | null;
  visible: boolean;
  shadow: boolean;
  enableShadow: boolean;
  enableTranslate: boolean;
};

type THero = {
  bgActive: boolean;
  active: boolean;
  shadowActive: boolean;
  clientCoordinates: {
    x: number | null;
    y: number | null;
  };
};

type TBlog = {
  type: "3nRow" | "facify" | null;
  active: boolean;
  import: boolean;
  finishedStaging: boolean;
};

type TBlogTableOfContents = {
  headerActive: boolean;
  dropdownActive: boolean;
  anchorId: string | null;
  contents: TTableOfContents[] | null;
};

export type TGlobalState = {
  hero: THero;
  smoothScroll: TSmoothScroll;
  header: THeader;
  blog: TBlog;
  tableOfContents: TBlogTableOfContents;
};

export type TGlobalContext = [
  TGlobalState,
  {
    setHero(props: Partial<THero>): void;
    setSmoothScroll(props: Partial<TSmoothScroll>): void;
    setHeader(props: Partial<THeader>): void;
    setBlog(props: Partial<TBlog>): void;
    setTableOfContents(
      props: Partial<
        Omit<TBlogTableOfContents, "contents"> & {
          contents: TTableOfContentsInput[] | null;
        }
      >
    ): void;
  }
];

const globalState = (): TGlobalState => ({
  hero: {
    bgActive: false,
    active: false,
    shadowActive: true,
    clientCoordinates: { x: null, y: null },
  },
  smoothScroll: {
    active: false,
    debounceActive: false,
  },
  header: {
    activeLink: null,
    shadow: false,
    visible: true,
    enableShadow: true,
    enableTranslate: true,
  },
  tableOfContents: {
    headerActive: false,
    dropdownActive: false,
    anchorId: null,
    contents: null,
  },
  blog: {
    type: null,
    active: false,
    import: false,
    finishedStaging: false,
  },
});
export const GlobalContext = createContext<TGlobalContext>([
  globalState(),
  {} as any,
]);

const parseTableOfContentsArgs = (input: TTableOfContentsInput[]) => {
  const result: TTableOfContents[] = [];
  let index = 0;

  const run = (
    input: TTableOfContentsInput[],
    depth = 0,
    currentItem?: TTableOfContents
  ) => {
    input.forEach(({ title: section, children }) => {
      const id = section.trim().toLowerCase().replace(/\s/g, "-");
      const resultItem: TTableOfContents = {
        id,
        depth,
        title: section,
        index,
        children: [],
      };

      if (currentItem) {
        currentItem.children.push(id);
      }

      result.push(resultItem);
      index++;

      if (children) {
        run(children, depth + 1, resultItem);
      }
    });
  };

  run(input);

  return result;
};

const GlobalProvider = (props: { children: any }) => {
  const [state, setState] = createState<TGlobalState>(globalState());

  const store: TGlobalContext = [
    state,
    {
      setHero: ({ bgActive, active, shadowActive, clientCoordinates }) => {
        batch(() => {
          if (bgActive != null) {
            setState("hero", "bgActive", bgActive);
          }

          if (active != null) {
            setState("hero", "active", active);
          }

          if (shadowActive != null) {
            setState("hero", "shadowActive", shadowActive);
          }

          if (clientCoordinates != null) {
            setState("hero", "clientCoordinates", "x", clientCoordinates.x);
            setState("hero", "clientCoordinates", "y", clientCoordinates.y);
          }
        });
      },

      setBlog: ({ active, type, import: _import, finishedStaging }) => {
        batch(() => {
          if (active !== undefined) {
            setState("blog", "active", active);
          }

          if (type !== undefined) {
            setState("blog", "type", type);
          }
          if (_import !== undefined) {
            setState("blog", "import", _import);
          }
          if (finishedStaging !== undefined) {
            setState("blog", "finishedStaging", finishedStaging);
          }
        });
      },
      setTableOfContents: ({
        anchorId,
        headerActive,
        contents,
        dropdownActive,
      }) => {
        batch(() => {
          if (anchorId !== undefined) {
            setState("tableOfContents", "anchorId", anchorId);
          }
          if (headerActive !== undefined) {
            setState("tableOfContents", "headerActive", headerActive);
          }
          if (contents !== undefined) {
            const result = contents && parseTableOfContentsArgs(contents);

            setState("tableOfContents", "contents", result);
          }
          if (dropdownActive !== undefined) {
            setState("tableOfContents", "dropdownActive", dropdownActive);
          }
        });
      },
      setSmoothScroll: ({ active, debounceActive }) => {
        if (active != null) {
          setState("smoothScroll", "active", active);
        }
        if (debounceActive != null) {
          setState("smoothScroll", "debounceActive", debounceActive);
        }
      },
      setHeader: ({
        shadow,
        visible,
        enableShadow,
        activeLink,
        enableTranslate,
      }) => {
        batch(() => {
          if (shadow != null) {
            setState("header", "shadow", shadow);
          }
          if (visible != null) {
            setState("header", "visible", visible);
          }
          if (enableShadow != null) {
            setState("header", "enableShadow", enableShadow);
          }
          if (enableTranslate != null) {
            setState("header", "enableTranslate", enableTranslate);
          }
          if (activeLink !== undefined) {
            setState("header", "activeLink", activeLink);
          }
        });
      },
    },
  ];

  return (
    <GlobalContext.Provider value={store}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
