import React, { useState, useEffect } from "react";
import SearchIcon from "../../icons/SearchIcon";
import "../../assets/css/search-bar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { bem } from "../../lib/bem";
import { db } from "../../lib/firebase";

import { getDocs, collection, query, where } from "firebase/firestore";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

// css
import "../../assets/css/search-bar.css";

export function SearchBarMobile() {
  const [show, setShow] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    <Navigate to={`/catalog/${searchInput}`} />;
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className={`${bem("search-bar", "mobile")}`}
      >
        <Offcanvas.Header
          closeButton
          className={`${bem("search-bar", "close-btn")}`}
        ></Offcanvas.Header>
        <Offcanvas.Body className={`${bem("search-bar", "wrapper")}`}>
          <form className={`${bem("search-bar", "mobile-container")}`}>
            <input
              type="text"
              placeholder="Search products"
              value={searchInput}
              onChange={handleSearchInputChange}
              className={`${bem("search-bar", "input")}`}
            />
            <a
              className={`${bem("search-bar", "submit")}`}
              href={`/catalog/${searchInput}`}
            >
              <SearchIcon />
            </a>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
      <Nav.Link onClick={handleShow}>
        <SearchIcon />
      </Nav.Link>
    </div>
  );
}

const calculateLevenshteinDistance = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calculate the Levenshtein distance
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  // Calculate the similarity percentage
  const similarity = ((len1 + len2 - matrix[len1][len2]) / (len1 + len2)) * 100;
  return similarity.toFixed(2);
};

export function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchInput.trim() !== "") {
        const productsCollectionRef = collection(db, "products");
        const searchQuery = searchInput.toLowerCase().trim();

        const q = query(productsCollectionRef);

        const data = await getDocs(q);
        const matchingProducts = data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((product) => product.name.toLowerCase().includes(searchQuery))
          .slice(0, 3);

        setSearchResults(matchingProducts);
      } else {
        setSearchResults([]);
      }
    };

    const generateRecommendedProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const q = query(productsCollectionRef);

        const data = await getDocs(q);
        const productsData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Find the product with the highest name similarity using Levenshtein distance
        const queryAux = searchInput?.toLowerCase().trim();

        let bestMatches = productsData.length > 0 ? [productsData[0]] : [];
        let maxDistance = 0;

        for (let i = 1; i < productsData.length; i++) {
          const product = productsData[i];
          const distance = calculateLevenshteinDistance(
            queryAux ? queryAux : "",
            product.name.toLowerCase() ? product.name.toLowerCase() : ""
          );

          if (distance > maxDistance) {
            maxDistance = distance;
            bestMatches = [product];
          }
        }

        setRecommendedProducts(bestMatches);
      } catch (error) {
        console.error("Error generating recommended products:", error);
      }
    };

    fetchSearchResults();
    generateRecommendedProducts();
  }, [searchInput]);

  const handleSearch = () => {
    <Navigate to={`/catalog/${searchInput}`} />;
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <form className={`${bem("search-bar", "desktop-form")}`}>
      <div className={`${bem("search-bar", "desktop-container")}`}>
        <input
          type="text"
          placeholder="Search products"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="border-0"
        />
        <a className="btn" href={`/catalog/${searchInput}`}>
          <SearchIcon />
        </a>
        {(searchResults.length > 0 || recommendedProducts.length > 0) &&
          searchInput && (
            <div className={`${bem("search-bar", "dropdown")}`}>
              {searchResults.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`${bem("search-bar", "dropdown-item")}`}
                >
                  <img
                    src={product.images[0]}
                    className={`${bem(
                      "search-bar",
                      "dropdown-image"
                    )} img-thumb`}
                  ></img>
                  <span className={`${bem("search-bar", "dropdown-name")}`}>
                    {product.name}
                  </span>
                </a>
              ))}

              {searchInput &&
                recommendedProducts.length > 0 &&
                searchResults.length == 0 && (
                  <div className={`${bem("search-bar", "recommended")}`}>
                    <a>Te-ai referit cumva la...</a>
                    <br></br>
                    {recommendedProducts.map((product) => (
                      <a
                        key={product.id}
                        href={`/product/${product.id}`}
                        className={`${bem("search-bar", "dropdown-item")}`}
                      >
                        <img
                          src={product.images[0]}
                          className={`${bem(
                            "search-bar",
                            "dropdown-image"
                          )} img-thumb`}
                        ></img>
                        <span
                          className={`${bem("search-bar", "dropdown-name")}`}
                        >
                          {product.name}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
            </div>
          )}
      </div>
    </form>
  );
}
