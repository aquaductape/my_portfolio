type TQuerySelector = {
  selector: string;
  parent?: Document | Element;
  reselectDuration?: number;
  maxReselect?: number;
};

export const querySelector = ({
  selector,
  maxReselect = 5,
  parent = document,
  reselectDuration = 100,
}: TQuerySelector) =>
  new Promise<HTMLElement | null>((resolve) => {
    let reselectCount = 0;

    const run = () => {
      const el = parent.querySelector(selector) as HTMLElement;
      if (!el) {
        reselectCount++;
        if (reselectCount >= maxReselect) {
          resolve(null);
          return;
        }

        setTimeout(() => {
          run();
        }, reselectDuration);
        return;
      }

      resolve(el);
    };

    run();
  });
