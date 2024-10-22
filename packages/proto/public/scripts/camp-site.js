import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class CampSiteElement extends HTMLElement {
  // why is css not being applied to h1 and stuff?
  static template = html`
    <template>
      <header class="image">
        <h1 class="title"><slot name="name">Campsite Name</slot></h1>
      </header>
      <section class="cs-info">
        <div class="column">
          <h3>Features</h3>
          <ul>
            <slot name="features">
              <li>Default Feature 1</li>
              <li>Default Feature 2</li>
            </slot>
          </ul>
        </div>
        <div class="column">
          <h3>Amenities</h3>
          <ul class="list">
            <slot name="amenities">
              <li>Default Amenity 1</li>
              <li>Default Amenity 2</li>
            </slot>
          </ul>
        </div>
      </section>
    </template>
  `;

  static get observedAttributes() {
    return ["image_url"];
  }

  static styles = css`
    h1 {
      font-family: var(--font-family-display);
      text-align: center;
      width: fit-content;
      font-size: var(--size-type-large);
    }
    .image {
      display: flex;
      background-size: cover;
      background-position: center;
      height: 37.5vw;
      width: 100%;
      align-items: normal;
      justify-content: center;
      width: var(--width-scroll-image);
      max-width: 600px;
      max-height: 450px;
      padding: 0;
    }

    h1.title {
      background-color: rgba(245, 245, 245, 0.482);
      width: 100%;
      height: fit-content;
      padding: 10px;
    }

    .cs-info {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two equal columns */
      gap: 20px; /* Adds space between the columns */
    }

    h3 {
      font-family: var(--font-family-body);
      color: var(--color-accent);
      margin-top: var(--margin-s);
      font-weight: normal;
      font-size: var(--size-type-ml);
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(CampSiteElement.template)
      .styles(reset.styles, CampSiteElement.styles);
  }

  connectedCallback() {
    this.updateBackgroundImage();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "image_url") {
      this.updateBackgroundImage();
    }
  }

  // Function to update the background image dynamically
  updateBackgroundImage() {
    const header = this.shadowRoot.querySelector("header.image");
    const imageUrl = this.getAttribute("image_url");
    if (imageUrl) {
      header.style.backgroundImage = `url(${imageUrl})`;
    }
  }
}
