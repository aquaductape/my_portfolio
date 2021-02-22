import { createState, createContext, batch } from "solid-js";

type TSmoothScroll = {
  active: boolean;
  debounceActive: boolean;
};

type THeader = {
  visible: boolean;
  shadow: boolean;
};
export type TGlobalState = {
  smoothScroll: TSmoothScroll;
  header: THeader;
};

type TGlobalContext = [
  TGlobalState,
  {
    setSmoothScroll(props: Partial<TSmoothScroll>): void;
    setHeader(props: Partial<THeader>): void;
  }
];

const globalState = (): TGlobalState => ({
  smoothScroll: {
    active: false,
    debounceActive: false,
  },
  header: {
    shadow: false,
    visible: true,
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
      setSmoothScroll: ({ active, debounceActive }) => {
        if (active != null) {
          setState("smoothScroll", "active", active);
        }
        if (debounceActive != null) {
          setState("smoothScroll", "debounceActive", debounceActive);
        }
      },
      setHeader: ({ shadow, visible }) => {
        batch(() => {
          if (shadow != null) {
            setState("header", "shadow", shadow);
          }
          if (visible != null) {
            setState("header", "visible", visible);
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
