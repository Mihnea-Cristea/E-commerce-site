import { useState, useEffect } from "react";
import React from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import HamburgerMenuIcon from "../../icons/HamburgerMenuIcon";
import { bem } from "../../lib/bem";
import { db } from "../../lib/firebase";

// css
import "../../assets/css/page.css";
import { Container, Navbar } from "react-bootstrap";
import { collection, getDoc, getDocs } from "firebase/firestore";

export default function OffcanvasMenuMobile() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    <>
      <a onClick={handleShow}>
        <HamburgerMenuIcon />
      </a>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Meniu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar expand="lg" className={`${bem("offcanvas", "container")}`}>
            <ul className={`${bem("offcanvas", "items")}`}>
              <li className={`${bem("offcanvas", "item", "categories")}`}>
                <a
                  className={`${bem("offcanvas", "item-title")}`}
                  href="/catalog"
                >
                  Categorii
                </a>
                <ul className={`${bem("offcanvas", "menu-items")}`}>
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className={`${bem("offcanvas", "menu-item")}`}
                    >
                      <a href={`/catalog/category/${category.name}`}>
                        {category.name}
                      </a>
                      <ul
                        className={`${bem(
                          "offcanvas",
                          "menu-item",
                          "subcategories"
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
                                "offcanvas",
                                "menu-item",
                                "subcategory"
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
            </ul>
          </Navbar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
