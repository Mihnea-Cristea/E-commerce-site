import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/catalog.css";
import { bem } from "../../lib/bem";
import CartIcon from "../../icons/CartIcon";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import ListingProductFormat from "./ListingProductFormat";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const productsCollectionRef = collection(db, "products");

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getProducts();
  }, []);

  return (
    <div className={`${bem("catalog-listing", "container")}`}>
      <Container className="container-grid">
        {products.map((product) => (
          <ListingProductFormat key={product.id} product={product} />
        ))}
      </Container>
    </div>
  );
}
export default ProductsList;
