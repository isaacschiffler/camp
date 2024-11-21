import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import pageCSS from "../styles/page.css";
import resetCSS from "../styles/reset.css";

export class CampsiteElement extends LitElement {
  @property({ type: String }) image_url?: string;

  render() {
    return html`
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
    `;
  }

  static styles = [
    pageCSS,
    resetCSS,
    css`
      h1 {
        font-family: var(--font-family-display);
        text-align: center;
        width: fit-content;
        font-size: var(--size-type-large);
        margin-left: 0;
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
        background-color: var(--color-background-image-title);
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
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback();
    console.log("Connected to DOM");
  }

  firstUpdated(): void {
    this.updateBackgroundImage();
  }

  private updateBackgroundImage(): void {
    console.log("Updating background image");
    const header = this.shadowRoot?.querySelector(
      "header.image"
    ) as HTMLElement;
    if (!header) {
      console.error("Header element not found");
      return;
    }
    if (this.image_url) {
      console.log("Image URL:", this.image_url);
      header.style.backgroundImage = `url(${this.image_url})`;
    }
  }
}
