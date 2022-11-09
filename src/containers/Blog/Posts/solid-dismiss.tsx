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
import tabbingVid from "../../../assets/solid-dismiss/video/tabbing.mp4";
import tabbingWrongVid from "../../../assets/solid-dismiss/video/tabbing-wrong.mp4";
import tabbingOkVid from "../../../assets/solid-dismiss/video/tabbing-ok.mp4";
import tabbingCorrectVid from "../../../assets/solid-dismiss/video/tabbing-correct.mp4";
import stacksVid from "../../../assets/solid-dismiss/video/stacks.mp4";
import dropdownVid from "../../../assets/solid-dismiss/video/dropdown.mp4";
import modalVid from "../../../assets/solid-dismiss/video/modal.mp4";
import demoPageVid from "../../../assets/solid-dismiss/video/demo-page.mp4";
import beforeAfterCodeImg from "../../../assets/solid-dismiss/img/before_after_code.png";
import intellisenseImg from "../../../assets/solid-dismiss/img/intellisense.png";

const PostSolidDismiss = () => {
  const [_, { setTableOfContents }] = useContext(GlobalContext);
  const title = "Solid Dismiss";
  const skills = CONSTANTS.projects.find(
    (project) => project.project === title
  )!.skills;

  const tableOfContents: TTableOfContentsInput[] = [
    { title: "Summary" },
    {
      title: "Features",
      children: [
        {
          title: "Mount Popup Anywhere",
        },
        { title: "Maintain Logical Tabindex" },
        { title: "Manage Stacks of Popups" },
        { title: "Customize Popup Behavior" },
      ],
    },
    {
      title: "API",
    },
    {
      title: "Testing",
    },
    {
      title: "Documentation",
    },
    {
      title: "Demo Page",
    },
  ];

  setTableOfContents({ contents: tableOfContents, anchorId: "summary" });

  return (
    <div class={style["blog-post"]}>
      <MainTableOfContents />
      <Heading2>Summary</Heading2>
      <p>
        It’s a utility library, for developers, to create “click outside”
        behavior to close dropdown/popup menus. It's published as an{" "}
        <HyperLink
          text="npm package"
          href="https://www.npmjs.com/package/solid-dismiss"
        />
        , which is currently used by{" "}
        <HyperLink
          text="29 accounts"
          href="https://github.com/aquaductape/solid-dismiss/network/dependents"
        />{" "}
        including SolidJS.
      </p>
      <p>
        Closing dropdowns are triggered either by clicking outside the dropdown,
        reclicking the menu button, pressing “Escape” on the keyboard, or
        navigating outside the dropdown via “Tab” on the keyboard.
      </p>
      <p>
        I created this library to contribute to Solid's new growing ecosystem,
        in order to encourage developer adoption towards the{" "}
        <HyperLink text="SolidJS" href="https://www.solidjs.com/"></HyperLink>{" "}
        framework.
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
      <Heading3>Mount Popup anywhere</Heading3>
      <p>
        It’s common for the dropdown to be a direct sibling to the button that
        toggles it in the markup. However there are situations where the
        dropdown is located elsewhere or even mounted to the root of the html,
        and this package handles those situations.
      </p>
      <Heading3>Maintain Logical Tabindex</Heading3>
      <Video src={tabbingVid}></Video>
      <p>
        When tabbing throughout the page, it’s important to maintain tabbing
        order to match the natural order of the page.
      </p>
      <p>
        When a developer makes a dropdown or popup that lives next to the button
        that toggles it, they don’t have to think about dealing with tabbing or
        not even aware, because the dropdown content flows with the natural
        order.
      </p>
      <p>
        The same cannot be said if the popup is located elsewhere in the dom or
        mounted at the root of the page, because when the user tabs, the next
        focusable element is not a child inside the popup but the item next to
        the button, therefore making the popup inaccessible via keyboard.{" "}
      </p>
      <Video src={tabbingWrongVid}></Video>
      <p>
        The developer can naively fix this by focusing on the container and then
        upon exit focus on the button that toggled it.
      </p>
      <Video src={tabbingOkVid}></Video>
      <p>
        Dismiss library takes it a step further by correctly tabbing to the next
        focusable element, just like how the browser would handle tabbing.{" "}
      </p>
      <Video src={tabbingCorrectVid}></Video>
      <p>
        If a developer tried to write the same behavior, they would have to
        query in a manner that is performant. Then once getting the item, they
        have to make sure the tabbable element is not hidden, or if the element
        is an iframe, get it’s contextDocument in order to get it’s tabbable
        element.
      </p>
      <Heading3>Manage Stacks of Popups</Heading3>

      <Video src={stacksVid}></Video>
      <p>
        Most dismiss libraries don’t take into consideration when popups that
        open more popups. So when pressing escape, it will close all popups,
        when it should only close the most recent one at time.
      </p>
      <p>
        This Dismiss library is smart enough to close the popup(s) based where
        the click/focus is applied and when Escape key is pressed will close the
        most recent one.
      </p>
      <Heading3>Customize Popup Behavior</Heading3>
      <p>
        There are different variations of popups such as Modals, Dropdowns and
        Tooltips.
      </p>
      <p>
        Modals (or Dialog) are popups where it’s content has to be interacted
        with, so the user cannot tab outside of it and the page cannot be
        selected since it's covered by an overlay. That’s also why when Modal is
        present you don’t see hover state when you mouse over interactive
        elements on the page, because the overlay covers the whole page.
      </p>
      <Video src={modalVid}></Video>
      <p>
        Dropdowns allow page interaction, so when clicking outside to close, if
        that click happens to be on an interactive element, it will fire an
        event.
      </p>
      <Video src={dropdownVid}></Video>
      <p>
        Tooltips open when hovered, but when clicked it’s active state persists.
      </p>
      <p>
        But it doesn’t have to be rigid, there’s fluidity to customizing their
        behavior. Dismiss API allows dropdowns to have overlay, or when clicking
        overlay focuses on popup rather than closing it.
      </p>

      <Heading2>API</Heading2>
      <p>
        Designing the API, or application programming interface, can be a tricky
        process. The names of the property should be self documenting where the
        developer can get an idea of what it does. So it’s a balancing act
        between names that are too cryptic or too verbose. There are cases where
        name alone cannot communicate what it does so providing a description
        alongside it is a must. So it’s a balancing act between names that are
        too cryptic or too verbose. There are cases where name alone cannot
        communicate what it does so providing a description alongside it is a
        must.
      </p>
      <p>
        The Dismiss component has over 25 properties, but only 3 are required,
        which are menuButton, open, and setOpen. I made sure that even though
        this package has a lot of properties which enables features and
        customizability, the developer can use default basic behavior with a low
        learning curve.
      </p>
      <p>
        I wanted to make this package as seamless as possible that way
        developers can use it with existing dropdowns with little to no
        friction.
      </p>
      <ImgContainer
        src={beforeAfterCodeImg}
        alt="Code before and after"
        styleSize={"medium"}
      ></ImgContainer>
      <p>
        Originally I designed Dismiss to wrap both the button and the popup,
        which made writing the dismiss behavior based on tabbing much easier,
        however this only worked if the dropdown was a direct sibling of the
        button in the markup, this meant that it didn’t allow developers to use
        this library in situations where the dropdown was located elsewhere in
        the markup or mounted to body.
      </p>
      <Heading2>Testing</Heading2>
      <p>
        At first I had a dedicated testing page, to manually test it by hand.
        But once I added more features and had to make sure it worked across
        every modern browser, using testing software was a must.
      </p>
      <p>
        The main reason why writing this package is complex, is dealing with
        focus, especially when using the keyboard. Therefore the bulk of the
        tests would make sure the Tabbing behavior works. I didn’t want to use
        testing libraries that mock or simulate user inputs. I wanted to use
        software that would actually trigger real user events, because not all
        browsers fire events that relate to focusing in the same way, I wanted
        to make sure the tests replicated that.
      </p>
      <p>
        For these reasons I found Testcafe, an end to end testing software that
        actually launches a browser that runs the tests.
      </p>
      <Heading2>Documentation</Heading2>
      <p>
        I wrote this library with Typescript, which enforces JavaScript to have
        syntax that is strongly typed. This is good because properties of
        Dismiss API accept certain types, if the developer were to pass an
        incorrect type, their IDE or compiler would notify them. However type
        information is not good enough, you need to have descriptions on every
        property on what it does and list downsides/edge cases.
      </p>
      <ImgContainer
        src={intellisenseImg}
        alt="Code before and after"
        styleSize={"medium"}
      ></ImgContainer>

      <Heading2>Demo Page</Heading2>
      <Video src={demoPageVid}></Video>
      <p>
        Sometimes documentation falls short because some people (such as me),
        even though they read the documentation of the API, don’t know how to
        use it in a general way, so that’s where examples/tutorials step in.
      </p>
      <p>
        I used many libraries where they had plenty of documentation, but they
        didn’t show examples to help reinforce the learning of the documentation
        and ease the learning curve. Those times I yell in my head “Can you
        please provide an example that’s used in the real world?!”.
      </p>
      <p>
        I created a dedicated web page that shows the examples, where one side
        is the demo and the other is the code, as well as documentation. For the
        examples I made sure to showcase situations or edge cases that a
        developer would use this library for, such as making it work with other
        popular libraries such as Bootstrap or Popper.js.
      </p>
      <p>
        The tech behind building this page are SolidJS for the JavaScript
        framework, SCSS modules for styling, and Vite for build tooling.
      </p>
    </div>
  );
};
export default PostSolidDismiss;
