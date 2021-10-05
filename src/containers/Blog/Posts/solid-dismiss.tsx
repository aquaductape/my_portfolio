import style from "./Post.module.scss";
import { useContext } from "solid-js";
import CONSTANTS from "../../../constants";
import { GlobalContext } from "../../../context/context";
import {
  MainTableOfContents,
  TTableOfContentsInput,
} from "../TableOfContents/TableOfContents";
import { Heading2, HyperLink } from "./Post";
import TechList from "./TechList";

const PostSolidDismiss = () => {
  const [_, { setTableOfContents }] = useContext(GlobalContext);
  const title = "Solid Dismiss";
  const skills = CONSTANTS.projects.find(
    (project) => project.project === title
  )!.skills;

  const tableOfContents: TTableOfContentsInput[] = [{ title: "Summary" }];

  setTableOfContents({ contents: tableOfContents, anchorId: "summary" });

  return (
    <div class={style["blog-post"]}>
      <MainTableOfContents />
      <Heading2>Summary</Heading2>
      <p>
        It’s a utility library, for developers, to create “click outside”
        behavior to close dropdown/popup menus.
      </p>
      <p>
        Closing dropdowns are triggered either by clicking outside the dropdown,
        reclicking the menu button, pressing “Escape” on the keyboard, or
        navigating outside the dropdown via “Tab” on the keyboard.
      </p>
      <p>
        I created this library to contribute to Solid's new growing ecosystem,
        in order to encourage developer adoption towards the{" "}
        <HyperLink text="Solid" href="https://www.solidjs.com/"></HyperLink>{" "}
        framework.
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
    </div>
  );
};
export default PostSolidDismiss;
