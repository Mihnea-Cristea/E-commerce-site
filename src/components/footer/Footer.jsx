import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { bem } from "../../lib/bem";
import AboutUs from "./TermsAndConditions";
import "../../assets/css/footer.css";
import "../../assets/css/page.css";

export default function Footer() {
  return (
    <div className={`${bem("footer")}`}>
      <div className={`${bem("footer", "customers")}`}>
        <h2 className={`${bem("footer", "title")} heading`}>suport clienti</h2>
        <ul className={`${bem("footer", "items")}`}>
          <li className={`${bem("footer", "item")}`}>
            <a className={`${bem("footer", "item-link")}`} href="/gdpr">
              GDPR
            </a>
          </li>
          <li className={`${bem("footer", "item")}`}>
            <a className={`${bem("footer", "item-link")}`} href="/terms">
              Termeni si conditii
            </a>
          </li>
        </ul>
      </div>
      <div className={`${bem("footer", "about")}`}>
        <h2 className={`${bem("footer", "title")} heading`}>despre noi</h2>
        <ul className={`${bem("footer", "items")}`}>
          <li className={`${bem("footer", "item")}`}>
            <a className={`${bem("footer", "item-link")}`} href="/contact">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
