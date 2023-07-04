import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartIcon from "../../icons/CartIcon";
import { bem } from "../../lib/bem";
import { db } from "../../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

export default function ListingProductFormat({ product }) {
  const cartCollectionRef = collection(db, "cart");
  const { currentUser } = useAuth();

  async function addProductToCart(product) {
    const dataCart = await getDocs(cartCollectionRef);
    const allCart = dataCart.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const productInCart = allCart.filter(
      (cart) => cart.product_id === product.id
    );

    const isProductInCart = productInCart.length > 0;

    if (!isProductInCart) {
      (async () => {
        try {
          await addDoc(cartCollectionRef, {
            price: product.price,
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_thumb: product.images[0],
            quantity: 1,
            user_id: currentUser.uid,
          });
        } catch (error) {
          console.error("Error adding item to cart:", error);
          throw error;
        }
      })();
    } else {
      const existingCartItem = productInCart[0];
      const existingUserId = existingCartItem.user_id;

      if (existingUserId !== currentUser.uid) {
        (async () => {
          try {
            await addDoc(cartCollectionRef, {
              price: product.price,
              product_id: product.id,
              product_name: product.name,
              product_price: product.price,
              product_thumb: product.images[0],
              quantity: 1,
              user_id: currentUser.uid,
            });
          } catch (error) {
            console.error("Error adding item to cart:", error);
            throw error;
          }
        })();
      } else {
        const cartItemId = existingCartItem.id;
        const cartQuantity = parseInt(existingCartItem.quantity);
        const cartItemRef = doc(cartCollectionRef, cartItemId);

        try {
          await updateDoc(cartItemRef, {
            quantity: cartQuantity + 1,
          });
        } catch (error) {
          console.error("Error updating item quantity:", error);
          throw error;
        }
      }
    }
  }
  return (
    <div key={product.id} className={`${bem("catalog", "product")}`}>
      <Link to={`/product/${product.id}`}>
        <img
          src={product.images[0] ? product.images[0] : ""}
          alt={product.name}
        />
      </Link>
      <Container className={`${bem("product", "details")} px-0`}>
        <Container className={`${bem("product", "heading")} px-0`}>
          <Link
            to={`/product/${product.id}`}
            className={`${bem("product", "name")}`}
          >
            {product.name}
          </Link>

          <div className={`${bem("product", "description")}`}>
            {product.description}
          </div>

          <div className={`${bem("product", "ingredients")}`}>
            {product.ingredients}
          </div>
        </Container>

        <Container className={`${bem("product", "data")} px-0`}>
          <span className={`${bem("product", "price")}`}>
            {product.price}
            <sup>,99</sup> RON
          </span>
          <button
            className={`${bem("product", "add-to-cart")}`}
            onClick={() => addProductToCart(product)}
          >
            <CartIcon /> <span>Adauga in cos</span>
          </button>
        </Container>
      </Container>
    </div>
  );
}
