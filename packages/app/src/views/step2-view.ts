import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import resetCSS from "../styles/reset.css";
import pageCSS from "../styles/page.css";

export class Step2View extends LitElement {
  render() {
    return html`
      <main class="page">
        <section class="thr-sections">
          <header class="nav">
            <a href="/app/step1">
              <svg class="icon">
                <use href="/icons/sprite.svg#back" />
              </svg>
              <svg class="icon">
                <use href="/icons/sprite.svg#campfire" />
              </svg>
            </a>
            <a href="/app">
              <svg class="icon">
                <use href="/icons/sprite.svg#check" />
              </svg>
            </a>
          </header>
          <section id="activity" class="activity">
            <header class="act-head">
              <h1>Activity: Fishing</h1>
              <button>ADD</button>
            </header>
            <dl>
              <dt>Extra gear:</dt>
              <dd>Fishing rod</dd>
              <dd>Tackle</dd>
              <dd>Fishing Liscense</dd>
            </dl>
            <img src="/images/fishing.jpeg" />
            <img src="/images/fishing2.jpeg" />
            <img src="/images/fishing3.jpeg" />
          </section>
          <section id="gear" class="gear">
            <h1>What to pack</h1>
            <h2>Group items</h2>
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
            <h2>Individual Items</h2>
            <input type="checkbox" id="item1" name="item1" value="item" />
            <label for="item1">Rain jacket and pants</label><br />
            <input type="checkbox" id="item2" name="item2" value="item" />
            <label for="item2">Pocket knife</label><br />
            <input type="checkbox" id="item3" name="item3" value="item" />
            <label for="item3">Water bottle</label><br />
            <input type="checkbox" id="item4" name="item4" value="item" />
            <label for="item4">Hat</label><br />
            <input type="checkbox" id="item5" name="item5" value="item" />
            <label for="item5">Clothing</label><br />
            <input type="checkbox" id="item6" name="item6" value="item" />
            <label for="item6">Hiking shoes</label><br />
          </section>
          <section id="food" class="food">
            <h1>Meals</h1>
            <h2>3 Breakfasts</h2>
            <input
              type="checkbox"
              id="breakfast1"
              name="breakfast1"
              value="breakfast"
            />
            <label for="breakfast1">Bagel and cream cheese</label><br />
            <input
              type="checkbox"
              id="breakfast2"
              name="breakfast2"
              value="breakfast"
            />
            <label for="breakfast2">Breakfast Tacos</label><br />
            <input
              type="checkbox"
              id="breakfast3"
              name="breakfast3"
              value="breakfast"
            />
            <label for="breakfast3">Oatmeal</label><br />
            <h2>3 Lunches</h2>
            <input type="checkbox" id="lunch1" name="lunch1" value="lunch" />
            <label for="lunch1">PB&J Tortillas + Sum Saus + Cheese</label><br />
            <input type="checkbox" id="lunch2" name="lunch2" value="lunch" />
            <label for="lunch2">Hamburger Helper</label><br />
            <input type="checkbox" id="lunch3" name="lunch3" value="lunch" />
            <label for="lunch3">Ham/Turkey + Cheese Sammies</label><br />
            <h2>3 Dinners</h2>
            <input type="checkbox" id="dinner1" name="dinner1" value="dinner" />
            <label for="dinner1">Steak and Mashed</label><br />
            <input type="checkbox" id="dinner2" name="dinner2" value="dinner" />
            <label for="dinner2">Ramen + Ground Beef</label><br />
            <input type="checkbox" id="dinner3" name="dinner3" value="dinner" />
            <label for="dinner3">Jumbolaya + Kielbasa</label><br />
            <h2>Misc.</h2>
            <input type="checkbox" id="misc1" name="misc1" value="misc" />
            <label for="misc1">Protein Bars</label><br />
            <input type="checkbox" id="misc2" name="misc2" value="misc" />
            <label for="misc2">Salt + Pepper</label><br />
            <input type="checkbox" id="misc3" name="misc3" value="misc" />
            <label for="misc3">Butter</label><br />
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

      .activity {
        grid-column: start / 4;
      }

      header.act-head {
        background-image: none;
        height: fit-content;
        padding-right: var(--margin-m);
      }

      .gear {
        grid-column: 4 / 6;
      }

      dl {
        margin-bottom: var(--margin-l);
        margin-top: var(--margin-m);
        margin-left: var(--margin-s);
      }

      dd {
        margin-top: var(--margin-s);
      }

      .food {
        grid-column: 6 / 8;
      }

      h2 {
        margin-top: var(--margin-l);
        margin-bottom: var(--margin-m);
        font-size: var(--size-type-ml);
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
