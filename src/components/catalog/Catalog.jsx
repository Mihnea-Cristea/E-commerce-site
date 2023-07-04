import { Button, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/catalog.css";
import { bem } from "../../lib/bem";
import CartIcon from "../../icons/CartIcon";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import ListingProductFormat from "./ListingProductFormat";
import ProductFilters from "./ProductFilters";

// css
import "../../assets/css/page.css";
import FilterIcon from "../../icons/FilterIcon";

export default function Catalog() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const productsCollectionRef = collection(db, "products");
  const { query, category_params, subcategory_params } = useParams();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [filtersSubmitted, setFiltersSubmitted] = useState(false);
  const [sortOption, setSortOption] = useState("default"); 

  const [showOffcanvasFilters, setshowOffcanvasFilters] = useState(false);

  const handleCloseOffcanvasFilters = () => setshowOffcanvasFilters(false);
  const handleShowOffcanvasFilters = () => setshowOffcanvasFilters(true);

  const getProducts = async () => {
    const data = await getDocs(productsCollectionRef);
    const allProducts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // Calculate the highest and lowest prices
    const highestPrice = Math.max(
      ...allProducts.map((product) => product.price)
    ) + 1;
    const lowestPrice = Math.min(
      ...allProducts.map((product) => product.price)
    );

    setMaxPrice(highestPrice); // Set the highest price to the maxPrice state
    setMinPrice(lowestPrice); // Set the lowest price to the minPrice state
    currentPrice > 0 ? null : setCurrentPrice(highestPrice);

    // Filter products based on the search input and price range
    const filteredProducts = allProducts.filter(
      (product) =>
        (query
          ? product.name?.toLowerCase().includes(query?.toLowerCase())
          : true) &&
        (category_params
          ? product.category?.toLowerCase() === category_params?.toLowerCase()
          : true) &&
        (subcategory_params
          ? product.subcategory.replace(/\s+/g, "").toLowerCase() ===
            subcategory_params
          : true) &&
        (minPrice !== "" ? product.price >= minPrice : true) &&
        (currentPrice > 0 ? product.price <= currentPrice : true)
    );

    // Sort the products based on the selected sort option
    const sortedProducts = sortProducts(filteredProducts, sortOption);

    setProducts(sortedProducts);
    setLoaded(true);
  };

  useEffect(() => {
    setLoaded(false);
    getProducts();
  }, [query, filtersSubmitted, sortOption]);

  const handleFilterSubmit = () => {
    setFiltersSubmitted(!filtersSubmitted);
    handleCloseOffcanvasFilters();
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };

  // Function to sort the products based on the selected sort option
  const sortProducts = (products, sortOption) => {
    switch (sortOption) {
      case "price-low-to-high":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high-to-low":
        return [...products].sort((a, b) => b.price - a.price);
      case "name-a-to-z":
        return [...products].sort((a, b) =>
          a.name.localeCompare(b.name, "en", { sensitivity: "base" })
        );
      case "name-z-to-a":
        return [...products].sort((a, b) =>
          b.name.localeCompare(a.name, "en", { sensitivity: "base" })
        );
      default:
        return products;
    }
  };

  return (
    <div className={`${bem("page", "catalog")}`}>
      {loaded ? (
        products.length > 0 ? (
          <div className={`${bem("catalog", "container")}`}>
            {/* Filters */}
            <div className={`${bem("catalog", "filters")}`}>
              <h1 className={`${bem("catalog", "title")} heading`}>Filtre</h1>
              {/* Filter by price */}
              <div className={`${bem("catalog", "filter", "price")}`}>
                <h3 className={`${bem("catalog", "subtitle")}`}>Pret</h3>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={currentPrice}
                  className={`${bem("catalog", "filter", "price-input")}`}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  step="2"
                />
                <div className={`${bem("catalog", "filter", "values")}`}>
                  <span className={`${bem("catalog", "filter", "min-value")}`}>
                    {minPrice}
                  </span>
                  <span>-</span>
                  <span className={`${bem("catalog", "filter", "curr-value")}`}>
                    {currentPrice > 0 ? currentPrice : maxPrice}
                  </span>
                </div>
              </div>

              {/* Submit filters */}
              <div className={`${bem("catalog", "filter", "submit")}`}>
                <button
                  className={`${bem("catalog", "filter", "submit-btn")} btn`}
                  onClick={handleFilterSubmit}
                >
                  Filtreaza
                </button>
              </div>
            </div>

            <div className={`${bem("catalog", "products-wrapper")}`}>
              {/* Catalog listing */}
              <h1 className={`${bem("catalog", "title")} heading`}>Catalog</h1>
              <div className={`${bem("catalog", "actions")}`}>
                {/* Catalog fitlers on mobile */}
                <div
                  className={`${bem("catalog", "mobile-filters", "wrapper")}`}
                >
                  <button
                    className="btn btn-primary"
                    onClick={handleShowOffcanvasFilters}
                  >
                    <FilterIcon />
                    Filtreaza
                  </button>

                  {/* Offcanvas mobile filters */}
                  <Offcanvas
                    show={showOffcanvasFilters}
                    onHide={handleCloseOffcanvasFilters}
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>Filtre</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <div className={`${bem("catalog", "filters-mobile")}`}>
                        {/* <{h1 className={`${bem("catalog", "title")} heading`}>
                          Filtre
                        </h1>} */}
                        {/* Filter by price */}
                        <div className={`${bem("catalog", "filter", "price")}`}>
                          <h3 className={`${bem("catalog", "subtitle")}`}>
                            Pret
                          </h3>
                          <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            value={currentPrice}
                            className={`${bem(
                              "catalog",
                              "filter",
                              "price-input"
                            )}`}
                            onChange={(e) =>
                              setCurrentPrice(Number(e.target.value))
                            }
                            step="2"
                          />
                          <div
                            className={`${bem("catalog", "filter", "values")}`}
                          >
                            <span
                              className={`${bem(
                                "catalog",
                                "filter",
                                "min-value"
                              )}`}
                            >
                              {minPrice}
                            </span>
                            <span>-</span>
                            <span
                              className={`${bem(
                                "catalog",
                                "filter",
                                "curr-value"
                              )}`}
                            >
                              {currentPrice > 0 ? currentPrice : maxPrice}
                            </span>
                          </div>
                        </div>

                        {/* Submit filters */}
                        <div
                          className={`${bem("catalog", "filter", "submit")}`}
                        >
                          <button
                            className={`${bem(
                              "catalog",
                              "filter",
                              "submit-btn"
                            )} btn`}
                            onClick={handleFilterSubmit}
                          >
                            Filtreaza
                          </button>
                        </div>
                      </div>
                    </Offcanvas.Body>
                  </Offcanvas>
                </div>

                {/* Catalog sprting */}
                <div className={`${bem("catalog", "sort", "wrapper")}`}>
                  <span className={`${bem("catalog", "sort", "label")}`}>
                    Sorteaza:
                  </span>
                  <select
                    value={sortOption}
                    onChange={handleSortOptionChange}
                    className={`${bem("catalog", "sort", "options")}`}
                  >
                    <option
                      className={`${bem("catalog", "sort", "option")}`}
                      value="name-a-to-z"
                    >
                      Alfabetic crescator
                    </option>
                    <option
                      className={`${bem("catalog", "sort", "option")}`}
                      value="name-z-to-a"
                    >
                      Alfabetic descrescator
                    </option>
                    <option
                      className={`${bem("catalog", "sort", "option")}`}
                      value="price-low-to-high"
                    >
                      Pret crescator
                    </option>
                    <option
                      className={`${bem("catalog", "sort", "option")}`}
                      value="price-high-to-low"
                    >
                      Pret descrescator
                    </option>
                  </select>
                </div>
              </div>
              <Container className={`${bem("catalog", "listing")}`}>
                {products.map((product) => (
                  <ListingProductFormat key={product.id} product={product} />
                ))}
              </Container>
            </div>
          </div>
        ) : (
          <div className={`${bem("catalog", "no-results")}`}>
            <span className={`${bem("catalog", "no-results", "label")}`}>
              Niciun produs returnat in urma cautarii '{query}'
            </span>
            <figure className={`${bem("catalog", "no-results", "image")}`}>
              <img src="https://live.staticflickr.com/65535/52929262326_cf689ced63_o.png" />
            </figure>
          </div>
        )
      ) : null}
    </div>
  );
}
