import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { bem } from "../../lib/bem";
import { db } from "../../lib/firebase";

// import css
import "../../assets/css/navigation.css";
import { collection, getDoc, getDocs } from "firebase/firestore";

export default function NavigationSecondary() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const categoriesCollectionRef = collection(db, "categories");
  const subcategoriesCollectionRef = collection(db, "subcategories");

  const getCategoriesAndSubcategories = async () => {
    const dataCateg = await getDocs(categoriesCollectionRef);
    const dataSubcateg = await getDocs(subcategoriesCollectionRef);

    // request categories
    const allCategories = dataCateg.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // request subcategories
    const allSubcategories = dataSubcateg.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // set categories
    let uniqueCategories = allCategories
      .filter((cat) => cat.name && !categories.includes(cat.name))
      .map((cat) => cat);

    // -> eliminate duplicates from uniqueCategories array
    uniqueCategories = Array.from(new Set(uniqueCategories));

    setCategories([...categories, ...uniqueCategories]);

    // set subcategories
    let uniqueSubcategories = allSubcategories
      .filter(
        (subcateg) => subcateg.name && !subcategories.includes(subcateg.name)
      )
      .map((subcateg) => subcateg);
    // -> eliminate duplicates from uniqueSubcategories array
    uniqueSubcategories = Array.from(new Set(uniqueSubcategories));

    setSubcategories([...subcategories, ...uniqueSubcategories]);

    // at the end of the execution, load is done and set to true
    setLoaded(true);
  };

  useEffect(() => {
    setLoaded(false);
    getCategoriesAndSubcategories();
  }, []);

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`${bem("navigation-secondary", "container")}`}
    >
      <Container
        className={`${bem("navigation-secondary", "menu", "level-1")}`}
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <nav
            role="navigation"
            className={`${bem("navigation-secondary-menu", "level-1")}`}
          >
            <ul className={`${bem("navigation-secondary-menu", "items")}`}>
              {/* <li className={`${bem("menu", "item")}`}>
                <a href="#">Home</a>
              </li> */}
              <li
                className={`${bem(
                  "navigation-secondary-menu",
                  "item",
                  "level-1"
                )}`}
              >
                <a href="/catalog">Categorii</a>
                <ul
                  className={`${bem(
                    "navigation-secondary-menu",
                    "dropdown-menu"
                  )}`}
                >
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className={`${bem(
                        "navigation-secondary-menu",
                        "dropdown-item",
                        "level-2"
                      )}`}
                    >
                      <a href={`/catalog/category/${category.name}`}>
                        {category.name}
                      </a>
                      <ul
                        className={`${bem(
                          "navigation-secondary-menu",
                          "menu-items",
                          "level-3"
                        )}`}
                      >
                        {subcategories
                          .filter(
                            (subcategory) =>
                              subcategory.parent_id === category.id
                          )
                          .map((subcategory, index) => (
                            <li
                              key={index}
                              className={`${bem(
                                "navigation-secondary-menu",
                                "dropdown-item",
                                "level-3"
                              )}`}
                            >
                              <a
                                href={`/catalog/subcategory/${subcategory.name
                                  .replace(/\s+/g, "")
                                  .toLowerCase()}`}
                              >
                                {subcategory.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
              {/* <li className={`${bem("menu", "item")} px-0`}>
                <a href="#">About</a>
              </li>
              <li className={`${bem("menu", "item")} px-0`}>
                <a href="#">Contact</a>
              </li> */}
            </ul>
          </nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
