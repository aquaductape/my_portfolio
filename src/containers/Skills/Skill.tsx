import { JSX } from "solid-js";

interface ISkillProps {
  title: string;
  icon: () => JSX.Element;
}

const Skill = ({ title, icon }: ISkillProps) => {
  return (
    <li className="skills-item">
      <span aria-hidden="true">{icon()}</span>
      <p class="title">{title}</p>
    </li>
  );
};

export default Skill;
