export const getRootBounds = (observerEntry: IntersectionObserverEntry) => {
  const { rootBounds } = observerEntry;

  if (!rootBounds) {
    return {
      bottom: window.innerHeight,
      height: window.innerHeight,
      left: 0,
      // right: document.body.clientWidth, correct value but causes reflow and so far I don't need this property
      right: 0,
      top: 0,
      // width: document.body.clientWidth, correct value but causes reflow and so far I don't need this property
      width: 0,
      x: 0,
      y: 0,
    } as DOMRect;
  }

  return rootBounds;
};
