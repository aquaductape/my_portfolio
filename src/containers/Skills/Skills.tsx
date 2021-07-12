import { For, JSX } from "solid-js";
import {
  css,
  git,
  html,
  js,
  react,
  redux,
  sass,
  typescript,
} from "../../components/svg/icons/animated-icons";

import Skill from "./Skill";

const Skills = () => {
  const icons: [() => JSX.Element, string][] = [
    [html, "HTML"],
    [css, "CSS"],
    [sass, "Sass"],
    [js, "JavaScript"],
    [typescript, "TypeScript"],
    [react, "React"],
    [redux, "Redux"],
    [git, "Git"],
    // [npm, "NPM"]
    // [nodejs, "NodeJS"],
    // [mongodb, "MongoDB"],
    // [mysql, "MySQL"]
  ];

  const skillItems = (
    <For each={icons}>
      {([icon, title]) => {
        return <Skill icon={icon} title={title}></Skill>;
      }}
    </For>
  );

  return (
    <section id="skills" className="skills" tabindex="-1">
      <h2 className="section-title skills-title">Skills</h2>

      <ul className="skills-group">{skillItems}</ul>
    </section>
  );
};

export default Skills;
