import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: ["/styles/reset.css", "/styles/tokens.css", "/styles/page.css"],
  styles: [],
  scripts: [
    `      
      import { define, Auth } from "@calpoly/mustang";
      import { ItineraryElement } from "/scripts/itinerary.js";
      import { HeaderElement } from "/scripts/header.js";


      define({
        "mu-auth": Auth.Provider,
        "itinerary-element": ItineraryElement,
        "bp-header": HeaderElement,
      });

      HeaderElement.initializeOnce();
    `,
  ],
  googleFontURL: "",
  imports: {
    "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang",
  },
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}
