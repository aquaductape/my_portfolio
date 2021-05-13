import { createState, createContext, batch } from "solid-js";

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

type TBlog = {
  type: "3nRow" | "facify" | null;
  active: boolean;
  import: boolean;
  finishedStaging: boolean;
};

export type TGlobalState = {
  smoothScroll: TSmoothScroll;
  header: THeader;
  blog: TBlog;
};

export type TGlobalContext = [
  TGlobalState,
  {
    setSmoothScroll(props: Partial<TSmoothScroll>): void;
    setHeader(props: Partial<THeader>): void;
    setBlog(props: Partial<TBlog>): void;
  }
];

const globalState = (): TGlobalState => ({
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

const GlobalProvider = (props: { children: any }) => {
  const [state, setState] = createState<TGlobalState>(globalState());
  // state.smoothScroll.

  const store: TGlobalContext = [
    state,
    {
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
