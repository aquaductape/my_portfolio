import { Component, For, JSX } from "solid-js";
import { Cevron } from "../../components/svg/icons/icons";
import {
  bash,
  clarifai,
  colyseus,
  css,
  html,
  javascript,
  nodejs,
  react,
  redux,
  sass,
  svg,
  typescript,
  webpack,
  npm,
  testcafe,
  solidJS,
  rollup,
  vite,
} from "../../components/svg/icons/programming-icons";
import { capitalize } from "../../utils";

const programingIcons = {
  bash,
  clarifai,
  colyseus,
  css,
  html,
  javascript,
  nodejs,
  react,
  redux,
  sass,
  svg,
  typescript,
  webpack,
  rollup,
  solidJS,
  vite,
  testcafe,
  npm,
};

const Icon = ({ name, icon }: { name: string; icon: () => JSX.Element }) => {
  return (
    <div class="icon" data-flip-key={`programming-icon-${name}`}>
      {icon()}
    </div>
  );
};

export const TechIconsCollapsed = ({ icons }: { icons: string[] }) => {
  return (
    <>
      <div class="header">
        <div class="text">
          <em>Tech Used</em>
        </div>
        <div class="cevron">
          <Cevron></Cevron>
        </div>
        <div class="border"></div>
      </div>
      <div class="icons">
        <For each={icons}>
          {(icon) => {
            const iconJSX = programingIcons[icon as "bash"];
            return <Icon name={icon} icon={iconJSX}></Icon>;
          }}
        </For>
      </div>
    </>
  );
};

const Category = ({
  title,
  icons,
  cevron,
}: {
  title: string;
  icons: string[];
  cevron?: boolean;
}) => {
  return (
    <>
      <div class="header">
        <div class="text">
          <em>{title}</em>
        </div>
        {cevron && (
          <div class="cevron">
            <Cevron direction={"bottom"}></Cevron>
          </div>
        )}
        <div class="border"></div>
      </div>
      <div class="icons">
        <TechIconsExpandedInner icons={icons}></TechIconsExpandedInner>
      </div>
    </>
  );
};

export const TechIconsExpanded = ({
  skills,
}: {
  skills: {
    frontend: string[];
    backend: string[];
    buildTool: string[];
    api: string[];
    testing: string[];
    packageManager: string[];
  };
}) => {
  const { frontend, backend, buildTool, api, packageManager, testing } = skills;

  return (
    <>
      {frontend.length && (
        <Category title="Frontend" icons={frontend} cevron={true}></Category>
      )}
      {backend.length && <Category title="Backend" icons={backend}></Category>}
      {buildTool.length && (
        <Category title="Build Tools" icons={buildTool}></Category>
      )}
      {api.length && <Category title="API" icons={api}></Category>}
      {testing.length && <Category title="Testing" icons={testing}></Category>}
      {packageManager.length && (
        <Category title="Package Manager" icons={packageManager}></Category>
      )}
    </>
  );
};

export const getTitle = (icon: string) => {
  switch (icon) {
    case "css":
    case "html":
    case "svg":
      return icon.toUpperCase();
    case "nodejs":
      return "NodeJS";
    case "npm":
      return "npm";
    case "testcafe":
      return "TestCafe";
    default:
      return capitalize(icon);
  }
};

const TechIconsExpandedInner = ({ icons }: { icons: string[] }) => {
  return (
    <For each={icons}>
      {(icon) => {
        const iconJSX = programingIcons[icon as "bash"];

        const title = getTitle(icon);

        return (
          <div class="icon-box">
            <Icon name={icon} icon={iconJSX}></Icon>
            <div class="title">{title}</div>
          </div>
        );
      }}
    </For>
  );
};

const TechIcons: Component<{
  toggle: () => boolean;
  collapsedIcons: any;
  skills: any;
  onClick: (e: MouseEvent) => void;
  ref: any;
}> = (props) => {
  const { onClick } = props;
  return (
    <button
      class={`tech-icons ${props.toggle() ? "active" : ""}`}
      aria-label={`Tech Used: ${props.collapsedIcons.join(", ")}`}
      onClick={onClick}
      ref={props.ref}
    >
      {props.toggle() ? (
        <div class="expanded">
          <TechIconsExpanded skills={props.skills}></TechIconsExpanded>
        </div>
      ) : (
        <div class="collapsed">
          <TechIconsCollapsed icons={props.collapsedIcons}></TechIconsCollapsed>
        </div>
      )}
    </button>
  );
};

export default TechIcons;
