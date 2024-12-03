import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Trip } from "server/models";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";

export class ProfileViewElement extends LitElement {
  src = "http://localhost:3000/api/itineraries/";

  @state()
  tripIndex = new Array<Trip>();

  render() {
    const gearList = this.tripIndex.map(this.renderGear);
    const tripList = this.tripIndex.map(this.renderTripImage);

    return html`
      <main class="page">
        <section class="thr-sections">
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
          <section id="trip" class="trip">
            <h1>My Trips</h1>
            ${tripList}
          </section>
          <section id="my-gear" class="my-gear">
            <h1>My Gear</h1>
            ${gearList}
          </section>
          <section id="request" class="request">
            <h1>Pending Invites</h1>
            <input type="checkbox" id="invite1" name="invite1" value="invite" />
            <label for="invite1">2025 Yosemite Trip</label><br />
          </section>
        </section>
      </main>
    `;
  }

  static styles = [
    resetCSS,
    pageCSS,
    css`
      .thr-sections {
        display: grid;
        grid-template-columns: [start] repeat(7, 1fr) [end];
        gap: var(--margin-s);
      }

      .thr-sections > header {
        grid-column: start / end;
      }

      .trip {
        grid-column: start / 4;
      }
      .trip > header {
        text-align: center;
      }

      .my-gear {
        grid-column: 4 / 6;
      }

      .request {
        grid-column: 6 / 8;
      }

      h1 {
        padding-bottom: var(--margin-m);
      }

      .trip-img {
        background-size: cover;
        background-position: center;
        height: 27.5vw;
        width: 100%;
        align-items: normal;
        justify-content: center;
        width: var(--width-scroll-image);
        max-width: 600px;
        max-height: 450px;
        padding: 0;
        margin-bottom: var(--margin-s);
      }

      .trip-link {
        display: block;
      }

      h2 {
        height: fit-content;
        padding: 10px;
      }

      h2.title {
        background-color: var(--color-background-image-title);
        width: 100%;
        text-align: center;
      }

      .gear-list {
        padding-bottom: var(--margin-s);
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "backpack:auth");

  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  hydrate(url: string) {
    fetch(url, {
      headers: Auth.headers(this._user),
    })
      .then((res: Response) => {
        if (res.status === 200) return res.json();
        throw `Server responded with status ${res.status}`;
      })
      .then((json: Array<Trip>) => {
        this.tripIndex = json;
      })
      .catch((err) => console.log("Failed to tour data:", err));
  }

  renderGear(trip: Trip) {
    return html`
      <section class="gear-list">
        <h2>${trip.title}</h2>
        ${trip.gear?.map(
          (g: string, index: number) => html`
            <input
              type="checkbox"
              id="gear-${index}-${trip._id.toString()}"
              name="gear-group-${index}"
              value="gear-${index}-${trip._id.toString()}"
            />
            <label for="gear-${index}-${trip._id.toString()}">${g}</label><br />
          `
        ) ?? html`<p>All gear prepared.</p>`}
      </section>
    `;
  }

  renderTripImage(trip: Trip) {
    return html`
      <a
        class="trip-link"
        href="/app/itinerary/${trip._id.toString()}"
        style="text-decoration: none; color: inherit;"
      >
        <header
          class="trip-img"
          style="background-image: url(${trip.image_urls[1]})"
        >
          <h2 class="title">${trip.title}</h2>
        </header>
      </a>
    `;
  }
}
