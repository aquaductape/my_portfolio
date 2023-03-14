import style from "./Post.module.scss";
import { useContext } from "solid-js";
import CONSTANTS from "../../../constants";
import { GlobalContext } from "../../../context/context";
import {
  MainTableOfContents,
  TTableOfContentsInput,
} from "../TableOfContents/TableOfContents";
import { Heading2, Heading3, HyperLink, ImgContainer, Video } from "./Post";
import TechList from "./TechList";
import githubRepoReadmeTableVid from "../../../assets/solid-primitives/video/githubRepoReadmeTable.mp4";
import siteStickyTableHeaderVid from "../../../assets/solid-primitives/video/siteStickyTableHeader.mp4";
import searchFunctionVid from "../../../assets/solid-primitives/video/searchFunction.mp4";
import primitiveTitleActiveElementImg from "../../../assets/solid-primitives/img/primitive-title-active-element.png";
import primitiveTitleDifferentSizesImg from "../../../assets/solid-primitives/img/primitive-title-different-sizes.png";
import primitiveTitleHugeImg from "../../../assets/solid-primitives/img/primitive-title-huge.png";
import markdownToHTMLImg from "../../../assets/solid-primitives/img/markdown-to-html.png";
import buildSiteImg from "../../../assets/solid-primitives/img/build-site.png";

const PostSolidPrimitives = () => {
  const [_, { setTableOfContents }] = useContext(GlobalContext);
  const title = "Solid Primitives Website";
  const skills = CONSTANTS.projects.find(
    (project) => project.project === title
  )!.skills;

  const tableOfContents: TTableOfContentsInput[] = [
    { title: "Introduction" },
    {
      title: "Features",
      children: [
        { title: "Sticky Table Headers" },
        {
          title: "Search Function",
        },
      ],
    },
    {
      title: "Styling",
    },
    {
      title: "Build Site Scripts",
    },
  ];

  setTableOfContents({ contents: tableOfContents, anchorId: "introduction" });

  return (
    <div class={style["blog-post"]}>
      <MainTableOfContents />
      <Heading2>Introduction</Heading2>
      <p>
        <HyperLink
          text="Solid-Primitives"
          href="https://github.com/solidjs-community/solid-primitives"
        />
        , is a library of high-quality composition utilities/hooks called
        primitives that extend{" "}
        <HyperLink text="SolidJS" href="https://www.solidjs.com/" /> reactivity,
        is maintained by SolidJS core and community team. Other mainstream
        frameworks have same idea such as React's{" "}
        <HyperLink
          text="react-use"
          href="https://github.com/streamich/react-use"
        />{" "}
        or Vue.js equivalent{" "}
        <HyperLink text="VueUse" href="https://vueuse.org/" />.
      </p>
      <p>
        Despite this repository being maintained by very talented and
        hardworking SolidJS core/community members such as{" "}
        <HyperLink text="davedbase" href="https://twitter.com/davedbase" /> and{" "}
        <HyperLink text="thetarnav" href="https://twitter.com/thetarnav" />,
        I've noticed it wasn't getting the traction within the SolidJS userbase
        it deserves. The problem might have been the difficult navigation of the
        repository such as the user having to shift through a plethora of README
        files in order to find the primitive (hook) they need.
      </p>
      <p>
        That's why I took it upon myself to create this documentation site and
        have primitive information more accessable, as well with the help of{" "}
        <HyperLink text="thetarnav" href="https://twitter.com/thetarnav" /> when
        it came to the strategy of pushing the site live on Netlify.
      </p>
      <p style="margin-top: 40px; font-size: 20px;">Tools & Technologies</p>
      <TechList
        items={[
          ...skills.frontend,
          ...skills.backend,
          ...skills.buildTool,
          ...skills.api,
          ...skills.testing,
          ...skills.packageManager,
        ]}
      ></TechList>
      <Heading2>Features</Heading2>
      <Heading3>Sticky Table Headers</Heading3>
      <p>
        Solid primitives{" "}
        <HyperLink
          text="github repository README"
          href="https://github.com/solidjs-community/solid-primitives#primitives"
        />
        , shows a table containing all the primitives and their information such
        as their stage, size, version, ect. The issue is that markdown rendered
        table, doesn't have sticky table headers, therefore after scrolling
        throughout the table the user loses context what category the cells
        belong to. What also doesn't help is that on smaller viewport such as
        mobile, certain content in the cells become smaller in size and become
        more difficult to read.
      </p>
      <Video src={githubRepoReadmeTableVid}></Video>
      <p>
        The site version comes with an improved table that has sticky headers
        and is compatible to mobile devices.
      </p>
      <Video src={siteStickyTableHeaderVid}></Video>
      <p>
        Notice how the first column is sticky when scrolling horizontally, this
        makes so that in mobile view the user doesn't forget which rows they
        belong to in their own category, which in this case the package name
        category.
      </p>
      <Heading3>Search Function</Heading3>
      <Video src={searchFunctionVid}></Video>

      <p>
        The search function uses{" "}
        <HyperLink text="Fuse.js" href="https://fusejs.io/" />, which is a
        lightweight fuzzy-search library.
      </p>
      <p>
        I found highlighting the exact match, with the orange background, is
        very helpful on aiding the search so I used{" "}
        <HyperLink text="markjs" href="https://markjs.io/" />
      </p>

      <Heading2>Styling</Heading2>
      <ImgContainer
        src={primitiveTitleActiveElementImg}
        alt="primtive title containing text 'active element'"
        styleSize={"medium"}
      ></ImgContainer>
      <p>
        The title in the package route has a graphic where its size is dependent
        on title text content amount.
      </p>
      <p>Here's an example below where there's three different package names</p>
      <ImgContainer
        src={primitiveTitleDifferentSizesImg}
        alt="multiple primtive titles with different texts"
        styleSize={"medium"}
        height="550px"
      ></ImgContainer>
      <p>
        What's the procress of matching the title amount?. It's not that
        difficult, just use JavaScript to get title dimensions then update
        graphic size to match title length... Right?
      </p>
      <p>
        Unfornately JavaScript is not good solution, content must load first in
        order to get the most updated size of title, probably causing a single
        frame flash of showing no graphic. Also if the network is slow, font
        size will definitely change, therefore graphic has to update its size.
        Don't forget that there are users that disable JavaScript by default and
        they'll be greeted with a broken title graphic.
      </p>
      <p>
        That's why styling the graphic with CSS only is the only solution. It
        uses a combination of hidden duplicated title text, absolute/relative
        positional styling, and{" "}
        <HyperLink
          text="container queries"
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries"
        />
        .
      </p>

      <p>
        Since the package name is user generated, I made sure the title content
        isn't obscured in the worse case scenerio of encountering an unusually
        long package name.
      </p>
      <ImgContainer
        src={primitiveTitleHugeImg}
        alt="primtive title containing a lot of text"
        styleSize={"medium"}
      ></ImgContainer>
      <Heading2>Build Site Scripts</Heading2>
      <p>
        Since the repository contains over 40 packages, it required a writing
        pre-build script to build the html table that contains the primitives
        information, as well as the routes where I used MDX to convert
        individual package README markdown file to package route html page.
      </p>
      <p>
        Building the site required writing prebuild script using NodeJS to read
        the repos "./package/*" files such their package.json, README, and
        typescript files, to generate the route pages and html primitive table
        list.
      </p>
      <p>Here's an extremely simplified graphic below</p>
      <ImgContainer
        src={buildSiteImg}
        alt="build site breakdown graphic"
        styleSize={"medium"}
        height="900px"
      ></ImgContainer>
      <p>
        There are bundle APIs such as bundlephobia, however recently it's been
        experiencing outages, and also doesn't provide tree-shaking exported
        bundle size. That's why I ended up using esbuild to gather primitive
        bundle size.
      </p>
    </div>
  );
};
export default PostSolidPrimitives;
