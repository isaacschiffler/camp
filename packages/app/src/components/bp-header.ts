import { LitElement, css, html } from "lit";
import { define, Dropdown, Events } from "@calpoly/mustang";
import pageCSS from "../styles/page.css";
import resetCSS from "../styles/reset.css";

function signOut(ev: MouseEvent) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}

export class BackpackHeaderElement extends LitElement {
  static uses = define({
    "mu-dropdown": Dropdown.Element,
  });

  render() {
    return html`
      <header>
        <a href="/">
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
                <label
                  @click=${(event: InputEvent) =>
                    Events.relay(event, "darkmode", {
                      checked: (event.target as HTMLInputElement).checked,
                    })}
                  class="dark-mode-switch"
                >
                  <input type="checkbox" autocomplete="off" />
                  Dark Mode
                </label>
              </li>
              <li class="when-signed-in">
                <a id="signout" @click=${signOut}>Sign Out</a>
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
    `;
  }

  static styles = [
    pageCSS,
    resetCSS,
    css`
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
    `,
  ];

  static initializeOnce() {
    function toggleDarkMode(page: HTMLElement, checked: boolean) {
      page.classList.toggle("darkmode", checked);
    }

    document.body.addEventListener("darkmode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }
}
