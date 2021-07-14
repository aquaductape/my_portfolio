import { onCleanup } from "solid-js";
import { isBrowser } from "../utils";

export type TMqlGroup = {
  minWidth_400: MediaQueryList;
  minWidth_620: MediaQueryList;
  minWidth_1680: MediaQueryList;
  minWidth_1900: MediaQueryList;
};

const mqlGroup: TMqlGroup = {} as TMqlGroup;

if (isBrowser) {
  mqlGroup.minWidth_400 = matchMedia("(min-width: 400px)");
  mqlGroup.minWidth_620 = matchMedia("(min-width: 620px)");
  mqlGroup.minWidth_1680 = matchMedia("(min-width: 1680px)");
  mqlGroup.minWidth_1900 = matchMedia("(min-width: 1900px)");
}

const useMatchMedia = ({
  addEvents,
}: {
  addEvents?: {
    type: keyof TMqlGroup;
    onChange: (e: MediaQueryListEvent) => void;
  }[];
} = {}) => {
  if (addEvents) {
    addEvents.forEach(({ type, onChange }) => {
      mqlGroup[type].addEventListener("change", onChange);
    });

    onCleanup(() => {
      addEvents.forEach(({ type, onChange }) => {
        mqlGroup[type].removeEventListener("change", onChange);
      });
    });
  }

  return { ...mqlGroup };
};

export default useMatchMedia;
