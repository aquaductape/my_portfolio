import { JSX } from "solid-js";
import { Chrome, ChromeForAndroid } from "../../lib/browserInfo";

interface ISkillProps {
  title: string;
  icon: (id?: number) => JSX.Element;
}

const Skill = ({ title, icon }: ISkillProps) => {
  let id = 0;
  const onMouseEnter = (e: MouseEvent) => {
    // Chrome 92 has svg degradation animation
    if (!Chrome || ChromeForAndroid) return;
    const target = e.currentTarget as HTMLElement;

    target.classList.add("animate-on-radius");
    return;
  };

  return (
    <li class="skills-item" onMouseEnter={onMouseEnter}>
      <span aria-hidden="true">{icon(id)}</span>
      <p class="title">{title}</p>
    </li>
  );
};

export default Skill;
