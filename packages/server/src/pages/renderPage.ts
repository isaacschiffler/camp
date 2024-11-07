import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: ["/styles/reset.css", "/styles/tokens.css", "/styles/page.css"],
  styles: [],
  scripts: [
    `      
      // dark mode toggle handling
      // const darkModeToggle = document.getElementById("darkmode-toggle");
      // darkModeToggle.addEventListener("change", function () {
      //   if (this.checked) {
      //     document.body.classList.add("darkmode"); // Add the darkmode class to the body
      //   } else {
      //     document.body.classList.remove("darkmode"); // Remove the darkmode class
      //   }
      // });`,
    `
      import { define, Auth } from "@calpoly/mustang";
      import { ItineraryElement } from "/scripts/itinerary.js";
      import { HeaderElement } from "/scripts/header.js";


      define({
        "mu-auth": Auth.Provider,
        "itinerary-element": ItineraryElement,
        "bp-header": HeaderElement,
      });
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
