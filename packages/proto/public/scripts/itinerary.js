import { css, html, shadow, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class ItineraryElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }

  static template = html`
    <template>
      <h1><slot name="title"></slot></h1>
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
    </template>
  `;

  static get observedAttributes() {
    return ["src"];
  }

  static styles = css`
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
      padding-bottom: var(--margin-m);
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
  `;

  constructor() {
    super();
    shadow(this)
      .template(ItineraryElement.template)
      .styles(reset.styles, ItineraryElement.styles, page.styles);
  }

  _authObserver = new Observer(this, "backpack:auth");

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`,
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
    });
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
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

  connectedCallback() {
    if (this.src) this.hydrate(this.src);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" && oldValue !== newValue && newValue)
      this.hydrate(newValue);
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
