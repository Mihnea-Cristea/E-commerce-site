import React, { useEffect, useState } from "react";
import { bem } from "../../lib/bem";
import { db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

// css
import "../../assets/css/cart.css";

export default function CartProducts() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const productsCollectionRef = collection(db, "products");

  const getProducts = async () => {
    const data = await getDocs(productsCollectionRef);
    const allProducts = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setProducts(allProducts);
    setLoaded(true);
  };

  useEffect(() => {
    setLoaded(false);
    getProducts();
  }, []);

  return (
    <div className={`${bem("cart-listing")}`}>
      <ul className={`${bem("cart-listing", "items")}`}>
        <li className={`${bem("cart-listing", "item", "heading")}`}>Product</li>
        {}
        <li className={`${bem("cart-listing", "item", "row")}`}></li>
        <li className={`${bem("cart-listing", "item", "row")}`}></li>
      </ul>
    </div>
  );
}
