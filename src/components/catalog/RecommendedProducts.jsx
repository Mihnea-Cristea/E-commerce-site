import React, { useState, useEffect } from "react";
import ProductsList from "./ProductsList";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { bem } from "../../lib/bem";

// css
import "../../assets/css/page.css";
import { Container } from "react-bootstrap";
import ListingProductFormat from "./ListingProductFormat";

export default function RecommendedProducts() {
  const [prod, setProd] = useState();
  const [products, setProducts] = useState([]);
  const prodIDs = [
    "PHBmCmNKIjUPD1U74wWm",
    "0lTqJ2r2i0uiygUtsk9E",
    "FKG7NK3XVcE9OOoEWxRP",
  ];
  const productsCollectionRef = collection(db, "products");

  const { currentUser } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      const productPromises = prodIDs.map(async (id) => {
        const docRef = doc(db, "products", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
          console.log(`Product with ID ${id} not found`);
          return null;
        }
      });

      const resolvedProducts = await Promise.all(productPromises);
      const filteredProducts = resolvedProducts.filter(
        (product) => product !== null
      );

      setProducts(filteredProducts);
    };

    getProducts();
  }, []);

  return (
    <div className={`${bem("catalog", "recommended")}`}>
      <h2 className={`${bem("catalog", "title")} heading`}>
        Recomandate pentru tine
      </h2>
      <div className={`${bem("catalog", "wrapper")}`}>
        {products.map((product) => (
          <ListingProductFormat key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
