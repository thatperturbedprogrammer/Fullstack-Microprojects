import { useEffect, useState } from "react";
import "./CrudFrontend.css";

export default function CrudFrontend() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch Products
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      const result = await response.json();

      console.log(result);

      if (Array.isArray(result)) {
        setProducts(result); // Directly set the products array
      }
    } catch (error) {
      console.log("Error Fetching Products: ", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Input Changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Handle Form Submission (Create & Update)
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingProduct) {
        // UPDATE existing product (PUT Request)
        const response = await fetch(
          `http://localhost:3000/api/products/${editingProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product._id === editingProduct._id
                ? { ...product, ...formData }
                : product
            )
          );
          setEditingProduct(null); // reset editing state
          setFormData({ name: "", quantity: "", price: "" }); // Reset form
        }
      } else {
        // Create new product
        const response = await fetch("http://localhost:3000/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          setProducts((prevProducts) => [...prevProducts, result]); // Add new product to list
        } else {
          console.log("Error: ", result.message);
        }
      }
      setFormData({ name: "", quantity: "", price: "" }); // Reset form
    } catch (error) {
      console.log("Error creating product: ", error);
    }
  }

  //   Handle Edit Button Clicks
  function handleEdit(product) {
    setEditingProduct(product); // Set selected product for editing
    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    }); // Prefill form
  }
  // Handle Delete Function
  async function handleDelete(productId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.log("Error deleting product");
      }
    } catch (error) {
      console.log("Error deleting product: ", error);
    }
  }

  return (
    <>
      <div className="main-container">
        {/* CRUD */}

        {/* Create section */}
        <section>
          <h2>Products</h2>
          <div className="create">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Product Name: </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleInputChange}
                value={formData.name}
              />
              <label htmlFor="quantity">Product Quantity: </label>
              <input
                id="quantity"
                name="quantity"
                type="text"
                onChange={handleInputChange}
                value={formData.quantity}
              />
              <label htmlFor="price">Product Price: </label>
              <input
                id="price"
                name="price"
                type="text"
                onChange={handleInputChange}
                value={formData.price}
              />
              <button type="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </section>

        {/* Read section */}
        <section>
          <div className="read">
            <ol>
              {products.map((product) => (
                <li key={product._id}>
                  {/* Use MongoDB _id as key */}
                  <h3>{product.name}</h3>
                  <h5>Price: {product.price}</h5>
                  <h5>Quantity: {product.quantity}</h5>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}
