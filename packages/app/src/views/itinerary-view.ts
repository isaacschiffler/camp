import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Trip, User } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };

  const dateFormat = new Intl.DateTimeFormat("en-US", options).format(date);

  return formatOrdinalDate(dateFormat);
}

function formatOrdinalDate(dateString: String) {
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

export class ItineraryViewElement extends View<Model, Msg> {
  @property()
  tripid?: string;

  @property({ reflect: true })
  mode = "view";

  @state()
  get trip(): Trip | undefined {
    return this.model.trip;
  }

  constructor() {
    super("backpack:model");
  }

  render() {
    if (this.trip) {
      return html`
        <header class="nav">
          <a href="/app">
            <svg class="icon">
              <use href="/icons/sprite.svg#back" />
            </svg>
            <svg class="icon">
              <use href="/icons/sprite.svg#home" />
            </svg>
          </a>
        </header>
        <section class="view">
          <div class="trip-head">
            <h1>${this.trip.title}</h1>
            <button
              class="edit-btn"
              id="edit"
              @click=${() => (this.mode = "edit")}
            >
              Edit
            </button>
          </div>
          <h5>
            ${formatDate(new Date(this.trip.startDate))} -
            ${formatDate(new Date(this.trip.endDate))}
          </h5>
          <section class="four-sections">
            <section>
              <h2>Group:</h2>
              <ul>
                ${this.trip.members.map(
                  (userObj: User) => html`<li>${userObj.name}</li>`
                )}
              </ul>
            </section>
            <section>
              <h2>Location:</h2>
              <ul>
                <li>${this.trip.location.region}</li>
                ${this.trip.location.campsite.map(
                  (site: string) => html`<li>${site}</li>`
                )}
              </ul>
            </section>
            <section>
              <h2>Activities:</h2>
              <ul>
                ${this.trip.activities?.map(
                  (act: string) => html`<li>${act}</li>`
                )}
              </ul>
            </section>
            <section class="gear-section">
              <h2>Gear:</h2>
              ${this.trip.gear.map(
                (item: string) =>
                  html` <label key=${item.replace(/\s+/g, "_")}>
                    <input type="checkbox" autocomplete="off" />
                    ${item}
                  </label>`
              )}
            </section>
          </section>
          <section class="images">
            <img class="outer-img" src="${this.trip.image_urls[0]}" />
            <img class="middle-img" src="${this.trip.image_urls[1]}" />
            <img class="outer-img" src="${this.trip.image_urls[2]}" />
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
      `;
    } else {
      return html` <h1>TRIP NOT FOUND...</h1> `;
    }
  }

  static styles = [
    resetCSS,
    pageCSS,
    css`
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
    `,
  ];

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "tripid" && oldValue !== newValue && newValue) {
      console.log("dispatching trip/select");
      this.dispatchMessage(["trip/select", { tripId: newValue }]);
    }
  }
}