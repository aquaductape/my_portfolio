import { For } from "solid-js";
import { getTitle } from "../../Projects/TechIcons";
import style from "./Post.module.scss";

const TechList = ({ items }: { items: string[] }) => {
  return (
    <ul class={style["tech-group"]}>
      <For each={items}>
        {(item) => {
          return <li class={style["tech-item"]}>{getTitle(item)}</li>;
        }}
      </For>
    </ul>
  );
};

export default TechList;
