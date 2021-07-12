import style from "./TableOfContents.module.scss";
import { Cevron } from "../../../components/svg/icons/icons";
import { createEffect, onCleanup, onMount, useContext } from "solid-js";
import { GlobalContext } from "../../../context/context";
import useMatchMedia from "../../../hooks/useMatchMedia";
import { TTableOfContents } from "./TableOfContents";
import { TKeyframe } from "../../../ts";

type TPosition = { x: number; y: number };

const Marker = () => {
  const [context] = useContext(GlobalContext);
  const { minWidth_400, minWidth_1680, minWidth_1900 } = useMatchMedia();
  const tableOfContents = context.tableOfContents;
  const translateDuration = 300;
  let prevContent: TTableOfContents;
  let markerElRef!: HTMLDivElement;
  let markerAnimation: Animation;
  let animationFinished = true;
  let init = false;

  const generateKeyframes = ({
    activeContent,
    prevContent,
  }: {
    activeContent: TTableOfContents;
    prevContent: TTableOfContents;
  }) => {
    const contents = context.tableOfContents.contents!;
    const keyframes: TKeyframe[] = [];
    const directionForwards = prevContent.index < activeContent.index;
    const startingIdx = directionForwards
      ? prevContent.index
      : activeContent.index;
    const lastIdx = !directionForwards
      ? prevContent.index
      : activeContent.index;

    const loopCb = (content: TTableOfContents, idx: number) => {
      const { x, y } = getPosition(content);

      const nextIdx = idx + (directionForwards ? 1 : -1);
      const nextContent = contents[nextIdx];
      if (
        nextContent &&
        startingIdx <= nextIdx &&
        lastIdx >= nextIdx &&
        nextContent.depth !== content.depth
      ) {
        const nextPosition = getPosition(nextContent);

        if (nextContent.depth > content.depth) {
          keyframes.push({
            transform: `translate(${x}px, ${y}px)`,
          });
          keyframes.push({
            transform: `translate(${x}px, ${nextPosition.y}px)`,
          });
          return;
        }

        keyframes.push({ transform: `translate(${x}px, ${y}px)` });
        keyframes.push({ transform: `translate(${nextPosition.x}px, ${y}px)` });
        return;
      }

      keyframes.push({ transform: `translate(${x}px, ${y}px)` });
    };

    const forwards = () => {
      for (let i = startingIdx; i <= lastIdx; i++) {
        const item = contents![i];
        loopCb(item, i);
      }
    };

    const backwards = () => {
      for (let i = lastIdx; i >= startingIdx; i--) {
        const item = contents![i];
        loopCb(item, i);
      }
    };

    if (directionForwards) {
      forwards();
    } else {
      backwards();
    }

    return keyframes;
  };

  const getPosition = ({ depth, index }: { depth: number; index: number }) => {
    const markerWidth =
      minWidth_1680.matches && !minWidth_1900.matches ? 21 : 25;
    const titleHeight =
      (minWidth_1680.matches || !minWidth_400.matches) && !minWidth_1900.matches
        ? 33
        : 36;
    const startingDepthWidth = !minWidth_1680.matches ? 25 : 25;
    const position = { x: 0, y: 0 };

    position.y = index * titleHeight;
    position.x = (depth === 0 ? startingDepthWidth : depth * 50) - markerWidth;

    return position;
  };

  const animate = ({ keyframes }: { keyframes: TKeyframe[] }) => {
    if (markerAnimation && !animationFinished) {
      markerAnimation.pause();
      // @ts-ignore
      markerAnimation.commitStyles();
      const [x, y] = markerElRef.style.transform
        .match(/(\d|\.)+/g)!
        .map((str) => Number(str));

      keyframes[0].transform = `translate(${x}px, ${y}px)`;
    }

    animationFinished = false;

    markerAnimation = markerElRef.animate(keyframes, {
      duration: translateDuration,
      easing: "ease-in-out",
      fill: "forwards",
    });

    if (!markerAnimation) return;

    markerAnimation.onfinish = () => {
      animationFinished = true;
    };
  };

  const getContent = (anchorId: string) => {
    return context.tableOfContents.contents!.find(
      (content) => content.id === anchorId
    )!;
  };
  // mobile: 33px, large: 36px, 1680: 30px, 1900: 36px
  onMount(() => {
    if (!tableOfContents.anchorId) return;

    prevContent = getContent(tableOfContents.anchorId);
    const { x, y } = getPosition(prevContent);
    markerElRef.style.transform = `translate(${x}px, ${y}px)`;
  });

  createEffect(() => {
    const anchorId = context.tableOfContents.anchorId;

    if (!init) {
      init = true;
      return;
    }

    if (anchorId === prevContent.id) return;

    const activeContent = getContent(anchorId!);

    const keyframes = generateKeyframes({ activeContent, prevContent });

    animate({ keyframes });

    prevContent = activeContent;
  });

  onCleanup(() => {
    if (markerAnimation) {
      markerAnimation.cancel();
    }
  });

  return (
    <div class={style["marker"]} ref={markerElRef}>
      <Cevron direction={"left"} strokeWidth={12}></Cevron>
    </div>
  );
};

export default Marker;
