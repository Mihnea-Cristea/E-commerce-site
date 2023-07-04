// import react
import React from "react";
import { useEffect, useState } from "react";
// import bootstrap
import { Container, Navbar, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import icons
import UserIcon from "../../icons/UserIcon";
import CartIcon from "../../icons/CartIcon";
import WishlistIcon from "../../icons/WishlistIcon";
import HamburgerMenuIcon from "../../icons/HamburgerMenuIcon";
// import css
import "../../assets/css/navigation.css";
import "../../assets/css/icons.css";
// import components
import NavigationSecondary from "./NavigationSecondary";
import { SearchBarMobile, SearchBar } from "../menu/SearchBar";
//import files
import siteLogo from "../../assets/images/logo.png";
// import additional libraries
import OffcanvasMenuMobile from "../menu/OffcanvasMenuMobile";
import { bem } from "../../lib/bem";

export default function Navigation() {
  // show menu on hover -> usestate
  const [showMenu, setShowMenu] = useState(false);

  // functions which control the state of the menu
  const showDropdown = (e) => {
    setShowMenu(!showMenu);
  };
  const hideDropdown = async (e) => {
    await sleep(2000);
    await setShowMenu(false);
  };

  // resize depending on screen width
  const [width, setWidth] = useState(window.innerWidth);

  // setting the max width
  const maxWidth = 991; // less or equal

  // update screen width
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // verify the screen width - boolean
  const isMobile = width <= maxWidth;

  return (
    <Navbar bg="dark" className={`${bem("navigation-top")}`}>
      <Container className={`${bem("navigation-top", "content")}`}>
        {/* Container of the logo and mobile hamburger menu */}
        <div
          className={`${bem(
            "navigation-top",
            "logo-container"
          )} d-flex align-items-center justify-content-start`}
        >
          {/* Hamburger menu mobile */}
          {isMobile ? (
            <div className="hamburger-menu-phone px-2">
              <OffcanvasMenuMobile />
            </div>
          ) : null}

          {/* Logo */}
          <a href="/" className={`${bem("navigation-top", "logo")}`}>
            <figure>
              <img src={siteLogo} className="logo"></img>
            </figure>
          </a>
        </div>

        {/* Desktop search bar */}
        {isMobile ? null : <SearchBar />}

        <Nav className={`${bem("navigation-top", "menu-icons")}`}>
          {/* Mobile Search Bar */}
          {isMobile ? <SearchBarMobile /> : null}

          {/* Cart */}
          <Nav.Link href="/cart">
            <CartIcon />
          </Nav.Link>

          {/* User */}
          <Nav.Link href="/userdashboard">
            <UserIcon />
          </Nav.Link>

          {/* Favorites */}
          <Nav.Link href="/wishlist">
            <WishlistIcon />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
