import { Auth, History, Switch, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { BackpackHeaderElement } from "./components/bp-header";
import { HomeViewElement } from "./views/home-view";
import { LoginViewElement } from "./views/login-view";
import { Step1View } from "./views/step1-view";

const routes: Switch.Route[] = [
  {
    path: "/app/itinerary/:id",
    view: (params: Switch.Params) => html`
      <!-- <tour-view tour-id=${params.id}></tour-view> -->
    `,
  },
  {
    path: "/app/step1",
    view: () => html` <step1-view></step1-view>`,
  },
  {
    path: "/app",
    view: () => html` <home-view></home-view> `,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement,
    "login-view": LoginViewElement,
    "step1-view": Step1View,
  });

  protected render() {
    return html` <mu-switch></mu-switch> `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    BackpackHeaderElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "backpack:history", "backpack:auth");
    }
  },
  "backpack-app": AppElement,
  "bp-header": BackpackHeaderElement,
});
