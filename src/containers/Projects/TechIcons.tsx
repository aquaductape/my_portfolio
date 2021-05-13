import { For, JSX } from "solid-js";
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
      <div className="header">
        <div className="text">
          <em>Tech Used</em>
        </div>
        <div className="cevron">
          <Cevron></Cevron>
        </div>
        <div className="border"></div>
      </div>
      <div className="icons">
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
      <div className="header">
        <div className="text">
          <em>{title}</em>
        </div>
        {cevron && (
          <div className="cevron">
            <Cevron direction={"bottom"}></Cevron>
          </div>
        )}
        <div className="border"></div>
      </div>
      <div className="icons">
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
  };
}) => {
  const { frontend, backend, buildTool, api } = skills;

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
    </>
  );
};

const TechIconsExpandedInner = ({ icons }: { icons: string[] }) => {
  return (
    <For each={icons}>
      {(icon) => {
        const iconJSX = programingIcons[icon as "bash"];
        const getTitle = () => {
          switch (icon) {
            case "css":
            case "html":
            case "svg":
              return icon.toUpperCase();
            case "nodejs":
              return "NodeJS";
            default:
              return capitalize(icon);
          }
        };

        const title = getTitle();

        return (
          <div className="icon-box">
            <Icon name={icon} icon={iconJSX}></Icon>
            <div className="title">{title}</div>
          </div>
        );
      }}
    </For>
  );
};
