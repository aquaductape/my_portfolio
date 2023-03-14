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
  solidJS,
  tailwind,
} from "../../components/svg/icons/animated-icons";
import Skill from "./Skill";

const Skills = () => {
  const icons: [(id: number) => JSX.Element, string][] = [
    [html, "HTML"],
    [css, "CSS"],
    [sass, "Sass"],
    [tailwind, "Tailwind CSS"],
    [js, "JavaScript"],
    [typescript, "TypeScript"],
    [react, "React"],
    [redux, "Redux"],
    [solidJS, "SolidJS"],
    [git, "Git"],
    // [npm, "NPM"]
    // [nodejs, "NodeJS"],
    // [mongodb, "MongoDB"],
    // [mysql, "MySQL"]
  ];

  const skillItems = (
    <For each={icons}>
      {([icon, title]) => {
        return <Skill icon={icon as any} title={title}></Skill>;
      }}
    </For>
  );

  return (
    <section id="skills" class="skills" tabindex="-1">
      <h2 class="section-title skills-title">Skills</h2>

      <ul class="skills-group">{skillItems}</ul>
    </section>
  );
};

export default Skills;
