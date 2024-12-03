import { define } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";
// import { LoginForm } from "../../public/scripts/login-form.js";

export class RegisterViewElement extends LitElement {
  static uses = define({
    // "login-form": LoginForm,
  });

  render() {
    return html`
      <article>
        <main class="page">
          <login-form api="/auth/login">
            <h2 slot="title">Sign in and get outside!</h2>
          </login-form>
          <p class="register">
            <a href="/register"> Register as a new user!</a>
          </p>
        </main>
      </article>
    `;
  }

  static styles = [
    resetCSS,
    pageCSS,
    css`
      article {
        display: flex;
        height: 70vh;
        align-items: center;
        justify-content: center;
      }
      h2 {
        margin-bottom: var(--margin-m);
      }
      p {
        display: flex;
        justify-content: center;
        margin-top: var(--margin-m);
      }
    `,
  ];
}
