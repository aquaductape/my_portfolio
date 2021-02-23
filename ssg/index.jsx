const path = require("path");
const fs = require("fs");
import fetch from "node-fetch";
import { renderToStringAsync } from "solid-js/web";
import App from "../src/App";

const lang = "en";
globalThis.fetch = fetch;

const jsFiles = [];
const cssFiles = { static: [], preload: [] };
const faviconFiles = [];

fs.readdirSync(path.join(__dirname, "../../build/js")).forEach((file) => {
  const regex = /^.+-chunkFile-.+$/;
  if (regex.test(file)) return;
  if (file === "assets") return;
  jsFiles.push(`<script type="module" src="/js/${file}"></script>`);
});
fs.readdirSync(path.join(__dirname, "../../build/styles")).forEach((file) => {
  if (file === "fonts.css") {
    cssFiles.preload.push(`
          <link rel="preload" href="/styles/${file}" as="style" onload="this.onload=null;this.rel='stylesheet'">
          <noscript>
            <link rel="stylesheet" href="styles/${file}">
          </noscript>
    `);
    return;
  }
  cssFiles.static.push(`<link rel="stylesheet" href="/styles/${file}" />`);
});
// fs.readdirSync(path.join(__dirname, "../../build/favicon")).forEach((file) => {
//   const regex = /favicon.ico|apple-touch-icon.png|favicon-32x32.png|favicon-16x16.png|site.webmanifest|safari-pinned-tab.svg|browserconfig.xml/;
//   if (!regex.test(file)) return;
//   faviconFiles.push(`<link rel="shortcut icon" href="/favicon/${file}" />`);
// });
// fs.readdirSync(path.join(__dirname, "../../build/favicon")).forEach((file) => {
//   openGraphFiles.og.push(`<meta property="og:image" content="https://calebetaylor.com/open-graph/${file}" />`);
//   if(openGraphFiles.twitter.length) return
//   openGraphFiles.twitter.push(`<meta name="twitter:image" content="https://calebetaylor.com/open-graph/${file}">`);
// });

export default async (req) => {
  const { html, script } = await renderToStringAsync(() => (
    <App url={req.url} />
  ));
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Caleb Taylor</title>
      <link rel="preload" href="/fonts/comfortaa-v27-latin-500.woff2" as="font" type="font/woff2"
        onload="this.onload=null;this.rel='stylesheet'" crossorigin="anonymous">
      <link rel="preload" href="/fonts/ubuntu-v14-latin-700.woff2" as="font" type="font/woff2"
        onload="this.onload=null;this.rel='stylesheet'" crossorigin="anonymous">
      <link rel="preload" href="/fonts/ubuntu-v14-latin-regular.woff2" as="font" type="font/woff2"
        onload="this.onload=null;this.rel='stylesheet'" crossorigin="anonymous">
      ${cssFiles.preload.join("")}
      ${cssFiles.static.join("")}
      ${faviconFiles.join("")}
          
      <meta name="description"
        content="Dedicated self-taught Front-End developer. Building projects that are responsive, performant and accessible." />
      <meta name="author" content="Caleb Taylor" />
      <meta name="keywords" content="JavaScript, React, Front end, Fullstack, Sass, Los Angeles">
      <meta name="theme-color" content="#25385b">
      <meta name="google-site-verification" content="DKvE2Lk-6ot4QrMLyu7NeflH_nxZ4QHzAd0n0XeO7Bc" />

      <!-- Favicon -->
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
      <link rel="manifest" href="/favicon/site.webmanifest">
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#25385b">
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#25385b">
      <link rel="manifest" href="/favicon/manifest.json" />

      <!-- Open Graph Protocol -->
      <meta property="og:title" content="Caleb Taylor" />
      <meta property="og:image:alt" content="Caleb Taylor vector letters" />
      <meta property="og:description"
        content="Dedicated self-taught Front-End developer. Building projects that are responsive, performant and accessible." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://calebetaylor.com/" />
      <meta property="og:image" content="https://calebetaylor.com/open-graph/calebtaylorlogo_og-image1.png" />

      <!-- Twitter -->
      <meta name="twitter:card" content="summary"> <!-- there are other card types you can choose -->
      <meta name="twitter:title" content="Caleb Taylor">
      <meta name="twitter:description"
        content="Dedicated self-taught Front-End developer. Building projects that are responsive, performant and accessible.">
        <meta name="twitter:image:alt" content="Caleb Taylor vector letters">
        <meta name="twitter:image" content="https://calebetaylor.com/open-graph/calebtaylorlogo_og-image1.png">
      ${script}

    </head>
    <body style="height: 100%; background-color: #25385b;"><div id="app" style="background-color: #030f27;">${html}</div></body>
    ${jsFiles.join("")}
    <script>
    ${focusVisibleScript()}
    </script>
  </html>`;
};

const focusVisibleScript = () =>
  `function applyFocusVisiblePolyfill(e){var t=!0,n=!1,o=null,i={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function d(e){return!!(e&&e!==document&&"HTML"!==e.nodeName&&"BODY"!==e.nodeName&&"classList"in e&&"contains"in e.classList)}function s(e){e.classList.contains("focus-visible")||(e.classList.add("focus-visible"),e.setAttribute("data-focus-visible-added",""))}function u(e){t=!1}function a(){document.addEventListener("mousemove",c),document.addEventListener("mousedown",c),document.addEventListener("mouseup",c),document.addEventListener("pointermove",c),document.addEventListener("pointerdown",c),document.addEventListener("pointerup",c),document.addEventListener("touchmove",c),document.addEventListener("touchstart",c),document.addEventListener("touchend",c)}function c(e){e.target.nodeName&&"html"===e.target.nodeName.toLowerCase()||(t=!1,document.removeEventListener("mousemove",c),document.removeEventListener("mousedown",c),document.removeEventListener("mouseup",c),document.removeEventListener("pointermove",c),document.removeEventListener("pointerdown",c),document.removeEventListener("pointerup",c),document.removeEventListener("touchmove",c),document.removeEventListener("touchstart",c),document.removeEventListener("touchend",c))}document.addEventListener("keydown",function(n){n.metaKey||n.altKey||n.ctrlKey||(d(e.activeElement)&&s(e.activeElement),t=!0)},!0),document.addEventListener("mousedown",u,!0),document.addEventListener("pointerdown",u,!0),document.addEventListener("touchstart",u,!0),document.addEventListener("visibilitychange",function(e){"hidden"===document.visibilityState&&(n&&(t=!0),a())},!0),a(),e.addEventListener("focus",function(e){var n,o,u;d(e.target)&&(t||(n=e.target,o=n.type,"INPUT"===(u=n.tagName)&&i[o]&&!n.readOnly||"TEXTAREA"===u&&!n.readOnly||n.isContentEditable))&&s(e.target)},!0),e.addEventListener("blur",function(e){var t;d(e.target)&&(e.target.classList.contains("focus-visible")||e.target.hasAttribute("data-focus-visible-added"))&&(n=!0,window.clearTimeout(o),o=window.setTimeout(function(){n=!1},100),(t=e.target).hasAttribute("data-focus-visible-added")&&(t.classList.remove("focus-visible"),t.removeAttribute("data-focus-visible-added")))},!0),e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host?e.host.setAttribute("data-js-focus-visible",""):e.nodeType===Node.DOCUMENT_NODE&&(document.documentElement.classList.add("js-focus-visible"),document.documentElement.setAttribute("data-js-focus-visible",""))}if("undefined"!=typeof window&&"undefined"!=typeof document){var event;window.applyFocusVisiblePolyfill=applyFocusVisiblePolyfill;try{event=new CustomEvent("focus-visible-polyfill-ready")}catch(e){(event=document.createEvent("CustomEvent")).initCustomEvent("focus-visible-polyfill-ready",!1,!1,{})}window.dispatchEvent(event)}"undefined"!=typeof document&&applyFocusVisiblePolyfill(document);`;
