const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  //   res.send("Hello from Node API Server");
  return res.status(200).json({ name: "Sid" });
});

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection: Success");
    app.listen(3000, () => {
      console.log("App is listening on port 3000");
    });
  })
  .catch(() => console.log("DB Connection: Failed"));

// C - Create [POST]
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// R - Read [GET]
app.get("/api/products", async (req, res) => {
  try {
    const product = await Product.find({});
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// R -Read by Id [GET]
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// U - Update by Id [PUT]
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndUpdate(id, req.body);
    const updatedProduct = await Product.findById(id);

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// D - Delete by Id [DELETE]
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
