// focus visible is injected in ssg/index.jsx
// import "focus-visible";
import { onMount } from "solid-js";
import SpySection from "./components/SpySection/SpySection";
import AboutMe from "./containers/AboutMe/AboutMe";
import Contact from "./containers/Contact/Contact";
import Footer from "./containers/Footer/Footer";
import Graph from "./containers/Graph/Graph";
import NavigationBar from "./containers/NavigationBar/NavigationBar";
import Projects from "./containers/Projects/Projects";
import Skills from "./containers/Skills/Skills";
import SVGDefs from "./containers/SVG/SVGDefs";
import GlobalProvider from "./context/context";
import { isBrowser } from "./utils";

function App() {
  onMount(() => {
    if (!isBrowser) return;

    const hash = window.location.hash;
    const allowList = ["skills", "projects", "contact"];

    if (!allowList.includes(hash)) return;

    const anchorEl = document.querySelector(`.nav-list-link[href="${hash}"]`);
    if (!anchorEl) return;
    anchorEl.classList.add("active");
  });
  return (
    <>
      <GlobalProvider>
        <NavigationBar></NavigationBar>
        <SpySection hash="about-me" sentinelTop={500}>
          <AboutMe></AboutMe>
        </SpySection>
        <SpySection hash="skills" hasNavLink={true}>
          <Skills></Skills>
        </SpySection>
        <SpySection hash="projects" hasNavLink={true}>
          <Projects></Projects>
        </SpySection>
        <SpySection hash="recent-coding-activity">
          <Graph></Graph>
        </SpySection>
        <SpySection hash="contact" hasNavLink={true}>
          <Contact></Contact>
        </SpySection>
        <Footer></Footer>
      </GlobalProvider>
      <SVGDefs></SVGDefs>
    </>
  );
}

export default App;
