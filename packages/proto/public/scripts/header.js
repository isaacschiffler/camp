import {
  css,
  html,
  define,
  shadow,
  Observer,
  Events,
  Dropdown,
} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class HeaderElement extends HTMLElement {
  static uses = define({
    "mu-dropdown": Dropdown.Element,
  });

  static template = html`
    <template>
      <header>
        <a href="http://localhost:3000/index.html">
          <h1 class="logo">Backpack</h1>
        </a>
        <nav>
          <mu-dropdown class="dropdown">
            <a slot="actuator">
              Hi,&nbsp
              <span id="userid"></span>
              !
            </a>
            <menu>
              <li>
                <label class="dark-mode-switch">
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout">Sign Out</a>
              </li>
              <li class="when-signed-out">
                <a href="/login">Sign In</a>
              </li>
            </menu>
          </mu-dropdown>
        </nav>
        <a href="profile.html">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
    </template>
  `;

  static styles = css`
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
    }
    a[slot="actuator"] {
      color: var(--color-main-font);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "camper";
    }
    menu {
      background-color: var(--color-background-bottom-header);
    }
    menu a {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }
    li {
      display: grid;
    }
    li a {
      padding-left: var(--margin-s);
      padding-right: var(--margin-s);
      padding-bottom: var(--margin-s);
      justify-self: center;
    }
    li label {
      padding-left: 0;
      padding-right: var(--margin-s);
      justify-self: center;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(HeaderElement.template)
      .styles(reset.styles, page.styles, HeaderElement.styles);

    this._signout = this.shadowRoot.querySelector("#signout");
    this._userid = this.shadowRoot.querySelector("#userid");

    this._signout.addEventListener("click", (event) =>
      Events.relay(event, "auth:message", ["auth/signout"])
    );

    const dm = this.shadowRoot.querySelector(".dark-mode-switch");

    dm.addEventListener("click", (event) =>
      Events.relay(event, "darkmode", {
        checked: event.target.checked,
      })
    );
  }

  _authObserver = new Observer(this, "backpack:auth");

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });
  }

  get userid() {
    return this._userid.textContent;
  }

  set userid(id) {
    if (id === "anonymous") {
      this._userid.textContent = "";
      this._signout.disabled = true;
    } else {
      this._userid.textContent = id;
      this._signout.disabled = false;
    }
  }

  static initializeOnce() {
    function toggleDarkMode(page, checked) {
      page.classList.toggle("darkmode", checked);
    }

    document.body.addEventListener("darkmode", (event) =>
      toggleDarkMode(event.currentTarget, event.detail.checked)
    );
  }
}
