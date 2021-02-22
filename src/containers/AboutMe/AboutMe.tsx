import {
  // iconGithub,
  // iconLinkedin,
  // iconStackOverflow,
  iconGithubJSX,
  iconLinkedinJSX,
  iconStackOverflowJSX,
} from "../../components/font-awesome/icons";

import resumePDF from "../../assets/pdf/Caleb_Taylor_Resume.pdf";
import { For, JSX } from "solid-js";
import MonochromeCharacterLogo from "../../components/svg/logos/MonochromeCharacterLogo";
import {
  AccessabilityIcon,
  AirplaneIcon,
  ResponsiveIcon,
  ResumeIcon,
} from "../../components/svg/icons/icons";

type TSocialLink = {
  href: string;
  ariaLabel: string;
  download?: string;
  icon: string | (() => JSX.Element);
};

const AboutMe = () => {
  const socialLinks: TSocialLink[] = [
    {
      ariaLabel: "Github",
      href: "https://github.com/aquaductape",
      icon: iconGithubJSX,
    },
    {
      ariaLabel: "Stack Overflow",
      href: "https://stackoverflow.com/users/8234457/caleb-taylor",
      icon: iconStackOverflowJSX,
    },
    {
      ariaLabel: "LinkedIn",
      href: "https://github.com/aquaductape",
      icon: iconLinkedinJSX,
    },
    {
      ariaLabel: "Download PDF Resume",
      href: resumePDF,
      download: "Caleb_Taylor_Resume.pdf",
      icon: ResumeIcon,
    },
  ];

  return (
    <section id="about-me" class="about-me">
      <div class="about-me-inner">
        <div class="about-me-content">
          <div class="about-me-contact">
            <h1
              id="about-me-logo"
              class="about-me-logo"
              aria-label="Caleb Taylor"
              tabindex="-1"
            >
              <MonochromeCharacterLogo></MonochromeCharacterLogo>
            </h1>
            <div class="contact-item">
              <div className="contact-phone">
                <span class="sr-only">Phone Number: </span>(323) 637-1232
              </div>
            </div>
            <div class="contact-item">
              <a class="contact-email" href="mailto:caleb1taylor2@gmail.com">
                caleb1taylor2@gmail.com
              </a>
            </div>
          </div>
          <div class="about-me-intro">
            <p class="about-me-intro__declaration">
              Dedicated self-taught Front-End developer.
            </p>
            <p id="project-promises">Building projects that are:</p>
            <ul aria-labelledby="project-promises" class="about-me-group-list">
              <li class="about-me-list">
                <span class="about-me-icon">
                  <ResponsiveIcon></ResponsiveIcon>
                </span>
                Responsive
              </li>
              <li class="about-me-list">
                <span class="about-me-icon">
                  <AirplaneIcon></AirplaneIcon>
                </span>
                Performant
              </li>
              <li class="about-me-list">
                <span class="about-me-icon">
                  <AccessabilityIcon></AccessabilityIcon>
                </span>
                Accessible
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="about-me-social-links">
        <ul class="social-links">
          <For each={socialLinks}>
            {(item) => {
              return (
                <li class="social-links__li" data-link-name={item.ariaLabel}>
                  <a
                    title={item.ariaLabel}
                    href={item.href}
                    rel="noreferrer noopener"
                    target="_blank"
                    download={item.download ? item.download : null}
                    innerHTML={
                      typeof item.icon === "string" ? item.icon : undefined
                    }
                  >
                    {typeof item.icon === "string" ? undefined : item.icon}
                  </a>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </section>
  );
};

export default AboutMe;
