import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    // Validate ObjectId to avoid CastError causing a 500
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      stock,
      image,
      description,
      isEcoFriendly,
      isNew,
      inStock,
      rating,
      reviews,
      tags,
      features,
      salePrice,
      isSale,
      isVisible,
    } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }

    const product = new Product({
      name,
      category: category || 'General',
      price,
      originalPrice: originalPrice || 0,
      stock,
      image: image || '',
      description: description || '',
      isEcoFriendly: isEcoFriendly || false,
      isNew: isNew || false,
      inStock: inStock !== undefined ? inStock : true,
      rating: rating || 4,
      reviews: reviews || 0,
      tags: tags || [],
      features: features || [],
      salePrice: salePrice || 0,
      isSale: isSale || false,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      stock,
      image,
      description,
      isEcoFriendly,
      isNew,
      inStock,
      rating,
      reviews,
      tags,
      features,
      salePrice,
      isSale,
      isVisible,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;
    if (description !== undefined) product.description = description;
    if (isEcoFriendly !== undefined) product.isEcoFriendly = isEcoFriendly;
    if (isNew !== undefined) product.isNew = isNew;
    if (inStock !== undefined) product.inStock = inStock;
    if (rating !== undefined) product.rating = rating;
    if (reviews !== undefined) product.reviews = reviews;
    if (tags !== undefined) product.tags = tags;
    if (features !== undefined) product.features = features;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (isSale !== undefined) product.isSale = isSale;
    if (isVisible !== undefined) product.isVisible = isVisible;

    await product.save();
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

