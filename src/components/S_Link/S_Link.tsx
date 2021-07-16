import { For, JSX, onMount } from "solid-js";
import { isBrowser } from "../../utils";

const S_Link = (props: { children?: JSX.Element }) => {
  const children = props.children as unknown as { t: string };

  if (!isBrowser) {
    const sLinkStr =
      '<span class="s-link"><span class="s-link-gradient"></span><span class="s-link-solid"></span></span>';
    // const sLinkEl = (
    //   <span class="s-link">
    //     <span class="s-link-gradient"></span>
    //     <span class="s-link-solid"></span>
    //   </span>
    // );
    // const sLinkStr = (sLinkEl as any).t;
    const childrenStr = children.t as string;

    const result = childrenStr.replace(/<a\s.+>(.+)<\/a>/, (_, content) => {
      if (content) {
        return `${content}${sLinkStr}`;
      }
      return _;
    });

    children.t = result;
    // console.log(children);
  } else {
    const sLink = (
      <span class="s-link">
        <span class="s-link-gradient"></span>
        <span class="s-link-solid"></span>
      </span>
    );

    const anchorEl =
      // @ts-ignore
      children.tagName.toLowerCase() === "a"
        ? children
        : // @ts-ignore
          children.querySelector("a")!;

    anchorEl.appendChild(sLink as any);
  }

  // t: '<a data-hk="0.0.0.6.0.2.1" class="contact-email" href="mailto:caleb1taylor2@gmail.com">caleb1taylor2@gmail.com</a>'

  return children as unknown as JSX.Element;
};

export default S_Link;
