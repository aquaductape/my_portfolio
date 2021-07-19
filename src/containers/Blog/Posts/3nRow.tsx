import style from "./Post.module.scss";
import tooltipImg from "../../../assets/3nRow/img/tooltip.png";
import consistencyImg from "../../../assets/3nRow/img/consistency.png";
import anatomyOfPlayerBtnImg from "../../../assets/3nRow/img/anatomy_of_player_btn.png";
import deadSpaceImg from "../../../assets/3nRow/img/dead_space.png";
import mvcDiagramImg from "../../../assets/3nRow/img/mvc_diagram.png";
import pixelPipelineImg from "../../../assets/3nRow/img/pixel-pipeline.jpg";
import mvcDiagramVid from "../../../assets/3nRow/video/mvc_diagram.mp4";
import dropdownVid from "../../../assets/3nRow/video/dropdown.mp4";
import squashedVid from "../../../assets/3nRow/video/squashed.mp4";
import resizeVid from "../../../assets/3nRow/video/resize.mp4";
import dropdownsComparisonVid from "../../../assets/3nRow/video/dropdowns_comparison.mp4";

import {
  Heading2,
  Heading3,
  Heading4,
  HyperLink,
  ImgContainer,
  Video,
} from "./Post";
import TableOfContents, {
  MainTableOfContents,
  TTableOfContentsInput,
} from "../TableOfContents/TableOfContents";
import { useContext } from "solid-js";
import { GlobalContext } from "../../../context/context";
import CONSTANTS from "../../../constants";
import TechList from "./TechList";

const Post3nRow = () => {
  const [_, { setTableOfContents }] = useContext(GlobalContext);
  const title = "3nRow";
  const skills = CONSTANTS.projects.find(
    (project) => project.project === title
  )!.skills;

  const tableOfContents: TTableOfContentsInput[] = [
    { title: "Summary" },
    { title: "Design" },
    {
      title: "Tech Stack",
      children: [
        {
          title: "Frontend",
          children: [{ title: "Tooltip" }, { title: "onFocusOut" }],
        },
        { title: "Backend" },
        { title: "Build Tools" },
      ],
    },
    {
      title: "Highlights",
      children: [
        { title: "Circular Dropdown Animation" },
        { title: "Content Layout" },
      ],
    },
  ];

  setTableOfContents({ contents: tableOfContents, anchorId: "summary" });

  return (
    <div class={style["blog-post"]}>
      <MainTableOfContents></MainTableOfContents>
      <Heading2>Summary</Heading2>
      <p>
        It’s a Tic Tac Toe game, but with extra fluff. There's player
        customization, where you can change the icon and it's color. You can
        choose play against an AI or another human.
      </p>
      <p>
        For the client side, I didn’t use libraries or frameworks such as React
        or jQuery, instead used plain Javascript with MVC pattern. This results
        in a lighter and performant application.
      </p>
      <p>
        Game animations were done using SVG files. No need to use canvas based
        animations, which would have forced the user to download large amounts
        of data.
      </p>
      <p>
        For backend, multiplayer is supported by Colyseus framework which runs
        on Nodejs.
      </p>
      <p style="margin-top: 40px; font-size: 20px;">Tools & Technologies</p>
      <TechList
        items={[
          ...skills.frontend,
          ...skills.backend,
          ...skills.buildTool,
          ...skills.api,
        ]}
      ></TechList>

      <Heading2>Design</Heading2>
      <p>
        The theme a is fun playful design. There are no sharp corners. Instead
        the UI elements, such as buttons and containers, have rounded edges. The
        content, which are the menu, game lobby and most obviously the game
        board, is centered around the main square.
      </p>
      <ImgContainer
        src={consistencyImg}
        alt="Page layout is consistent, the main square is same size and shape relative to screen and holds main content"
        styleSize={"medium"}
      ></ImgContainer>

      <p>
        Here's an anatomy of displaying game state during play. Button has 3
        functions: display score, display current player turn, and customize
        player color/shape
      </p>
      <ImgContainer
        src={anatomyOfPlayerBtnImg}
        alt="Anatomy of Player Button, has three functions: Customize player, display player score, and display current player turn"
        styleSize={"medium"}
      ></ImgContainer>
      <p>
        As you can see there's no text display of the game state, such as which
        player's turn it is. The issue I had using text is that the board would
        have to shift down to accommodate it, this takes a lot of valuable space
        in mobile.
      </p>
      <ImgContainer
        src={deadSpaceImg}
        alt="Introducing text to display game state, results in spacing problems"
      ></ImgContainer>
      <p>
        Providing game state as text works nicely when the game is being played,
        but during other stages of the app, such as navigating the menu or the
        lobby, there's an unnecessary dead space between the main square and the
        player buttons. I could change the position of the main square only
        during gameplay, but personally I'm not comfortable translating this
        large piece of content just to fix this issue.
      </p>
      <p>
        The animations also ensure fun experience, such as placing the ‘X’ or
        ‘O’s, where the shapes “draw themselves” out, rather than suddenly
        appearing. Although animations are there to ensure experience or
        usability, some users would prefer none, which is why there’s a setting
        to reduce the animations, yay!
      </p>
      <Heading2>Tech Stack</Heading2>
      <p>
        The goal of this web app was to create it without installing client side
        frameworks or libraries. In the real world, this isn't a good idea,
        because you lose out on productivity, more importantly teamwork, since a
        framework ensures stability because you and your mates can reference the
        same material. But I wanted to challenge myself and I gained certain
        knowledge that wouldn't have, had I just stuck with libraries and
        frameworks.
      </p>
      <p>
        This bulk of the source code is the front-end and since that's my
        specialty, I didn't download any frameworks or libraries, such as
        Popover for tooltips or Anime.js for animations, and instead built
        similar ones from scratch. It was a difficult but fun process. I can't
        claim that I did everything by myself, a lot of the code I wrote was
        made possible by studying through resources such as StackOverflow,
        Github Issues, or other tech blogs.
      </p>
      <p>
        For the backend, which supports multiplayer, I didn't build the
        multiplayer logic from scratch. I used several frameworks such as
        Node.js and Colyseus.
      </p>
      <Heading3>Frontend</Heading3>
      <p>
        Normally a developer chooses a JavaScript Framework, such as React or
        Angular, because they take care of nitty gritty details of managing data
        that translates into visible UI, while ensuring performance and
        developer experience. Frameworks also ensure basic code structure. Since
        I'm not using a JavaScript Framework, I do have to follow a code
        architecture, otherwise it would be difficult to maintain the files and
        folders as the app scales. I choose the Model View Controller ( MVC )
        methodology.
      </p>

      <ImgContainer
        src={mvcDiagramImg}
        alt="MCV (Model View Controller) Diagram"
        styleSize={"small"}
      ></ImgContainer>
      <p>
        There are many variations of MVC methodology, here's how I set up mine.
        The Model holds the business logic, so in this case it holds the state
        of the game ( winner, who's turn ), and players ( which color, is the
        opponent human or ai ). The Views are responsible for transforming the
        state/data into UI displayed on the page. The Controllers are
        responsible for updating the Model, then use that updated state from
        Model to update the View.
      </p>

      <Video src={mvcDiagramVid}></Video>
      <p>
        Bringing back code architecture/maintenance topic, I choose Typescript.
        Typescript is a static type checker which compiles to Javascript, and it
        allows me to document my work, ensure type safety and productive
        maintaince.
      </p>
      <p>
        When updating DOM, there's no diffing Algorithm involved, it's done by
        hand. It's either very specific, where I target specific nodes, or I
        blow away the Node children by setting .innerHTML. Productivity wise,
        it's slow but I became comfortable using DOM APIs that I would have
        never known, had I just stuck with a framework where it abstracts most
        of them.
      </p>
      <Heading4>Tooltip</Heading4>
      <p>
        One straightforward way to have tooltip popup, is wrap the tooltip
        element inside the target, so that it's relative to the target's
        position. What's awesome is that it's a pure CSS solution. However there
        are cases where this is not possible, if target is inside a parent
        container where overflowed content is clipped/removed, the tooltip will
        be clipped as well.
      </p>
      <ImgContainer
        src={tooltipImg}
        alt="Comparing two tooltips, incorrect one is clipped by it's dropdown parent, and the other correctly displays in full view"
        styleSize={"medium"}
      ></ImgContainer>
      <p>
        This requires a setup where the tooltip resides at the root placement so
        that it will always appear on top, but requires Javascript to calculate
        where to place the tooltip next to the target and keep its position even
        when scrolling.
      </p>
      <Heading4>onFocusOut</Heading4>
      <p>
        One certain common dropdown behavior is when after opening the dropdown,
        when the user interacts outside the dropdown area, the dropdown would
        close. I created onFocusOut library to mimic this behavior. There's
        already a native event that could be used to create that behavior and
        it's 'focusout', but it requires some setup and preventing default
        behavior in order to make it work with nested dropdowns and close when
        \`Escape\` key is pressed. To be honest, I could've heavily used that
        native event 'focusout' for this library, but I didn't know it existed
        until I finished writing it. So how does it work? When a dropdown is
        active, there's three events that are added to the document, click,
        keyup and keydown. Those events listen to everything
      </p>

      <Heading3>Backend</Heading3>
      <p>
        In order to have multiplayer, this project requires a server. For the
        backend, I choose Nodejs since I continue using Javascript. Unlike the
        client side, for the server side, I used several libraries, Express and
        Colyseus.
      </p>
      <p>
        For Express, I only used it for setting CORS policy, which I set up
        where 3nRow page is allowed to communicate the multiplayer backend and
        other foriegn requests are blocked.
      </p>
      <p>
        Colyseus is a great multiplayer framework because I can set up different
        types of rooms, such as public and private. I don’t have to write
        complicated code to manage rooms and players, since Colyseus takes care
        of that for me.
      </p>
      <Heading3>Build Tools</Heading3>
      <p>
        For the bundler I used Webpack. It required a bit of setup when enabling
        css autoprefixer, which adds specific browser css properties for you in
        the output, but everything else was straightforward in getting Sass and
        Typescript to work.
      </p>
      <p>
        This website is hosted on Github pages, and Github has good
        documentation on how to host, and it’s straightforward as long as the
        target page is included in your source code. But since my project
        involves bundling via Webpack, I don’t want to include the bundle output
        that’s shipped to the client to be included in the source code. After a
        bit of googling I found several git commands to solve this issue, but I
        would have to write those commands every time I needed to update the
        website. Automation to the rescue! Using Bash script I was able to
        safely push the bundle code to Github pages.
      </p>
      <Heading2>Highlights</Heading2>
      <Heading3>Circular Dropdown animation</Heading3>

      <Video src={dropdownVid}></Video>
      <p>
        Circle dropdown is a feat, because it is cool, not common and hard to
        make it smooth during animation. Originally just animated clip property,
        resulted in laggy animation in the beginning. Needed a performant
        solution. It’s heavily based on google developer dropdown animation.
        Uses keyframes. However using keyframes lacks playback state, this means
        that if you click the button again during the middle of the animation,
        it will start from closing animation, rather than reversing from when it
        was interrupted.
      </p>

      <p>
        Originally I made it possible by animating the{" "}
        <HyperLink
          text={" clip-path "}
          href={"https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path"}
        ></HyperLink>
        property. It was pretty good, once in a while the animation would
        stutter but then when I ran it in Safari and it would have a noticeable
        laggy and glitchy animation.
      </p>

      <p>
        I needed a performant solution. To give you a quick background in how to
        build good animations, you must understand how the browser works during
        each frame. The browser runs at 60 frames per second, for each frame,
        the browser runs a pixel pipeline, where it executes in this order:
        JavaScript, Recalculate Style, Recalculate Layout, Painting and finally
        Composite.
      </p>

      <ImgContainer
        src={pixelPipelineImg}
        alt={
          "browser pixel render pipeline. Runs in following order: Javascript, Style, Layout, Painting then Composite."
        }
        styleSize={"xs-small"}
      ></ImgContainer>

      <p>
        In a gist, any JavaScript code that is scheduled, runs. Recalculate
        Style looks at if any styles are different. When using animation with
        CSS, the only two properties that ensure the best performance are
        “opacity” and “transform”. The reason is because animating on other
        properties such as “height” will trigger the browser to recalculate the
        elements in the page for every frame!
      </p>
      <p>
        Cool! But I didn’t know how I would achieve that dropdown effect by just
        using ‘scaling’ properties, because my dropdown during the expanding,
        it’s content would be scaled down as well, ending up like this.
      </p>
      <Video src={squashedVid}></Video>

      <p>
        Reading this
        <HyperLink
          text={" article from developers google"}
          href={
            "https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse"
          }
        ></HyperLink>
        , helped me out. Basically the solution from the article is generating
        two CSS Keyframes, which would run two scaling animations at the same
        time, the container would scale up, while the inner content would scale
        down. This required me to restructure my dropdown, and I was able to
        make it work and have that performant solution.
      </p>
      <p>
        But I ran into another roadblock, and that was dealing with interrupting
        the animation. The problem with the article’s solution, is that CSS
        Keyframes lacks a playback function.
      </p>
      <Video src={dropdownsComparisonVid}></Video>
      <p>
        This means that if you click the button again during the middle of the
        animation, it will start from the beginning of the closing animation,
        rather than reversing from when it was interrupted. Luckily CSS
        Keyframes has a “pause” functionality and I utilized that. Upon
        interruption, the animation would pause, then the dropdown will generate
        new Keyframes, after{" "}
      </p>

      <Heading3>Content Layout</Heading3>
      <p>
        Early I mentioned that keeping the content contained within the square
        required a technical solution, so here’s more in depth. Making the game
        board responsive was straightforward because it only required CSS.
        However making sure that the menu and lobby size was set relative to the
        board size, required JavaScript solution. Upon page load, the board as
        well as the player buttons are set relative to the viewport size. The
        same script that resizes the content is also fired when the viewport is
        resized. But since calculating and setting layout is expensive, I made
        sure it only fired after resizing was finished.
      </p>

      <Video src={resizeVid}></Video>
    </div>
  );
};

export default Post3nRow;
