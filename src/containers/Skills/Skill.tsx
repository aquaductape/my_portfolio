import { JSX } from "solid-js";

interface ISkillProps {
  title: string;
  icon: (id?: number) => JSX.Element;
}

const Skill = ({ title, icon }: ISkillProps) => {
  let id = 0;

  return (
    <li class="skills-item">
      <span aria-hidden="true">{icon(id)}</span>
      <p class="title">{title}</p>
    </li>
  );
};

export default Skill;
