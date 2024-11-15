import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Trip } from "../../../server/src/models/itinerary";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";

export class HomeViewElement extends LitElement {
  src = "http://localhost:3000/api/itineraries/";

  @state()
  tripIndex = new Array<Trip>();

  render() {
    const tripList = this.tripIndex.map(this.renderItem);

    return html`
      <main class="page">
        <section class="landing">
          <section class="plan">
            <h2>Plan your trip now!</h2>
            <header
              class="gs-image"
              style="background-image: url('/images/2Y1.jpeg')"
            >
              <a href="step1.html" class="gs-link">
                <button class="get-started" href="step1.html">
                  Get Started!
                </button>
              </a>
              <p>Location: Yellowstone</p>
            </header>
            <section class="nav-bar">
              <ul class="nav">
                <li>
                  <a href="step1.html">
                    <svg class="page-icons">
                      <use href="/icons/sprite.svg#campfire" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="step2.html">
                    <svg class="page-icons">
                      <use href="/icons/sprite.svg#backpack" />
                    </svg>
                  </a>
                </li>
              </ul>
            </section>
          </section>
          <section class="itin">
            <h2>See a trip you've already planned:</h2>
            <ul class="itin">
              <li>
                <a
                  href="http://localhost:3000/itinerary/671ff484e9de70a53a387f67"
                >
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>STATIC: Trip to Yellowstone</h4>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3000/itinerary/6721180a91b98c720183ddfa"
                >
                  <svg class="page-icons">
                    <use href="/icons/sprite.svg#itinerary" />
                  </svg>
                  <h4>STATIC: Trip to Glacier</h4>
                </a>
              </li>
              ${tripList}
            </ul>
          </section>
        </section>
      </main>
    `;
  }

  static styles = [
    resetCSS,
    pageCSS,
    css`
      .landing {
        display: grid;
        grid-template-columns: [start] 1fr 1fr 1fr 1fr [end];
        gap: 5px;
      }

      .landing > header {
        grid-column: start / end;
      }

      h2 {
        text-align: center;
        margin-left: 10px;
      }

      .itin > h2 {
        padding-left: 10px;
        padding-right: 10px;
      }

      .landing > section.plan {
        grid-column: start / 4;
      }

      .itin {
        grid-column: 4 / end;
      }

      section.nav-bar {
        grid-column: start / 4;
        margin-top: var(--margin-m);
      }

      ul.nav {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        list-style-type: none;
        padding: 0;
      }
      li {
        margin: 0;
      }

      ul.itin {
        list-style-type: none;
        padding-top: var(--margin-m);
        padding-bottom: var(--margin-m);
        padding-left: var(--margin-s);
      }
      ul.itin > li > a {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .gs-image {
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 50vw;
        max-height: 575px;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-top: var(--margin-m);
        padding: 0;
      }

      .get-started {
        font-size: var(--size-type-large);
        justify-content: center;
        background-color: var(--color-background-button);
        border-radius: var(--radius-med);
      }

      .gs-link {
        height: fit-content;
        width: fit-content;
      }

      p {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }

      .color-toggle {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    `,
  ];

  renderItem(trip: Trip) {
    return html`
      <li>
        <a href="/itinerary/${trip._id.toString()}">
          <svg class="page-icons">
            <use href="/icons/sprite.svg#itinerary" />
          </svg>
          <h4>${trip.title}</h4>
        </a>
      </li>
    `;
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
}
