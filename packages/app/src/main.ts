import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { BackpackHeaderElement } from "./components/bp-header";
import { HomeViewElement } from "./views/home-view";
import { LoginViewElement } from "./views/login-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "login-view": LoginViewElement,
  });

  protected render() {
    return html` <home-view></home-view> `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    BackpackHeaderElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "backpack-app": AppElement,
  "bp-header": BackpackHeaderElement,
});
