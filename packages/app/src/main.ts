import { Auth, History, Switch, define, Store } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { BackpackHeaderElement } from "./components/bp-header";
import { HomeViewElement } from "./views/home-view";
import { LoginViewElement } from "./views/login-view";
import { Step1View } from "./views/step1-view";
import { ItineraryViewElement } from "./views/itinerary-view";

const routes: Switch.Route[] = [
  {
    path: "/app/itinerary/:id",
    view: (params: Switch.Params, query?: URLSearchParams) => html`
      <itinerary-view
        tripid=${params.id}
        mode=${query?.has("edit") ? "edit" : query?.has("new") ? "new" : "view"}
      >
      </itinerary-view>
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
    "itinerary-view": ItineraryViewElement,
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
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "backpack:auth");
    }
  },
  "backpack-app": AppElement,
  "bp-header": BackpackHeaderElement,
});
