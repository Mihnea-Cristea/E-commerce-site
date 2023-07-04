import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { bem } from "../../lib/bem";

import CartIcon from "../../icons/CartIcon";
// css
import "../../assets/css/product-details.css";
import { useAuth } from "../contexts/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  useEffect(() => {
    const getProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setProduct({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error getting product:", error);
      }
    };

    getProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${bem("page", "product")}`}>
      {/* Product container */}
      <div className={`${bem("product-details", "container")}`}>
        {/* Product images */}
        <div className={`${bem("product-details", "images")}`}>
          {/* Product images */}
          <div className={`${bem("product-details", "images")}`}>
            {/* Product main image */}
            <div className={`${bem("product-details", "image", "main")}`}>
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
              />
            </div>

            {/* Product secondary images */}
            <div className={`${bem("product-details", "image", "secondary")}`}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.name}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`${
                    bem("product-details", "image", "secondary-image ") +
                    (index === selectedImageIndex ? "selected" : "")
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product summary */}
        <div className={`${bem("product-details", "summary")}`}>
          <div className={`${bem("product-details", "data-wrapper")}`}>
            {/* Product name */}
            <h1 className={`${bem("product-details", "data", "heading")}`}>
              {product.name}
            </h1>

            {/* Product price */}
            <p className={`${bem("product-details", "data", "price")}`}>
              {product.price}
              <sup>,99</sup> RON
            </p>

            {/* Product category */}
            <p className={`${bem("product-details", "data", "category")}`}>
              Categorie: {product.category}
            </p>

            {/* Product subcategory */}
            <p className={`${bem("product-details", "data", "subcategory")}`}>
              Subcategorie: {product.subcategory}
            </p>

            {/* Product ingredients */}
            <p className={`${bem("product-details", "data", "subcategory")}`}>
              Ingrediente: {product.ingredients}
            </p>

            {/* Product gramaj */}
            <p className={`${bem("product-details", "data", "subcategory")}`}>
              Gramaj: {product.gramaj}g
            </p>

            {/* Product call */}
            <p className={`${bem("product-details", "data", "phone")}`}>
              Comanda telefonic la: 0712121212
            </p>

            {/* Product in stock */}
            <p className={`${bem("product-details", "data", "stock")}`}>
              Produs in stoc
            </p>
          </div>

          {/* Product add to cart */}
          <button
            className={`${bem("product-details", "add-to-cart")}`}
            onClick={() => addProductToCart(product)}
          >
            <CartIcon /> Adauga in cos
          </button>
        </div>
      </div>
      {/* Product description */}
      <h4>Descriere</h4>
      <div className={`${bem("product-details", "heading")}`}>
        {product.description}
      </div>
    </div>
  );
}

export default ProductDetail;
