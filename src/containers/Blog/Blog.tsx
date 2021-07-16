import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { GlobalContext } from "../../context/context";
import smoothScrollTo from "../../utils/smoothScrollTo";
import { flip } from "../../utils/flip";
import BlogPage from "./BlogPage";
import CONSTANTS from "../../constants";
import style from "./Blog.module.scss";
import Nav from "./Nav/Nav";
import { setUrlHash } from "../NavigationBar/Links";
import {
  iconLinkJSX,
  iconSourceCodeJSX,
} from "../../components/font-awesome/icons";

const BlogInner = (props: { setShowBlog: (v: boolean) => boolean }) => {
  const [context, { setHeader, setBlog, setSmoothScroll, setTableOfContents }] =
    useContext(GlobalContext);
  const [navActive, setNavActive] = createSignal(false);
  const [showPost, setShowPost] = createSignal(false);
  const [scrollToId, setScrollToId] = createSignal("");

  const blog = context.blog;
  const header = context.header;
  const project = CONSTANTS.projects.find(
    (project) => project.project === blog.type
  )!;
  const refs = {
    blogTitle: {} as HTMLDivElement,
    navBg: {} as HTMLDivElement,
    backBtn: {} as HTMLButtonElement,
  };
  let blogRef!: HTMLDivElement;
  let heroImgRef!: HTMLImageElement;
  let heroRef!: HTMLDivElement;
  let heroImgSentinelRef!: HTMLDivElement;
  // let blogTitleRef!: HTMLDivElement;
  // let navBgRef!: HTMLDivElement;
  // let backBtnRef!: HTMLButtonElement;
  let blogBgRef!: HTMLDivElement;
  let blogPageRef!: HTMLDivElement;
  let staticContainerRef!: HTMLDivElement;
  let linkSourcCodeRef!: HTMLAnchorElement;
  let linkWebsiteRef!: HTMLAnchorElement;
  let projectImg: HTMLElement;
  let projectTitle: HTMLElement;
  let projectCard: HTMLElement;
  let projectLinkWebsite: HTMLElement;
  let projectLinkSourceCode: HTMLElement;
  let heroImgContainerElHeight = 0;
  let observerInit = true;

  const createReizeObserver = () => {
    return new (window as any).ResizeObserver((entries: any) => {
      if (observerInit) {
        observerInit = false;
        return;
      }

      for (let entry of entries) {
        const targetHeight = entry.contentRect.height;
        const delta =
          targetHeight < heroImgContainerElHeight
            ? 0
            : Math.abs((targetHeight - heroImgContainerElHeight) / 2) * -1;

        heroImgRef.style.transform = `translateY(${delta}px)`;
      }
    });
  };

  const createIntersectionObserver = () => {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        let isVisible = false;

        if (entry.intersectionRatio > 0) {
          isVisible = true;
        }

        setNavActive(!isVisible);
      });
    });
  };

  const exitAnimation = ({
    scrollTo,
  }: {
    scrollTo: "project-link" | "about-me" | "skills" | "projects" | "contact";
  }) => {
    const projectEls = [
      projectTitle,
      projectImg,
      projectCard,
      projectLinkSourceCode,
      projectLinkWebsite,
    ];

    const getDestination = () => {
      if (scrollTo === "project-link") {
        const projectCardBCR = projectCard.getBoundingClientRect();

        return (
          window.scrollY +
          projectCardBCR.top +
          projectCardBCR.height / 2 -
          window.innerHeight / 2
        );
      }

      if (scrollTo === "about-me") return 0;

      return (
        document.getElementById(scrollTo)!.getBoundingClientRect().top +
        window.scrollY
      );
    };

    projectEls.forEach((projectEl) => (projectEl.style.opacity = ""));
    setHeader({ enableTranslate: false });
    setSmoothScroll({ active: true });

    document.getElementById("main-page")!.style.visibility = "";

    const staticContainerBCR = staticContainerRef.getBoundingClientRect();

    blogRef.style.position = "fixed";
    staticContainerRef.style.position = "fixed";
    staticContainerRef.style.top = `${staticContainerBCR.top}px`;
    staticContainerRef.style.left = "0";
    staticContainerRef.style.width = "100%";
    staticContainerRef.style.background = "var(--card-bg)";

    document.body.style.height = "100%";
    blogRef.style.transform = "translateX(-100%)";
    blogRef.style.transition = "transform 400ms";

    window.scrollTo({
      top: getDestination(),
    });

    setTimeout(() => {
      setSmoothScroll({ active: false });
      setHeader({ enableShadow: true, enableTranslate: true });
      props.setShowBlog(false);
    }, 400);
  };

  const enterAnimation = () => {
    projectImg = document.querySelector(
      `[data-flip-key="img-${blog.type}"]`
    ) as HTMLElement;
    projectTitle = document.querySelector(
      `[data-flip-key="title-${blog.type}"]`
    ) as HTMLElement;
    projectCard = document.querySelector(
      `[data-flip-key="card-${blog.type}"]`
    ) as HTMLElement;
    projectLinkWebsite = document.querySelector(
      `[data-flip-key="link-website-${blog.type}"]`
    ) as HTMLElement;
    projectLinkSourceCode = document.querySelector(
      `[data-flip-key="link-source-code-${blog.type}"]`
    ) as HTMLElement;

    heroRef.style.maxHeight = `${projectImg.clientHeight}px`;
    const scrollHeight = document.body.scrollHeight;

    document.body.style.height = `${scrollHeight}px`;

    heroImgRef.addEventListener(
      "load",
      () => {
        setBlog({ finishedStaging: true });

        heroImgContainerElHeight = heroRef.clientHeight;

        blogRef.classList.add(style["onEnter"]);
        blogBgRef.style.height = `${window.innerHeight + 200}px`;

        setHeader({ shadow: false, visible: true, enableTranslate: false });

        const delta =
          Math.abs((heroImgRef.clientHeight - heroImgContainerElHeight) / 2) *
          -1;

        flip([
          { firstEl: projectTitle, lastEl: refs.blogTitle },
          {
            firstEl: projectImg,
            lastEl: heroImgRef,
            translateOnly: "x",
            endKeyframe: `translate(0, ${delta}px)`,
            commitStyles: true,
          },
          {
            firstEl: projectImg,
            lastEl: heroRef,
            translateOnly: "y",
            scale: false,
          },
          {
            firstEl: projectCard,
            lastEl: blogBgRef,
            hideFirstEl: false,
          },
          {
            firstEl: projectLinkWebsite,
            lastEl: linkWebsiteRef,
            scale: false,
          },
          {
            firstEl: projectLinkSourceCode,
            lastEl: linkSourcCodeRef,
            scale: false,
          },
        ]);

        refs.navBg.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 300,
          delay: 450,
          fill: "forwards",
        });
        refs.backBtn.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 300,
          delay: 450,
          fill: "forwards",
        });
        heroImgRef.animate([{ borderRadius: "30px" }, { borderRadius: "0" }], {
          duration: 400,
          fill: "forwards",
        });

        setTimeout(() => {
          blogRef.classList.add(style["onFinished"]);

          smoothScrollTo({
            destination: 0,
            duration: 0,
            native: false,
            onEnd: () => {
              setShowPost(true);
              // blogRef.style.height = "";
              // css position bug, when switching between position 'absolute' and 'fixed', there's a tiny shift

              setHeader({ enableShadow: false, enableTranslate: true });
              setUrlHash({ id: "projects" });

              const resizeObserver = createReizeObserver();
              const intersectionObserver = createIntersectionObserver();

              intersectionObserver.observe(heroImgSentinelRef);
              resizeObserver.observe(heroImgRef);
            },
          });
        }, 400);
      },
      { once: true }
    );
  };

  onMount(() => {
    enterAnimation();
  });

  createEffect(() => {
    if (!blog.active) {
      let scrollTo = "";
      if (!scrollToId()) {
        scrollTo = header.activeLink ? header.activeLink : "about-me";
        // setScrollToId();
      }

      exitAnimation({ scrollTo: scrollTo || (scrollToId() as any) });
    }
  });

  createEffect(() => {
    if (showPost()) {
      document.body.style.height = `${blogRef.clientHeight}px`;
      document.getElementById("main-page")!.style.visibility = "hidden";

      window.addEventListener("scroll", function scroll() {
        blogRef.classList.remove(style["onEnter"]);
        window.removeEventListener("scroll", scroll);
      });
      blogPageRef.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 400,
        fill: "forwards",
      });
    }
  });

  onCleanup(() => {
    setBlog({ type: null, finishedStaging: false });
    setTableOfContents({
      anchorId: null,
      contents: null,
      dropdownActive: false,
      headerActive: false,
    });
  });

  return (
    <div class={style.blog} ref={blogRef}>
      <div className={style["blog-bg"]} ref={blogBgRef}></div>
      <article class={style["blog-container"]}>
        <Nav
          navActive={navActive}
          project={project.project}
          setScrollToId={setScrollToId}
          refs={refs}
        ></Nav>
        <div className={style["static-container"]} ref={staticContainerRef}>
          <div class={style["hero"]} ref={heroRef}>
            <div
              className={style["hero-img-sentinel"]}
              ref={heroImgSentinelRef}
            ></div>
            <img
              class={style["hero-img"]}
              src={project.img.src}
              alt={project.img.alt}
              ref={heroImgRef}
            />
          </div>
          <div className={style["links"]}>
            <div className={style["inner"]}>
              <a
                className="card-link-item"
                href={project.links.website}
                ref={linkWebsiteRef}
                target="_blank"
                rel="noopener"
              >
                <span>{iconLinkJSX()}</span>
                Website
              </a>
              <a
                className="card-link-item"
                href={project.links.sourceCode}
                ref={linkSourcCodeRef}
                target="_blank"
                rel="noopener"
              >
                <span>{iconSourceCodeJSX()}</span>
                Source Code
              </a>
            </div>
          </div>
          <div className={style["blog-page-container"]} ref={blogPageRef}>
            <Show when={showPost()}>
              <BlogPage type={blog.type!}></BlogPage>
            </Show>
          </div>
        </div>
      </article>
    </div>
  );
};

const Blog = () => {
  const [context] = useContext(GlobalContext);
  const [showBlog, setShowBlog] = createSignal(false);

  createEffect(() => {
    if (context.blog.active) {
      setShowBlog(context.blog.active);
    }
  });

  return (
    <Show when={showBlog()}>
      <BlogInner setShowBlog={setShowBlog}></BlogInner>
    </Show>
  );
};

export default Blog;
