import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import page from "./styles/page.css.js";

export class ItineraryElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }

  static template = html`
    <template>
      <h1><slot name="title">Itinerary Title</slot></h1>
      <h5>
        <span slot="startDate">startDate</span> -
        <span slot="endDate">endDate</span>
      </h5>
      <section class="four-sections">
        <section>
          <h2>Group:</h2>
          <ul slot="members">
            <li>Default User 1</li>
            <li>Default User 2</li>
          </ul>
        </section>
        <section>
          <h2>Location:</h2>
          <ul slot="location">
            <li>Default Region</li>
            <li>Default Site 1</li>
            <li>Default Site 2</li>
          </ul>
        </section>
        <section>
          <h2>Activities:</h2>
          <ul slot="activities">
            <li>Default Activity 1</li>
            <li>Default Activity 2</li>
          </ul>
        </section>
        <section class="gear-section">
          <h2>Gear:</h2>
          <slot name="gears">
            <label key="random">
              <input type="checkbox" autocomplete="off" />
              Random Gear
            </label>
          </slot>
        </section>
      </section>
      <section class="images">
        <slot name="img_urls">
          <img class="outer-img" src="/images/2Y1.jpeg" />
          <img class="middle-img" src="/images/fishing.jpeg" />
          <img class="outer-img" src="/images/fishing2.jpeg" />
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
            <slot name="${key}">
              ${value.map(
                (item) =>
                  html` <label key=${item.replace(/\s+/g, "_")}>
                    <input type="checkbox" autocomplete="off" />
                    ${item}
                  </label>`
              )}
            </slot>
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
            <slot name="${key}">
              <img class="outer-img" src="${value[0]}" />
              <img class="middle-img" src="${value[1]}" />
              <img class="outer-img" src="${value[2]}" />
            </slot>
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
          return html`<slot name="${key}">${value}</slot>`;
      }
    };

    const fragment = entries.map(toSlot);
    console.log("FRAGMENTS", fragment);
    this.replaceChildren(...fragment); // this is not putting the fragments in the shadow root; if i use .shadow_root.re... it removes the whole thing.
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
