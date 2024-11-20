import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";

export class ProfileViewElement extends LitElement {
  render() {
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
            <header
              class="trip-img"
              style="background-image: url('/images/2Y1.jpeg')"
            >
              <h2 class="title">Trip to Yellowstone</h2>
            </header>
          </section>
          <section id="my-gear" class="my-gear">
            <h1>My Gear</h1>
            <h2>Trip to Yellowstone</h2>
            <input type="checkbox" id="group1" name="group1" value="group" />
            <label for="group1">Medical supplies</label><br />
            <input type="checkbox" id="group2" name="group2" value="group" />
            <label for="group2">Tent</label><br />
            <input type="checkbox" id="group3" name="group3" value="group" />
            <label for="group3">Pots and pans</label><br />
            <input type="checkbox" id="group4" name="group4" value="group" />
            <label for="group4">Bug spray</label><br />
            <input type="checkbox" id="group5" name="group5" value="group" />
            <label for="group5">Bear spray</label><br />
            <input type="checkbox" id="group6" name="group6" value="group" />
            <label for="group6">Bear rope</label><br />
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
      }

      h2 {
        height: fit-content;
        padding: 10px;
      }

      h2.title {
        background-color: rgba(245, 245, 245, 0.482);
        width: 100%;
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
    });
  }
}
