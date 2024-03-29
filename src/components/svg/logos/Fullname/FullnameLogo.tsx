import { createEffect, onMount, useContext } from "solid-js";
import { GlobalContext } from "../../../../context/context";
import useMatchMedia from "../../../../hooks/useMatchMedia";

type TAnimatedBGNode = {
  el: HTMLElement | null;
  position: number;
  startPosition: number;
  endPosition: number;
};

/**
 *
 * currently has poor performance in Chrome
 * 1. clip-path has better performance (not noticable on simple objects) compared to mask, but can only apply on a single path
 * 2. mask shadow element has huge path and it's duplicated 30 times to create shadow effect
 *
 * Update
 * moved the masked elements in a seperate svg element, increased performance, but still bad on lower end devices
 *
 * Solution:
 * When running other animations, pause it
 */
const FullnameLogo = (props: { ref: HTMLElement }) => {
  const [context, { setHero }] = useContext(GlobalContext);
  const { minWidth_400 } = useMatchMedia();
  const bgNodes: TAnimatedBGNode[] = [];
  let animateBGId: number | null = null;
  let skipFrameCounter = 0;
  let skipAmount = 1;
  let positionAmount = 0.035;

  const animateBG = (props: TAnimatedBGNode) => {
    const { el, endPosition, position, startPosition } = props;
    if (position >= endPosition) {
      props.position = startPosition;
    }

    el!.style.transform = `translateY(${position}px)`;
    el!.style.willChange = "transform";
    props.position += positionAmount;
  };

  const animateBGs = (
    { bodyOnly = false }: { bodyOnly?: boolean } = { bodyOnly: false }
  ) => {
    if (skipFrameCounter === 0) {
      for (let i = 0; i < bgNodes.length; i++) {
        if (bodyOnly && (i === 0 || i === 1)) continue;
        animateBG(bgNodes[i]);
      }
    }

    skipFrameCounter = (skipFrameCounter + 1) % skipAmount;

    animateBGId = window.requestAnimationFrame(() => animateBGs({ bodyOnly }));
  };

  const calculateBGNodes = (
    inputs: {
      selector: string;
      startPosition?: number;
      multiplyEnd?: number;
      beginPosition?: number;
    }[]
  ) => {
    inputs.forEach(
      ({ selector, startPosition, multiplyEnd, beginPosition }) => {
        multiplyEnd = multiplyEnd || 1;
        beginPosition = beginPosition || 0;
        const node = document.querySelector(selector) as HTMLElement;
        const clone = node.cloneNode(true) as HTMLElement;
        // @ts-ignore
        const height = node.getBBox().height as number;
        clone.style.transform = `translateY(${-height}px)`;
        clone.style.backfaceVisibility = "none";
        node.style.backfaceVisibility = "none";
        node.parentElement!.appendChild(clone);
        const padding = 2; // prevent pixel gap showing

        bgNodes.push(
          {
            el: node,
            position: beginPosition,
            startPosition: startPosition == null ? -height : startPosition,
            endPosition: height * multiplyEnd,
          },
          {
            el: clone,
            position: -height,
            startPosition:
              startPosition == null ? -height + padding : startPosition,
            endPosition: height * multiplyEnd,
          }
        );
      }
    );
  };

  onMount(() => {
    let timeoutId: number;

    const init = () => {
      window.clearTimeout(timeoutId);
      document.body.removeEventListener("mousemove", init);
      document.removeEventListener("scroll", init);

      calculateBGNodes([
        {
          selector: ".fullname-shadow-bg",
          beginPosition: 12,
          startPosition: 0,
          multiplyEnd: 2,
        },
        { selector: ".first-name-bg" },
        { selector: ".last-name-bg" },
      ]);
      setHero({ bgActive: true });
    };

    timeoutId = window.setTimeout(() => {
      document.body.removeEventListener("mousemove", init);
      init();
    }, 5000);

    document.body.addEventListener("mousemove", init);
    document.addEventListener("scroll", init);
  });

  createEffect(() => {
    const active = context.hero.active;
    const bgActive = context.hero.bgActive;
    if (
      !active
      // || (FireFox && !context.hero.bgActive)
    ) {
      window.cancelAnimationFrame(animateBGId!);
      return;
    }

    window.cancelAnimationFrame(animateBGId!);

    if (!bgActive) {
      skipAmount = 2;
      positionAmount = 0.04;
      skipFrameCounter = 0;
      animateBGs({ bodyOnly: true });
      return;
    } else {
      skipAmount = 1;
      positionAmount = 0.035;
      skipFrameCounter = 0;
    }

    animateBGs();
  });

  // createEffect(() => {
  //   if (
  //     !context.hero.bgActive
  //     // || !context.hero.bgActive
  //   ) {

  //     // window.cancelAnimationFrame(animateBGId!);
  //     // animateBGsThrottled();
  //     return;
  //   }
  // });

  return (
    <>
      {/* SVG Letters Shadow */}
      <svg
        aria-hidden="true"
        // @ts-ignore
        ref={props.ref}
        focusable="false"
        viewBox="0 0 49.913 38.486"
        xmlns="http://www.w3.org/2000/svg"
        style="will-change: transform;"
      >
        <defs>
          <mask maskUnits="objectBoundingBox" id="fullname-logo-c">
            <g class="fullname-shadow">
              <path
                d="M39.967 20.911c1.252 0 2.092 1.59.483 1.185-1.201-.31-2.877.384-2.627 1.848-.025 1.217.052 2.442-.041 3.654-.937 1.099-1.441-.463-1.234-1.295.025-1.648-.053-3.305.041-4.949.334-.752 1.493-.258 1.234.514.526-.617 1.337-.964 2.144-.957zm-7.348 7.105c-2.031.134-3.759-1.79-3.514-3.788-.009-2.037 2.037-3.61 4.004-3.263 2.127.165 3.488 2.505 2.906 4.484-.339 1.547-1.829 2.627-3.396 2.567zm0-1.148c2.199.12 3.038-3.058 1.407-4.31-1.702-1.443-4.324.517-3.604 2.578.21 1.01 1.163 1.769 2.197 1.732zm-7.184-5.817c.837.398.004 1.303-.166 1.895-1.172 2.618-2.318 5.248-3.506 7.858-1.102.759-1.096-.678-.675-1.437l.929-2.091-2.87-5.447c-.218-1.326 1.376-.753 1.442.202l1.99 3.957c.72-1.595 1.396-3.213 2.146-4.792.152-.23.477-.259.71-.145zm-9.273-.114c2.083-.086 3.764 1.95 3.508 3.972-.028.891.059 1.793-.048 2.676-.502.913-1.516.058-1.253-.73-1.324 1.76-4.376 1.443-5.306-.561-1.07-1.927-.077-4.738 2.159-5.24.306-.08.624-.118.94-.117zm0 5.93c2.18.107 3.052-3.057 1.395-4.295-1.676-1.46-4.3.52-3.592 2.555.218.999 1.165 1.776 2.197 1.74zm-1.542-8.864c1.368.49.237 1.334-.938 1.224h-1.804v8.074c-.49 1.5-1.399.048-1.327-.938v-7.136c-1-.025-2.007.053-3-.041-1.075-.891.432-1.242 1.269-1.183h5.8zM28.337 28.33c-1.53.021-2.057-1.69-1.913-2.957V8.087c.487-1.465 1.392-.013 1.276.938.007 5.723-.015 11.447.01 17.17-.168 1.19 2.297.621 1.278 1.956-.188.14-.423.181-.65.178zM39.46 10.552c2.346-.088 3.85 2.634 3.086 4.707-.678 2.426-4.15 3.182-5.838 1.358-1.383-1.315-.933-3.306-1.01-5.006.027-1.201-.058-2.412.044-3.607.921-1.118 1.474.452 1.256 1.288v2.42a3.142 3.142 0 012.462-1.16zm-.255 5.931c2.172.101 3.074-3.062 1.395-4.296-1.671-1.458-4.285.512-3.58 2.542.219 1.004 1.14 1.794 2.185 1.754zm-4.041-2.5c-.158.876-1.233.466-1.867.561H29.73c.188 1.807 2.57 2.567 3.929 1.505 1.206-.645 1.282.943.056 1.249-1.982.97-4.776-.184-5.107-2.466-.441-1.905.865-4.094 2.895-4.252 1.703-.327 3.454.938 3.607 2.68.037.239.054.48.054.723zm-3.176-2.334c-1.009-.27-2.637 1.287-1.99 1.875h3.992c-.087-1.03-.924-1.939-2.002-1.875zm-9.813-1.097c2.082-.086 3.763 1.95 3.507 3.972-.028.891.06 1.793-.048 2.676-.501.914-1.515.058-1.253-.73-1.324 1.76-4.376 1.443-5.306-.561-1.07-1.927-.077-4.738 2.159-5.24.306-.08.624-.118.94-.117zm0 5.93c2.18.107 3.051-3.057 1.395-4.295-1.677-1.46-4.301.52-3.593 2.555.218 1 1.165 1.777 2.197 1.74zm-6.744 1.225c-2.864.111-5.2-2.68-4.913-5.461.062-2.81 2.804-5.185 5.603-4.72.977.092 3.436.965 2.292 2.13-1.327-.43-2.855-1.545-4.388-.672-2.67 1.124-3.018 5.244-.633 6.852 1.37 1.058 3.315.73 4.6-.297 1.832.28-.301 2.017-1.302 2.012a5.01 5.01 0 01-1.259.157z"
                fill="#fff"
                style="transform: translate(0, 0);"
              />
            </g>
          </mask>
        </defs>
        <g
          class="fullname-shadow-bg-container"
          opacity="0"
          mask="url(#fullname-logo-c)"
          style="contain: paint;"
        >
          <path d="M-.02-.088v38.71h50.026V-.087z" fill="#1c2942" />
          <g>
            <g class="fullname-shadow-bg">
              <path
                d="M.09-45.156L-.212-5.447l50.518-.945-.013-38.764z"
                fill="#1c2942"
              />
              <path
                d="M9.013-5.696l.18.89 41.499-10.229-.314-4.482s-7.03-1.577-10.572-2.088c-3.11-.45-6.319-1.813-9.363-.86-8.082 2.529-21.43 16.77-21.43 16.77z"
                fill="#121d34"
              />
              <path
                d="M8.514-8.15c-2.747.915-8.696.228-8.696.228L-.319-.01l49.954-11.13.091-6.165s-7.889-4.037-9.465-2.06c0 0-10.018 8.673-27.33 8.075-2.75-.095-2.698 2.567-4.417 3.14z"
                fill="#001229"
              />
              <path
                d="M-.255-4.433l.076 4.385L50.14-1.434l-.248-12.59s-5.673.557-8.495.242c-1.084-.12-2.188-1.323-3.206-.814-13.834 6.922-17.109 5.133-25.414 8.799C8.35-2.83 4.89-3.327-.254-4.433z"
                fill="#121d34"
              />
              <path
                d="M-.317-3.008L-.422.522l50.54.263.248-8.312s-5.767 5.76-9.033 5.241c-2.761-.438-1.782-10.295-6.619-6.696C22.829-2.252 11.845-2.008-.317-3.008z"
                fill="#1c2942"
              />
              <path
                d="M.295-29.092L.21-25.657 50.779-36.5l-.314-4.483c-7.413-.609-22.25-4.172-27.304-1.117C7.714-31.84.295-29.091.295-29.091z"
                fill="#001229"
              />
              <path
                d="M.209-25.657l-.087 3.435S6.212-6.1 6.306-17.563c.054-6.546 18.178-16.422 30.349-13.14 11.554 3.117 14.037-2.219 14.037-2.219l-.314-4.626s-7.008-1.633-10.572-2.088c-4.607-.589-9.393-1.888-13.912-.824C16.251-38.188.208-25.657.208-25.657z"
                fill="#121d34"
              />
            </g>
          </g>
        </g>
      </svg>
      {/* SVG Letters Stroke */}
      <svg
        aria-hidden="true"
        // @ts-ignore
        focusable="false"
        viewBox="0 0 49.913 38.486"
        xmlns="http://www.w3.org/2000/svg"
        style="transform: translateY(-101.5%); will-change: transform;"
      >
        <defs>
          <clipPath id="fullname-logo-b">
            <path
              class="first-name-letters"
              d="M28.339 28.335c-.366 0-.697-.098-.995-.293a2.025 2.025 0 01-.676-.842 2.997 2.997 0 01-.242-1.225V8.092c0-.187.06-.34.178-.459a.621.621 0 01.46-.179c.187 0 .34.06.459.18a.622.622 0 01.178.458v17.883c0 .315.06.574.179.778.119.204.272.306.459.306h.319c.17 0 .306.06.408.18.11.118.166.271.166.458s-.08.34-.242.46c-.162.118-.37.178-.625.178zm11.122-17.778q.918 0 1.658.46.753.458 1.174 1.275.433.803.433 1.798t-.459 1.812q-.459.803-1.275 1.275-.804.46-1.786.46t-1.786-.46q-.79-.472-1.263-1.275-.459-.817-.459-1.812V8.274q0-.294.179-.472.19-.179.472-.179.293 0 .471.179.179.178.179.472v3.444q.446-.549 1.084-.855.638-.306 1.378-.306zm-.255 5.931q.638 0 1.148-.306.523-.319.816-.867.306-.549.306-1.225t-.306-1.212q-.293-.548-.816-.854-.51-.319-1.148-.319-.638 0-1.16.319-.511.306-.804.854-.294.536-.294 1.212 0 .676.294 1.225t.803.867q.523.306 1.16.306zm-4.042-2.5q0 .243-.165.408-.166.153-.421.153H29.73q.14.893.803 1.442.676.548 1.646.548.382 0 .79-.14.422-.14.69-.344.178-.14.42-.14.243 0 .383.127.23.191.23.434 0 .23-.204.382-.434.345-1.085.561-.637.217-1.224.217-1.046 0-1.875-.446-.83-.46-1.301-1.263-.46-.804-.46-1.824t.434-1.824q.447-.816 1.225-1.263.79-.459 1.785-.459.983 0 1.697.434.714.433 1.097 1.212.383.778.383 1.785zm-3.176-2.334q-.93 0-1.518.51-.574.51-.727 1.365h4.248q-.115-.855-.638-1.365t-1.365-.51zm-9.813-1.097q.983 0 1.773.472.804.46 1.263 1.275.472.804.472 1.799v2.844q0 .281-.191.472-.179.179-.46.179-.28 0-.471-.179-.179-.19-.179-.472v-.471q-.446.548-1.084.854-.638.306-1.378.306-.918 0-1.67-.459-.74-.46-1.174-1.263-.421-.816-.421-1.811t.459-1.799q.46-.816 1.263-1.275.816-.472 1.798-.472zm0 5.931q.638 0 1.148-.306.523-.319.817-.855.293-.548.293-1.224 0-.676-.293-1.225-.294-.548-.817-.854-.51-.32-1.148-.32-.637 0-1.16.32-.51.306-.817.854-.293.549-.293 1.225t.293 1.224q.306.536.817.855.523.306 1.16.306zm-6.743 1.225q-1.365 0-2.5-.676-1.123-.676-1.773-1.85-.65-1.173-.65-2.59 0-1.402.65-2.563.65-1.174 1.773-1.85 1.135-.688 2.5-.688.97 0 1.671.255.714.255 1.441.842.153.114.205.242.05.115.05.28 0 .256-.191.421-.179.166-.42.166-.243 0-.447-.166-.523-.446-1.02-.637-.498-.204-1.289-.204-.995 0-1.837.523-.829.523-1.326 1.428-.485.893-.485 1.952 0 1.071.485 1.964.497.893 1.326 1.416.842.523 1.837.523 1.224 0 2.347-.842.217-.153.42-.153.243 0 .396.179.166.165.166.446 0 .268-.204.472-1.378 1.11-3.125 1.11z"
              fill="#fff"
            />
          </clipPath>
          <clipPath id="fullname-logo-a">
            <path
              class="last-name-letters"
              d="M32.621 28.021q-1.02 0-1.824-.446-.804-.46-1.25-1.263-.446-.804-.446-1.824 0-1.033.446-1.837t1.25-1.25q.804-.46 1.824-.46 1.008 0 1.798.46.804.446 1.25 1.25.46.804.46 1.837 0 1.02-.447 1.824-.446.803-1.25 1.263-.79.446-1.811.446zm0-1.148q.65 0 1.16-.306.524-.306.804-.842.294-.548.294-1.237 0-.69-.294-1.238-.28-.548-.803-.854-.51-.306-1.161-.306-.65 0-1.173.306-.51.306-.804.854-.293.549-.293 1.238t.293 1.237q.293.536.804.842.522.306 1.173.306zm-7.184-5.816q.396.153.396.497 0 .128-.077.306l-3.903 8.776q-.153.395-.497.395-.128 0-.306-.076-.383-.166-.383-.498 0-.153.076-.306l1.276-2.87-2.87-5.446q-.064-.115-.064-.268 0-.166.102-.306.102-.14.268-.217.115-.051.255-.051.357 0 .536.357l2.334 4.643 2.054-4.63q.166-.37.497-.37.166 0 .306.063zm-9.273-.115q.982 0 1.773.472.804.459 1.263 1.275.472.804.472 1.799v2.844q0 .28-.191.472-.179.179-.46.179-.28 0-.472-.179-.178-.191-.178-.472v-.472q-.447.549-1.084.855-.638.306-1.378.306-.918 0-1.67-.46-.74-.458-1.174-1.262-.421-.816-.421-1.811t.459-1.799q.46-.816 1.263-1.275.816-.472 1.798-.472zm0 5.931q.638 0 1.148-.306.523-.319.817-.855.293-.548.293-1.224t-.293-1.225q-.294-.548-.817-.854-.51-.32-1.148-.32-.638 0-1.16.32-.51.306-.817.854-.293.549-.293 1.225t.293 1.224q.306.536.817.855.522.306 1.16.306zm-1.542-8.865q.268 0 .434.178.178.166.178.434t-.178.447q-.166.165-.434.165H11.88v8.075q0 .28-.192.472-.191.19-.472.19-.28 0-.472-.19-.191-.192-.191-.472v-8.075H7.798q-.268 0-.447-.165-.165-.179-.165-.447t.165-.434q.179-.178.447-.178zm25.347 2.908q.676 0 1.059.204.382.204.382.51 0 .09-.013.128-.115.408-.51.408-.064 0-.192-.025-.51-.09-.83-.09-.918 0-1.479.421t-.561 1.135v3.725q0 .306-.166.472-.153.166-.472.166-.306 0-.472-.153-.165-.166-.165-.485V21.63q0-.306.165-.472.166-.165.472-.165.638 0 .638.637v.243q.383-.447.944-.702.561-.255 1.199-.255z"
              fill="#fff"
            />
          </clipPath>
        </defs>
        <g class="full-name-letter-combo">
          <path
            d="M-306.89 72.177a.637.637 0 01-.358-.105.728.728 0 01-.243-.303 1.078 1.078 0 01-.087-.44v-6.43c0-.067-.038-.16.005-.203.043-.043.156-.043.223-.043s.124.038.167.08a.223.223 0 01.064.166v6.43a.55.55 0 00.064.28c.043.073.098.11.165.11h.115c.061 0 .11.02.147.064.04.042.06.097.06.165a.197.197 0 01-.088.165.37.37 0 01-.224.064z"
            transform="matrix(5.537 0 0 2.7813 1730.3 -172.14)"
            fill="#1c2942"
            stroke="#1c2942"
            stroke-width="0.264583"
          />
        </g>
        <g clip-path="url(#fullname-logo-b)" style="contain: paint;">
          <path d="M9.5-48.777v78.471h35.952v-78.471z" fill="#c4c4c5" />
          <g
            class="first-name-bg"
            stroke-dashoffset="16.97"
            stroke-linecap="round"
            stroke-linejoin="round"
            paint-order="markers fill stroke"
          >
            <path
              d="M49.833-38.247L9.406-15.82 7.696 6.663C36-8.736 22.494-5.237 56.27-26.417z"
              fill="#fff"
            />
            <path
              d="M50.841-22.5s4.255-6.632-8.559.34c-10.925 5.943-2.534 11.365-25.788 12.355C8.922-9.482 9.935.743 5.37 3.227L3.76 19.4 46.214-3.7z"
              fill="#e0e0e1"
            />
            <path
              d="M46.214-3.699S37.642-7.396 34.69-2.387C31.738 2.623 3.45 18.824 3.45 18.824h42.766zM51.592-48.777H9.499l-.586 28.601c18.861-7.527 9.278-6.01 23.053-13.504 14.528-7.905 5.14-4.29 19.668-12.194z"
              fill="#c4c4c5"
            />
            <path
              d="M51.592-48.777c-4.662 5.424-17.138 4.291-14.488 7.075 2.698 2.833-12.604 19.044-20.52 15.457-1.722-.78 11.381-20.341.684-14.222-10.697 6.12-8.01 3.233-8.01 3.233l.321 24.459c13.775-7.495 13.268 6.14 24.458-4.845 5.186-5.09 1.185-6.892 15.714-14.797z"
              fill="#e0e0e1"
            />
          </g>
        </g>
        <g
          clip-path="url(#fullname-logo-a)"
          stroke-dashoffset="16.97"
          stroke-linecap="round"
          stroke-linejoin="round"
          paint-order="markers fill stroke"
          style="contain: paint;"
        >
          <g class="last-name-bg">
            <path
              d="M37.044-29.231L1.648 3.681l.605 17.382L28.516-2.912 43.29-19.368V-36.87z"
              fill="#fff"
            />
            <path
              d="M37.044-13.164S17.995 1.236 12.096 6.722c-5.9 5.485-10.448 13.026-10.448 13.026l4.073 12.099 22.795-18.693L43.29-3.302v-16.067z"
              fill="#e0e0e1"
            />
            <path
              d="M25.656 12.512C17.481 16.754 7.58 26.775 5.746 30.969l-.024.878h37.567V-3.301c-8.297 5.389-4.62 9.061-17.633 15.814z"
              fill="#c4c4c5"
            />
            <path
              d="M2.591-36.87L2.304 5.091s29.28-17.967 35.31-23.349c6.03-5.382 5.675-18.612 5.675-18.612z"
              fill="#e0e0e1"
            />
            <path
              d="M6.482-36.87c.636 14.545 3.682 27.414 14.624 23.765 10.86-3.855 19.466-19.908 22.183-23.765z"
              fill="#c4c4c5"
            />
          </g>
        </g>
      </svg>
    </>
  );
};

export default FullnameLogo;
