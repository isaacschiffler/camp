import { css, html, shadow, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class HeaderElement extends HTMLElement {
  static template = html`
    <template>
      <header>
        <a href="index.html">
          <h1 class="logo">Backpack</h1>
        </a>

        <a href="profile.html">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
    </template>
  `;

  static styles = css``;

  constructor() {
    super();
    shadow(this)
      .template(HeaderElement.template)
      .styles(reset.styles, page.styles, HeaderElement.styles);

    this._signout = this.shadowRoot.querySelector("#signout");
    this._userid = this.shadowRoot.querySelector("#userid");

    // this._signout.addEventListener("click", (event) =>
    //   event.relay(event, "auth:message", ["auth/signout"])
    // );
  }

  // _authObserver = new Observer(this, "backpack:auth");

  // connectedCallback() {
  //   this._authObserver.observe(({ user }) => {
  //     if (user && user.username !== this.userid) {
  //       this.userid = user.username;
  //     }
  //   });
  // }

  // get userid() {
  //   return this._userid.textContent;
  // }

  // set userid(id) {
  //   if (id === "anonymous") {
  //     this._userid.textContent = "";
  //     this._signout.disabled = true;
  //   } else {
  //     this._userid.textContent = id;
  //     this._signout.disabled = false;
  //   }
  // }
}
