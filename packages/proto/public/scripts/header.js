import { css, html, shadow } from "@calpoly/mustang";
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
  }
}
