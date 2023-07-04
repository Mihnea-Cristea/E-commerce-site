import React, { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Container } from "react-bootstrap";
import { bem } from "../../lib/bem";
import { Navigate } from "react-router";
import deepai from "deepai";

export default function EditProducts() {
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newImages, setNewImages] = useState([]);
  const [newIngredients, setNewIngredients] = useState();
  const [newGramaj, setNewGramaj] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [responseText, setResponseText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
  });

  const [products, setProducts] = useState([]);
  const productsCollectionRef = collection(db, "products");

  const createProduct = async () => {
    await addDoc(productsCollectionRef, {
      name: newName,
      price: newPrice,
      description: newDescription,
      images: newImages,
      category: newCategory,
      subcategory: newSubcategory,
      gramaj: newGramaj,
      ingredients: newIngredients,
    });
  };

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getProducts();
  }, []);

  async function updateProduct(productId, updatedProduct) {
    try {
      const productRef = doc(db, "products", productId);
      await setDoc(productRef, updatedProduct, { merge: true });
    } catch (error) {
      throw new Error("Error updating product:", error);
    }
  }

  const makeDeepAICall = async (name) => {
    const apiKey = "756f10ee-3463-4a54-ac00-9bba6cb1524c";
    const text = `Scrie in romana o scurta descriere al unui produs cu numele ${name}`;
    deepai.setApiKey(apiKey);

    var result = await deepai.callStandardApi("text-generator", {
      text: text,
    });

    document.getElementById("generatedDescription").value = result.output;
    return result.output;
  };

  const handleGenerateDescriptionButtonClick = (event, name) => {
    makeDeepAICall(name);
  };

  const handleSubmit = async (event, id) => {
    event.preventDefault();
    const imagesProduct = [];

    event.target.elements.imageMain.value
      ? imagesProduct.push(event.target.elements.imageMain.value)
      : null;

    event.target.elements.image2.value
      ? imagesProduct.push(event.target.elements.image2.value)
      : null;

    event.target.elements.image3.value
      ? imagesProduct.push(event.target.elements.image3.value)
      : null;

    event.target.elements.image4.value
      ? imagesProduct.push(event.target.elements.image4.value)
      : null;

    event.target.elements.image5.value
      ? imagesProduct.push(event.target.elements.image5.value)
      : null;
    // Get the updated form values
    const updatedProduct = {
      name: event.target.elements.name.value
        ? event.target.elements.name.value
        : "",
      price: event.target.elements.price.value
        ? event.target.elements.price.value
        : "",
      description: event.target.elements.description.value
        ? event.target.elements.description.value
        : "",
      category: event.target.elements.category.value
        ? event.target.elements.category.value
        : "",
      subcategory: event.target.elements.subcategory.value
        ? event.target.elements.subcategory.value
        : "",
      images: imagesProduct,
      ingredients: event.target.elements.ingredients.value
        ? event.target.elements.ingredients.value
        : "",
      gramaj: event.target.elements.gramaj.value
        ? event.target.elements.gramaj.value
        : "",
    };

    try {
      // Update the product in the Firebase database
      await updateProduct(id, updatedProduct);
      <Navigate to={`/product/${id}`} />;

      // Redirect or show a success message
    } catch (error) {
      console.log(error);
      // Handle the error
    }
  };

  return (
    <div className={`${bem("page", "catalog-edit")}`}>
      {/* <ProductsList /> */}
      <a href="/catalog" className={`${bem("catalog-edit", "back")}`}>
        Inapoi la catalog
      </a>
      {/* Add new product */}
      <h1 className={`${bem("catalog-edit", "heading")}`}>Adauga produs</h1>
      <Container className={`${bem("catalog-edit", "add-product")}`}>
        {/* Name input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Name..."
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />

        {/* Price input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Price..."
          onChange={(e) => {
            setNewPrice(e.target.value);
          }}
        />

        {/* Description input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Description..."
          onChange={(e) => {
            setNewDescription(e.target.value);
          }}
        />

        {/* Category input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Category..."
          onChange={(e) => {
            setNewCategory(e.target.value);
          }}
        />

        {/* Subcategory input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Subcategory..."
          onChange={(e) => {
            setNewSubcategory(e.target.value);
          }}
        />

        {/* Ingredients input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Ingrediente..."
          onChange={(e) => {
            setNewIngredients(e.target.value);
          }}
        />

        {/* Gramaj input */}
        <input
          className={`${bem("catalog-edit", "input")}`}
          placeholder="Gramaj..."
          onChange={(e) => {
            setNewGramaj(e.target.value);
          }}
        />

        {/* Images input */}
        <div className={`${bem("catalog-edit", "input", "images")}`}>
          <input
            className={`${bem("catalog-edit", "input")}`}
            placeholder="Main image..."
            onChange={(e) => {
              const updatedImages = [...newImages, e.target.value];
              setNewImages(updatedImages);
            }}
          />
          <input
            className={`${bem("catalog-edit", "input")}`}
            placeholder="Imagine 2"
            onChange={(e) => {
              const updatedImages = [...newImages, e.target.value];
              setNewImages(updatedImages);
            }}
          />
          <input
            className={`${bem("catalog-edit", "input")}`}
            placeholder="Imagine 3"
            onChange={(e) => {
              const updatedImages = [...newImages, e.target.value];
              setNewImages(updatedImages);
            }}
          />
          <input
            className={`${bem("catalog-edit", "input")}`}
            placeholder="Imagine 4"
            onChange={(e) => {
              const updatedImages = [...newImages, e.target.value];
              setNewImages(updatedImages);
            }}
          />
          <input
            className={`${bem("catalog-edit", "input")}`}
            placeholder="Imagine 5"
            onChange={(e) => {
              const updatedImages = [...newImages, e.target.value];
              setNewImages(updatedImages);
            }}
          />
        </div>
      </Container>

      <button
        className={`${bem("catalog-edit", "add-product", "btn")}`}
        onClick={async () => {
          await createProduct();
          window.location.reload();
        }}
      >
        Create Product
      </button>

      {/* Update product */}
      <h1 className={`${bem("catalog-edit", "heading")}`}>Modifica produs</h1>
      <input
        className={`${bem("catalog-edit", "input", "search")}`}
        type="search"
        placeholder="Cauta produs..."
      ></input>
      <Container className={`${bem("catalog-edit", "products")}`}>
        {products.map((product) => {
          return (
            <div
              key={Math.floor(Math.random() * 1000000)}
              className={`${bem("catalog-edit", "product-wrapper")}`}
            >
              {/* Product details */}
              <div className={`${bem("catalog-edit", "product", "details")}`}>
                <form
                  onSubmit={(event) => handleSubmit(event, product.id)}
                  className={`${bem("catalog-edit", "form")}`}
                >
                  {/* New name */}
                  <label
                    className={`${bem("catalog-edit", "product-form", "name")}`}
                  >
                    Nume:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-name"
                      name="name"
                      defaultValue={product.name}
                    />
                  </label>

                  {/* New price */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "price"
                    )}`}
                  >
                    Pret:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-price"
                      defaultValue={product.price}
                      name="price"
                    />
                  </label>

                  {/* New description */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "description"
                    )}`}
                  >
                    Descriere:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      type="textarea"
                      name="description"
                      id="product-update-description"
                      defaultValue={product.description}
                    />
                  </label>
                  <button
                    className="my-3"
                    onClick={(e) => {
                      handleGenerateDescriptionButtonClick(e, product.name);
                    }}
                  >
                    Genereaza descriere
                  </button>

                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "description-generation"
                    )}`}
                  >
                    {" "}
                    Descriere generata de DEEP AI:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      name="generatedDescription"
                      id="generatedDescription"
                      type="text"
                    />
                  </label>

                  {/* New category */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "category"
                    )}`}
                  >
                    Categorie:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-category"
                      name="category"
                      defaultValue={product.category}
                    />
                  </label>

                  {/* New subcategory */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "subcategory"
                    )}`}
                  >
                    Subcategorie:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-subcategory"
                      name="subcategory"
                      defaultValue={product.subcategory}
                    />
                  </label>

                  {/* New ingredients */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "ingredients"
                    )}`}
                  >
                    Ingrediente:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-ingredients"
                      defaultValue={product.ingredients}
                      name="ingredients"
                    />
                  </label>

                  {/* New gramaj */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "gramaj"
                    )}`}
                  >
                    Gramaj:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-gramaj"
                      defaultValue={product.gramaj}
                      name="gramaj"
                    />
                  </label>

                  {/* New image main */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "image-main"
                    )}`}
                  >
                    Imagine principala:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-image-main"
                      name="imageMain"
                      defaultValue={product.images[0]}
                    />
                  </label>

                  {/* New image 2 */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "image-2"
                    )}`}
                  >
                    Imagine 2:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-image-2"
                      name="image2"
                      defaultValue={product.images[1]}
                    />
                  </label>

                  {/* New image 3 */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "image-3"
                    )}`}
                  >
                    Imagine 3:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-image-3"
                      name="image3"
                      defaultValue={product.images[2]}
                    />
                  </label>

                  {/* New image 4 */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "image-4"
                    )}`}
                  >
                    Imagine 4:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-image-4"
                      name="image4"
                      defaultValue={product.images[3]}
                    />
                  </label>

                  {/* New image 5 */}
                  <label
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "image-5"
                    )}`}
                  >
                    Imagine 5:
                    <input
                      className={`${bem(
                        "catalog-edit",
                        "product-form",
                        "input"
                      )}`}
                      id="product-update-image-5"
                      name="image5"
                      defaultValue={product.images[4]}
                    />
                  </label>

                  <button
                    type="submit"
                    className={`${bem(
                      "catalog-edit",
                      "product-form",
                      "submit"
                    )}`}
                  >
                    Submit
                  </button>
                </form>

                <div className={`${bem("catalog-edit", "product", "images")}`}>
                  {product.images
                    ? product.images.map((image) => {
                        return (
                          <figure key={Math.floor(Math.random() * 1000000)}>
                            <img
                              src={`${image}`}
                              width="100"
                              height="100"
                              className="img-thumb"
                            />
                          </figure>
                        );
                      })
                    : null}
                </div>
              </div>

              {/* Product submit */}
              <div className={`${bem("catalog-edit", "product", "submit")}`}>
                {/* Delete product */}
                <button
                  className={`${bem("catalog-edit", "product", "btn")}`}
                  onClick={async () => {
                    await deleteProduct(product.id);
                    window.location.reload();
                  }}
                >
                  Delete Product
                </button>
              </div>
            </div>
          );
        })}
      </Container>
    </div>
  );
}
