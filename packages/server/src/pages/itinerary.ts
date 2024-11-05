import { css, html, HtmlString, CssString } from "@calpoly/mustang/server";
import { Trip, Location, User } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export interface PageParts {
  body: HtmlString;
  stylesheets?: string[];
  styles?: CssString[];
  scripts?: string[];
  googleFontURL?: string;
  imports?: object;
}

export class ItineraryPage {
  data: Trip;

  constructor(data: Trip) {
    this.data = data;
  }

  formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    };

    const dateFormat = new Intl.DateTimeFormat("en-US", options).format(date);

    return this.formatOrdinalDate(dateFormat);
  }

  formatOrdinalDate(dateString: String) {
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

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/itinerary.css"],
    });
  }

  renderBody() {
    const host = process.env.HOST || "";
    const startDate = this.formatDate(this.data.startDate);
    const endDate = this.formatDate(this.data.endDate);

    const memberList = html`
      <ul>
        ${this.data.members.map((mem) => html`<li>${mem.name}</li>`)}
      </ul>
    `;

    const campsiteList = this.data.location.campsite.map(
      (site) => html`<li>${site}</li>`
    );

    let activityList = html`
      <ul>
        <li>No Activities Planned Yet</li>
      </ul>
    `;
    if (this.data.activities) {
      activityList = html`
        <ul>
          ${this.data.activities.map((act) => html`<li>${act}</li>`)}
        </ul>
      `;
    }

    const gearList = html`
      ${this.data.gear.map(
        (item) =>
          html` <label key=${item}>
            <input type="checkbox" autocomplete="off" />
            ${item}
          </label>`
      )}
    `;

    const imageList = this.data.image_urls;

    const tripId = "671ff484e9de70a53a387f67";

    return html`
      <header>
        <a href="${host}index.html">
          <h1 class="logo">Backpack</h1>
        </a>
        <a href="${host}profile.html">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#account" />
          </svg>
        </a>
      </header>
      <header class="nav">
        <a href="${host}index.html">
          <svg class="icon">
            <use href="/icons/sprite.svg#back" />
          </svg>
          <svg class="icon">
            <use href="/icons/sprite.svg#home" />
          </svg>
        </a>
      </header>
      <itinerary-element src="/api/itineraries/${tripId}"></itinerary-element>
      <h1>${this.data.title}</h1>
      <h5>${startDate} - ${endDate}</h5>
      <section class="four-sections">
        <section>
          <h2>Group:</h2>
          ${memberList}
        </section>
        <section>
          <h2>Location:</h2>
          <ul>
            <li>${this.data.location.region}</li>
            ${campsiteList}
          </ul>
        </section>
        <section>
          <h2>Activities:</h2>
          ${activityList}
        </section>
        <section class="gear-section">
          <h2>Gear:</h2>
          ${gearList}
        </section>
      </section>
      <section class="images">
        <img class="outer-img" src=${imageList[0]} />
        <img class="middle-img" src=${imageList[1]} />
        <img class="outer-img" src=${imageList[2]} />
      </section>
    `;
  }
}
