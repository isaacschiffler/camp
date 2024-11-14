import { css, html, HtmlString, CssString } from "@calpoly/mustang/server";
import renderPage from "./renderPage";

export class LoginPage {
  render() {
    return renderPage({
      scripts: [
        `
        import { define, Auth } from "@calpoly/mustang";
        import { LoginForm } from "/scripts/login-form.js";
        import { HeaderElement } from "/scripts/header.js";

        define({
          "mu-auth": Auth.Provider,
          "login-form": LoginForm,
          "bp_header": HeaderElement,
        })
        `,
      ],
      styles: [
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
      ],
      body: html`
        <body>
          <mu-auth provides="blazing:auth">
            <bp-header></bp-header>
            <article>
              <main class="page">
                <login-form api="/auth/login">
                  <h2 slot="title">Sign in and get outside!</h2>
                </login-form>
                <p class="register">
                  <a href="./register"> Register as a new user!</a>
                </p>
              </main>
            </article>
          </mu-auth>
        </body>
      `,
    });
  }
}
