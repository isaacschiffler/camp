import {
  css,
  html,
  define,
  shadow,
  Observer,
  Auth,
  Form,
  InputArray,
} from "@calpoly/mustang";
import { HeaderElement } from "/scripts/header.js";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class ItineraryElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  get submitButton() {
    return this.shadowRoot.getElementById("submit");
  }

  static uses = define({
    "mu-auth": Auth.Provider,
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
    // "bp-header": HeaderElement,
  });

  static template = html`
    <template>
      <section class="view">
        <div class="trip-head">
          <h1><slot name="title"></slot></h1>
          <button class="edit-btn" id="edit">Edit</button>
        </div>
        <h5>
          <slot name="startDate"></slot> -
          <slot name="endDate"></slot>
        </h5>
        <section class="four-sections">
          <section>
            <h2>Group:</h2>
            <slot name="members">
              <li>Loading Users...</li>
            </slot>
          </section>
          <section>
            <h2>Location:</h2>
            <slot name="location">
              <li>Loading Region...</li>
              <li>Loading Campsites...</li>
            </slot>
          </section>
          <section>
            <h2>Activities:</h2>
            <slot name="activities">
              <li>Loading Activities...</li>
            </slot>
          </section>
          <section class="gear-section">
            <h2>Gear:</h2>
            <slot name="gear">
              <label key="random">
                <input type="checkbox" autocomplete="off" />
                Loading Gear...
              </label>
            </slot>
          </section>
        </section>
        <section class="images">
          <slot name="image_urls">
            <img class="outer-img" src="/images/fishing.jpeg" />
            <img class="middle-img" src="/images/fishing.jpeg" />
            <img class="outer-img" src="/images/fishing.jpeg" />
          </slot>
        </section>
      </section>
      <mu-form class="edit">
        <label>
          <span>Title:</span>
          <input name="title" />
        </label>
        <label>
          <span>Start Date:</span>
          <input type="date" name="startDate" />
        </label>
        <label>
          <span>End Date:</span>
          <input type="date" name="endDate" />
        </label>
        <label>
          <span>Members: </span>
          <input-array name="members">
            <span slot="label-add">Add a member</span>
          </input-array>
        </label>
        <label>
          <span>Region</span>
          <input name="region" />
        </label>
        <label>
          <span>Campsites: </span>
          <input-array name="campsites">
            <span slot="label-add">Add a site</span>
          </input-array>
        </label>
        <label>
          <span>Activities: </span>
          <input-array name="activities">
            <span slot="label-add">Add an activity</span>
          </input-array>
        </label>
        <label>
          <span>Gear: </span>
          <input-array name="gear">
            <span slot="label-add">Add gear</span>
          </input-array>
        </label>
      </mu-form>
    </template>
  `;

  static get observedAttributes() {
    return ["src"];
  }

  static styles = css`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }

    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }

    .edit-btn {
      width: 100px;
      margin-right: var(--margin-s);
    }
    .trip-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: var(--margin-m);
    }

    .four-sections {
      display: grid;
      grid-template-columns: [start] repeat(4, 1fr) [end];
      gap: 5px;
      padding-left: var(--margin-m);
    }

    .thr-sections > header {
      grid-column: start / end;
    }

    h1 {
      font-size: var(--size-type-xl);
    }

    h2 {
      padding: var(--margin-m);
      text-align: left;
    }

    h5 {
      margin-left: var(--margin-l);
    }

    ul {
      list-style-type: none;
    }

    p {
      margin-top: var(--margin-s);
    }

    .gear-section {
      display: flex;
      flex-direction: column;
    }

    input {
      margin-right: var(--margin-s);
    }

    .images {
      display: grid;
      grid-template-columns: [start] repeat(7, 1fr) [end];
      margin-top: var(--margin-m);
      align-items: center;
    }

    .outer-img {
      grid-column: span 2;
    }

    .middle-img {
      grid-column: span 3;
    }

    mu-form.edit {
      display: var(--display-editor-none, grid);
      grid-column: 1/-1;
      grid-template-columns: subgrid;
    }

    mu-form > label,
    input-array {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      margin-bottom: var(--margin-m);
    }

    label > input {
      width: 300px;
      text-align: center;
    }
    button.submit {
      justify-self: center;
      width: 150px;
      margin-bottom: var(--margin-l);
      padding: var(--margin-s);
      font-size: var(--size-type-l);
      border-radius: var(--radius-med);
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(ItineraryElement.template)
      .styles(reset.styles, ItineraryElement.styles, page.styles);

    // this.submitButton.addEventListener("click", (event) => {
    //   console.log(event);
    //   console.log(event.detail);
    //   this.submit(this.src, event.detail);
    // });
    this.addEventListener("mu-form:submit", (event) => {
      console.log(event);
      this.submit(this.src, event.detail);
    });

    this.editButton.addEventListener("click", () => (this.mode = "edit"));
  }

  _authObserver = new Observer(this, "backpack:auth");

  get authorization() {
    console.log("auth user: ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`,
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      console.log("this._user", this._user);
      if (this.src && this._user?.authenticated) this.hydrate(this.src);
    });
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        console.log("json", json);
        const json_form = {
          title: json.title,
          startDate: new Date(json.startDate),
          endDate: new Date(json.endDate),
          region: json.location.region,
          members: json.members.map((member) => member.name),
          campsites: json.location.campsite,
          activities: json.activities,
          gear: json.gear,
        };
        console.log("json_form", json_form);
        this.form.init = json_form;
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) => {
      switch (key) {
        case "location":
          return html`
            <ul slot="${key}">
              <li>${value.region}</li>
              ${value.campsite.map((site) => html`<li>${site}</li>`)}
            </ul>
          `;
        case "gear":
          return html`
            ${value.map(
              (item) =>
                html` <label slot="${key}" key=${item.replace(/\s+/g, "_")}>
                  <input type="checkbox" autocomplete="off" />
                  ${item}
                </label>`
            )}
          `;
        case "activities":
          if (value) {
            return html`
              <ul slot="${key}">
                ${value.map((act) => html`<li>${act}</li>`)}
              </ul>
            `;
          }
          return html`
            <ul slot="${key}">
              <li>No Activities Planned Yet</li>
            </ul>
          `;
        case "members":
          return html`<ul slot="${key}">
            ${value.map((userObj) => html`<li>${userObj.name}</li>`)}
          </ul>`;
        case "image_urls":
          return html`
            <img slot="${key}" class="outer-img" src="${value[0]}" />
            <img slot="${key}" class="middle-img" src="${value[1]}" />
            <img slot="${key}" class="outer-img" src="${value[2]}" />
          `;
        case "startDate":
          const formattedStartDate = this.formatDate(new Date(value));
          return html`<span slot="${key}">${formattedStartDate}</span>`;
        case "endDate":
          const formattedEndDate = this.formatDate(new Date(value));
          return html`<span slot="${key}">${formattedEndDate}</span>`;
        case "_id":
          return html``;
      }
      switch (typeof value) {
        case "object":
          if (Array.isArray(value))
            return html`<ul slot="${key}">
              ${value.map((s) => html`<li>${s}</li>`)}
            </ul>`;
        default:
          return html`<span slot="${key}">${value}</span>`;
      }
    };

    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" && oldValue !== newValue && newValue)
      this.hydrate(newValue);
  }

  submit(url, json) {
    const method = this.mode === "new" ? "POST" : "PUT";
    const json_formatted = {
      title: json.title,
      startDate: json.startDate,
      endDate: json.endDate,
      members: json.members.map((name, index) => ({ name: name, id: index })),
      location: {
        region: json.region,
        campsite: json.campsites,
      },
      activities: json.activities,
      gear: json.gear,
    };

    const json_form_v = {
      title: json.title,
      startDate: new Date(json.startDate),
      endDate: new Date(json.endDate),
      region: json_formatted.location.region,
      members: json_formatted.members.map((member) => member.name),
      campsites: json_formatted.location.campsite,
      activities: json.activities,
      gear: json.gear,
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.authorization,
      },
      body: JSON.stringify(json_formatted),
    })
      .then((res) => {
        if (res.status !== (this.mode === "new" ? 201 : 200))
          throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json_form_v;
        this.mode = "view";
      })
      .catch((error) => {
        console.log(`Failed to submit ${url}:`, error);
      });
  }

  formatDate(date) {
    const options = {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };

    const dateFormat = new Intl.DateTimeFormat("en-US", options).format(date);

    return this.formatOrdinalDate(dateFormat);
  }

  formatOrdinalDate(dateString) {
    // Extract day part and add ordinal suffix
    const [month, day] = dateString.split(" ");
    const dayNumber = parseInt(day, 10);

    let suffix;
    if (dayNumber === 1 || dayNumber === 21 || dayNumber === 31) suffix = "st";
    else if (dayNumber === 2 || dayNumber === 22) suffix = "nd";
    else if (dayNumber === 3 || dayNumber === 23) suffix = "rd";
    else suffix = "th";

    return `${month} ${dayNumber}${suffix}`;
  }
}
