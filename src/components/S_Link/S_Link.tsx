import { For, JSX, onMount } from "solid-js";
import { isBrowser } from "../../utils";

const S_Link = (props: { children?: JSX.Element }) => {
  const children = props.children as unknown as Element;

  const sLink = (
    <span class="s-link">
      <span class="s-link-gradient"></span>
      <span class="s-link-solid"></span>
    </span>
  );

  if (!isBrowser) {
    const sLinkStr = (sLink as any).t;
    const childrenStr = (children as any).t as string;

    let result = childrenStr.replace(
      /(<a\s.+>)(.+)(<\/a>)/,
      (_, opening, content, closing) => {
        if (opening && content && closing) {
          return `${opening}${content} ${sLinkStr}${closing}`;
        }
        return _;
      }
    );

    result = result.replace(
      /(<a\s.+)(class=".+")(.+>)/,
      (_, start, className, end) => {
        if (start && className && end) {
          return `${start}${className} rel="noopener" ${end}`;
        }
        return _;
      }
    );

    // @ts-ignore
    children.t = result;
  } else {
    const anchorEl =
      children.tagName.toLowerCase() === "a"
        ? children
        : children.querySelector("a")!;

    anchorEl.appendChild(sLink as any);
  }

  return children;
};

export default S_Link;
