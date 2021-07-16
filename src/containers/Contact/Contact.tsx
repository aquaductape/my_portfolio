import { batch, createState, For, JSX } from "solid-js";
import {
  iconEmailJSX,
  iconPhoneJSX,
} from "../../components/font-awesome/icons";
import S_Link from "../../components/S_Link/S_Link";

type TFormInput = {
  name: string;
  label: string;
  error: string;
  type: "email" | "textarea" | "text";
};

type TResult = {
  valid: boolean;
  errors: { name: string; msg: string }[];
};

const Contact = () => {
  const [state, setState] = createState({
    inputs: [
      {
        type: "email",
        name: "_replyto",
        label: "Your Email",
        error: "",
      },
      {
        type: "text",
        name: "_subject",
        label: "Subject",
        error: "",
      },
      {
        type: "textarea",
        name: "message",
        label: "Your Message",
        error: "",
      },
    ] as TFormInput[],
    submitState: "send" as "send" | "sending" | "sent" | "error",
  });
  let formRef!: HTMLFormElement;
  let ariaLiveRegionRef!: HTMLDivElement;
  let btnContentRef!: HTMLDivElement;

  const check = (formData: FormData) => {
    const regex = /\S+@\S+\.\S+/;
    const result: TResult = {
      valid: true,
      errors: [],
    };

    for (let [name, value] of formData) {
      value = value as string;

      if (!value.trim()) {
        result.errors.push({ name, msg: "Required" });
        result.valid = false;
        continue;
      }

      if (name === "_replyto") {
        if (!regex.test(value)) {
          result.errors.push({ name, msg: "Email is not valid" });
          result.valid = false;
          continue;
        }
      }
    }

    return result;
  };

  const btnHideThenReveal = (cb: Function) => {
    btnContentRef.animate(
      [
        {
          opacity: "1",
        },
        {
          opacity: "0",
        },
      ],
      { duration: 500 }
    ).onfinish = () => {
      cb();
      btnContentRef.animate(
        [
          {
            opacity: "0",
          },
          {
            opacity: "1",
          },
        ],
        { duration: 500 }
      );
    };
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const body = new URLSearchParams();
    const formData = new FormData(formRef);

    for (const [name, value] of formData) {
      body.append(name, value as string);
    }

    const validationResult = check(formData);

    if (!validationResult.valid) {
      batch(() => {
        validationResult.errors.forEach((error) => {
          const index = state.inputs.findIndex(
            (input) => input.name === error.name
          )!;
          setState("inputs", [index], "error", error.msg);
        });
      });
      return;
    }

    btnHideThenReveal(() => setState("submitState", "sending"));
    try {
      await fetch("https://formspree.io/f/mwkwzydw", {
        method: "POST",
        body,
        headers: {
          Accept: "application/json",
        },
      });

      btnHideThenReveal(() => setState("submitState", "sent"));
      btnHideThenReveal(() => {
        setState("submitState", "sent");
        formRef.reset();
      });

      setTimeout(() => {
        btnHideThenReveal(() => setState("submitState", "send"));
      }, 3000);
    } catch (err) {
      btnHideThenReveal(() => setState("submitState", "error"));
    }
  };

  const onKeyDown = (e: Event) => {
    const target = e.target as HTMLElement;
    const dataInput = target.dataset.input;
    let foundIndex!: number;

    if (!dataInput) return;

    const name = target.getAttribute("name");

    state.inputs.some((input, idx) => {
      if (input.name === name) {
        if (!input.error) return true;
        foundIndex = idx;
        return true;
      }
    });

    if (foundIndex == null) return;

    setState("inputs", [foundIndex], "error", "");
  };

  const buttonEl = () => {
    let content = "";

    switch (state.submitState) {
      case "send":
        content = "Send Message";
        break;
      case "sending":
        content = "Sending ...";
        break;
      case "sent":
        content = "Success!";
        break;
      case "error":
        content = "Server Error";
        break;
    }
    return (
      <button class="btn btn-send-message" type="submit">
        <div ref={btnContentRef} class="btn-send-message__content">
          <span>{content}</span>
        </div>
      </button>
    );
  };

  return (
    <section id="contact" class="contact-me" tabindex="-1">
      {/* <div
        ref={ariaLiveRegionRef}
        role="region"
        aria-live="polite"
        className="live-region sr-only"
      ></div> */}
      <h2 className="section-title">Contact Me</h2>
      <div className="contact-container">
        <div class="card card-contact-info">
          <div class="contact-info">
            <h3 class="contact-info-title">Contact Info</h3>
            <ul class="content">
              <li class="list-item">
                <span class="icon">{iconEmailJSX()}</span>
                <span>
                  <S_Link>
                    <a
                      class="contact-email"
                      href="mailto:caleb1taylor2@gmail.com"
                    >
                      caleb1taylor2@gmail.com
                    </a>
                  </S_Link>
                </span>
              </li>
              <li class="list-item">
                <span class="icon">{iconPhoneJSX()}</span>
                <span>(323) 637-1232</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="card email-box">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
            novalidate
          >
            <div class="inputs">
              <For each={state.inputs}>{InputContainer}</For>
            </div>
            {buttonEl()}
          </form>
        </div>
      </div>
    </section>
  );
};

const InputContainer = (input: TFormInput) => {
  let inputEl: JSX.Element;

  switch (input.type) {
    case "email":
    case "text":
      inputEl = <input data-input="true" type={input.type} name={input.name} />;
      break;
    case "textarea":
      inputEl = <textarea data-input="true" name={input.name}></textarea>;
      break;
  }

  return (
    <label class="inputs-label" aria-required="true">
      <div class="label-container">
        <div>{input.label}</div>
        <div
          className="label-error"
          style={input.error ? { padding: "0 5px" } : {}}
        >
          {input.error}
          {input.error ? "*" : ""}
        </div>
      </div>
      {inputEl}
    </label>
  );
};

export default Contact;
