import React, { useEffect, useState } from "react";
import CartProducts from "./CartProducts";
import { Container } from "react-bootstrap";
import { bem } from "../../lib/bem";
import CartSubtotal from "./CartSubtotal";
import { db } from "../../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

// css
import "../../assets/css/page.css";
import "../../assets/css/cart.css";
import TrashIcon from "../../icons/TrashIcon";

export default function Cart() {
  const cartCollectionRef = collection(db, "cart");
  const productsCollectionRef = collection(db, "products");
  const ordersCollectionRef = collection(db, "orders");
  const mailCollectionRef = collection(db, "mail");
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const sendOrderMail = (toMail, content) => {
    const emailSubject = "Comanda";
    /* const emailHtml = `<h2>Salut, ${username}</h2><a>Te-ai inregistrat cu succes! </a> `; */

    try {
      const mailData = {
        to: toMail,
        message: {
          subject: emailSubject,
          html: content,
        },
      };

      addDoc(mailCollectionRef, mailData);
      console.log("Email added to the database successfully.");
    } catch (error) {
      console.error("Error adding email to the database:", error);
    }
  };

  // check if product is already in cart

  const getCartItems = async () => {
    setLoaded(false);
    const q = query(cartCollectionRef, where("user_id", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);

    const allCart = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setCart(allCart);
    calculateCartTotals(allCart);
  };

  const sendOrder = async () => {
    try {
      const order = {
        user_id: currentUser.uid,
        products: cart.map((product) => ({
          product_id: product.product_id,
          quantity: product.quantity,
          product_name: product.product_name,
        })),
        total_price: total,
      };

      const orderEmailContainer = `
        <h2>Comanda dvs.</h2>
        <table style="width:100%; text-align:left;">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${cart
            .map(
              (product) => `
            <tr>
              <td>${product.product_name}</td>
              <td>${product.quantity}</td>
              <td>${product.product_price} RON</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="2"><strong>Total:</strong></td>
            <td><strong>${total} RON</strong></td>
          </tr>
        </table>
      `;

      const docRef = await setDoc(doc(ordersCollectionRef), order);
      sendOrderMail(currentUser.email, orderEmailContainer);
      //console.log(currentUser.email);

      // Clear the cart after sending the order
      await deleteCartItems();
    } catch (error) {
      console.error("Error sending order: ", error);
    }
  };

  const deleteCartItems = async () => {
    try {
      const cartQuerySnapshot = await getDocs(
        query(cartCollectionRef, where("user_id", "==", currentUser.uid))
      );
      await cartQuerySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      console.log("Cart items deleted successfully!");
      getCartItems(); // Refresh cart items after deletion
    } catch (error) {
      console.error("Error deleting cart items: ", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const productDocRef = doc(cartCollectionRef, productId);
      await deleteDoc(productDocRef);
      console.log("Item deleted successfully!");
      getCartItems(); // Refresh cart items after deletion
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleIncrement = async (productId) => {
    try {
      const productDocRef = doc(cartCollectionRef, productId);
      await updateDoc(productDocRef, {
        quantity: cart.find((product) => product.id === productId).quantity + 1,
      });
      console.log("Quantity incremented successfully!");
      getCartItems(); // Refresh cart items after increment
    } catch (error) {
      console.error("Error incrementing quantity: ", error);
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const productDocRef = doc(cartCollectionRef, productId);
      const currentQuantity = cart.find(
        (product) => product.id === productId
      ).quantity;
      if (currentQuantity > 1) {
        await updateDoc(productDocRef, { quantity: currentQuantity - 1 });
        console.log("Quantity decremented successfully!");
      } else {
        console.log("Minimum quantity reached!");
      }
      getCartItems(); // Refresh cart items after decrement
    } catch (error) {
      console.error("Error decrementing quantity: ", error);
    }
  };

  const calculateCartTotals = (cartItems) => {
    const subTotal = cartItems.reduce((accumulator, item) => {
      const totalPrice = item.quantity * parseInt(item.product_price);
      return accumulator + totalPrice;
    }, 0);
    const tax = 0; //subTotal * 0.1; // assuming 10% tax
    const total = subTotal + tax;

    setSubtotal(subTotal);
    setTax(tax);
    setTotal(total);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <div className={`${bem("page")}`}>
      <div className={`${bem("page", "cart")}`}>
        <div className={`${bem("cart", "container")}`}>
          {/* Product list container */}
          <div className={`${bem("cart", "products")}`}>
            {/* <CartProducts /> */}
            <table className={`${bem("cart-listing")}`}>
              <thead>
                <tr>
                  <th className={`${bem("cart-listing", "item", "heading")}`}>
                    Product
                  </th>
                  <th className={`${bem("cart-listing", "item", "heading")}`}>
                    Price
                  </th>
                  <th className={`${bem("cart-listing", "item", "heading")}`}>
                    Quantity
                  </th>
                  <th className={`${bem("cart-listing", "item", "heading")}`}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product, index) => {
                  const totalPrice =
                    product.quantity * parseInt(product.product_price);

                  return (
                    <tr key={index}>
                      <td
                        className={`${bem(
                          "cart-listing",
                          "item",
                          "details-wrapper"
                        )}`}
                      >
                        <figure>
                          <img
                            src={product.product_thumb}
                            className="img img-thumb"
                          />
                        </figure>
                        <div
                          className={`${bem(
                            "cart-listing",
                            "item",
                            "name-wrapper"
                          )}`}
                        >
                          <span>{product.product_name}</span>
                          <a
                            className={`${bem(
                              "cart-listing",
                              "item",
                              "delete"
                            )}`}
                            onClick={() => handleDelete(product.id)}
                          >
                            <TrashIcon />
                          </a>
                        </div>
                      </td>
                      <td className={`${bem("cart-listing", "item", "price")}`}>
                        {product.product_price} RON
                      </td>
                      <td
                        className={`${bem("cart-listing", "item", "quantity")}`}
                      >
                        <button
                          className={`${bem(
                            "cart-listing",
                            "quantity",
                            "decrement"
                          )}`}
                          onClick={() => handleDecrement(product.id)}
                        >
                          <span>-</span>
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          className={`${bem(
                            "cart-listing",
                            "quantity",
                            "increment"
                          )}`}
                          onClick={() => handleIncrement(product.id)}
                        >
                          <span>+</span>
                        </button>
                      </td>
                      <td className={`${bem("cart-listing", "item", "total")}`}>
                        {totalPrice} RON
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals container */}
          <div className={`${bem("cart", "subtotal")}`}>
            <div className={`${bem("cart-subtotal", "wrapper")}`}>
              <h2
                className={`${bem("cart-subtotal", "item", "title")} heading`}
              >
                Subtotal
              </h2>
              <div className={`${bem("cart-subtotal", "item", "subtotal")}`}>
                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  Subtotal
                </span>

                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  {subtotal} RON
                </span>
              </div>
              <div
                className={`${bem("cart-subtotal", "item", "delivery-cost")}`}
              >
                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  Cost livrare
                </span>

                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  {tax} RON
                </span>
              </div>
              <div className={`${bem("cart-subtotal", "item", "total")}`}>
                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  Total
                </span>

                <span className={`${bem("cart-subtotal", "item-label")}`}>
                  {total} RON
                </span>
              </div>
            </div>
            <button
              className={`${bem("cart-subtotal", "submit")} btn btn-primary`}
              onClick={sendOrder}
            >
              Trimite comanda {/* send order... */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
