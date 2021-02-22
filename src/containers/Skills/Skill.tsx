// import { createSignal } from "solid-js";
import { JSX } from "solid-js";

interface ISkillProps {
  title: string;
  icon: () => JSX.Element;
}

const Skill = ({ title, icon }: ISkillProps) => {
  // const [animateIconEnter, setAnimateIconEnter] = createSignal<any>(null);
  // const [animateIconLeave, setAnimateIconLeave] = createSignal<any>(null);
  // const [hasToggle, setHasToggle] = createSignal(false);
  // const liRef = useRef<HTMLLIElement>(null);
  // const svgId = `skill-icon-${title}`;
  // const circleId = `.${svgId}__clipPath-circle`;

  // onMount(() => {
  //   const animation = gsap.fromTo(
  //     circleId,
  //     {
  //       attr: {
  //         r: 1,
  //       },
  //       scale: 0,
  //       transformOrigin: "center",
  //     },
  //     {
  //       scale: 20,
  //       transformOrigin: "center",
  //       duration: 1.5,
  //       paused: true,
  //     }
  //   );
  //   setAnimateIconEnter(() => animation.timeScale(1).play());
  //   setAnimateIconLeave(() => animation.timeScale(2).reverse());
  // });

  return (
    <li className="skills-item">
      <span aria-hidden="true">{icon()}</span>
      <p class="title">{title}</p>
    </li>
  );
  // }
};

export default Skill;
