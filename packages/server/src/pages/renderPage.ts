import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: ["/styles/reset.css", "/styles/tokens.css", "/styles/page.css"],
  styles: [],
  scripts: [
    `      
      // dark mode toggle handling
      const darkModeToggle = document.getElementById("darkmode-toggle");
      darkModeToggle.addEventListener("change", function () {
        if (this.checked) {
          document.body.classList.add("darkmode"); // Add the darkmode class to the body
        } else {
          document.body.classList.remove("darkmode"); // Remove the darkmode class
        }
      });`,
    `
      import { define } from "@calpoly/mustang";
      import { CampSiteElement } from "./scripts/camp-site.js";

      define({
        "camp-site": CampSiteElement,
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
