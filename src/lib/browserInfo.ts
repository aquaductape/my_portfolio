function userAgent(pattern: RegExp) {
  // @ts-ignore
  if (typeof window !== "undefined" && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
}

// export const IE11OrLess = userAgent(
//   /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i
// );
export const EdgeLegacy = userAgent(/Edge/i);
// worried about that choice of the agent's name, definitly keep an eye out
export const Edge = userAgent(/Edg/i); // Chromium
export const FireFox = userAgent(/firefox/i);
export const Safari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
export const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
export const Chrome = userAgent(/chrome/i);
export const Android = userAgent(/android/i);
export const IOS = userAgent(/iP(ad|od|hone)/i);
export const MotoG4 = userAgent(/Moto G \(4\)/i);
export const IOS13 =
  typeof window !== "undefined"
    ? IOS && "download" in document.createElement("a")
    : undefined;
