import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class LoginForm extends HTMLElement {
  static template = html`
    <template>
      <form>
        <slot name="title">
          <h2>Sign in with Username and Password</h2>
        </slot>
        <label>
          <span>
            <slot name="username">Username</slot>
          </span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>
            <slot name="password">Password</slot>
          </span>
          <input type="password" name="password" />
        </label>
        <slot name="submit">
          <button type="submit">Sign In</button>
        </slot>
      </form>
    </template>
  `;

  static styles = css`
    form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    label {
      margin: var(--margin-s);
      padding: 0;
    }
    button {
      margin-top: var(--margin-m);
      font-size: var(--size-type-med);
      border-radius: var(--radius-med);
    }
  `;

  constructor() {
    super();

    shadow(this)
      .template(LoginForm.template)
      .styles(reset.styles, page.styles, LoginForm.styles);

    this.form.addEventListener("submit", (event) =>
      submitLoginForm(
        event,
        this.getAttribute("api"),
        this.getAttribute("redirect") || "/"
      )
    );
  }

  get form() {
    return this.shadowRoot.querySelector("form");
  }
}

function submitLoginForm(event, endpoint, redirect) {
  event.preventDefault();
  const form = event.target.closest("form");
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Object.fromEntries(data));

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 200)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .then((payload) => {
      const { token } = payload;

      form.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect }],
        })
      );
    })
    .catch((err) => console.log("Error submitting form:", err));
}
