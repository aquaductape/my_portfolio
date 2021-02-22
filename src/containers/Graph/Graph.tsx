import { lazy, Suspense, onMount, createSignal } from "solid-js";
import { WakaData, WakaSchema } from "../../ts";
const FusionTimeChart = lazy(() => {
  return import("./FusionTimeChart");
});

const Graph = () => {
  const [hasObserved, setHasObserved] = createSignal(false);
  const fetchedResult = {
    res: null as any,
  };
  let sectionRef!: HTMLElement;

  onMount(() => {
    const observerCb: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio === 0) return;
        if (hasObserved()) return;
        const run = async () => {
          fetchedResult.res = await onFetchData();
          setHasObserved(true);
        };
        run();
      });
    };

    const observer = new IntersectionObserver(observerCb);

    observer.observe(sectionRef.querySelector(".section-title")!);

    // wake up sleepy heroku
    fetch(
      // process.env.REACT_APP_WAKATIME_URL ||
      "https://my-wakatime-dashboard-2.herokuapp.com/wakeup",
      {
        headers: {
          "auth-wakatime-data":
            // process.env.REACT_APP_WAKATIME_HEADERS ||
            "my-wakatime-data-0138-cad5-40c-03-feea3714",
        },
      }
    );
  });

  return (
    <section
      ref={sectionRef}
      id="recent-coding-activity"
      className="coding-activity"
    >
      <h2 className="section-title coding-activity-title">
        Recent Coding Activity
      </h2>
      <p class="wakatime">(Powered by wakatime.com)</p>
      <div role="presentation" className="container">
        {hasObserved() ? (
          <Suspense fallback={<div>Fetching graph data ...</div>}>
            <FusionTimeChart fetchResult={fetchedResult} />
          </Suspense>
        ) : null}
      </div>
    </section>
  );
};

const onFetchData = async () => {
  const res = await fetch(
    // process.env.REACT_APP_WAKATIME_URL ||
    "https://my-wakatime-dashboard-2.herokuapp.com/",
    {
      headers: {
        "auth-wakatime-data":
          // process.env.REACT_APP_WAKATIME_HEADERS ||
          "my-wakatime-data-0138-cad5-40c-03-feea3714",
      },
    }
  );
  return (await res.json()) as [WakaData[], WakaSchema];
};

export default Graph;
