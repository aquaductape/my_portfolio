// older browsers such as IE do not support template elements
// as of 2019, 94% of users are using browsers that support template
export const createHTMLFromString = (string: string): Element => {
  const template = document.createElement("template");
  string = string.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = string;
  return <Element>template.content.firstChild;
};

export const round = (num: number, dec: number) => {
  const [sv, ev] = num.toString().split("e");
  return Number(
    Number(Math.round(parseFloat(sv + "e" + dec)) + "e-" + dec) +
      "e" +
      (ev || 0)
  );
};

export const isBrowser = typeof window === "object";

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const setSameStylesOnDuplicatedEls = ({
  parent = document,
  els,
}: {
  parent?: Element | Document;
  els: Element[];
}) => {
  const pairs: { pair: Element[]; style: string }[] = [];

  // read
  els.forEach((el) => {
    const style = (el as HTMLElement).style.cssText;
    const children = [
      ...parent.getElementsByClassName(el.getAttribute("class")!),
    ];
    pairs.push({ pair: children, style });
  });

  // write
  pairs.forEach(({ pair, style }) => {
    pair.forEach((el) => {
      (el as HTMLElement).style.cssText = style;
    });
  });
};

export const camelToKebabCase = (str: string) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
