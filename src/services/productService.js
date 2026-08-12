import Product from "../../backend/models/Product.js";

export const createProduct = async (req, res) => {
  console.log('========== CREATE PRODUCT ==========');
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
   const { productName, sku, barcode, category, supplier, purchasePrice, sellingPrice, quantity, description, status } = req.body;
   try {
     const existingProduct = await Product.findOne({ sku }); 
     if (existingProduct) {
        return res.status(400).json({ message: "Product with this SKU already exists" });
     }
     
     const imagePath = req.file ? req.file.path : null;
     
     const newProduct = new Product({
        productName,
        sku,
        barcode,
        category,
        supplier,
        purchasePrice,
        sellingPrice,
        quantity: quantity ? parseInt(quantity, 10) : 0,
        description,
        status: status || 'Active',
        image: imagePath
     });
     
     await newProduct.save();
     res.status(201).json({ message: "Product created successfully", product: newProduct });
   } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).json({ message: "Server error" });
   } 
};

export const getProducts = async (req, res) => {
  try {
    const { sku, category } = req.query;
    
    // Build a dynamic query object
    let filter = {};
    if (sku) filter.sku = sku;
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { sku } = req.params; // Grab sku from URL parameters
    
    const product = await Product.findOne({ sku });
    
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
     console.error("Error fetching product:", error.message);
     res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
   const { id } = req.params;
   const { productName, sku, barcode, category, supplier, purchasePrice, sellingPrice, quantity, description, status } = req.body;
   
   try {
     // Check if the product exists
     const product = await Product.findById(id);
     if (!product) {
        return res.status(404).json({ message: "Product not found" });
     }

     // If SKU is being updated, check if another product already uses this SKU
     if (sku && sku !== product.sku) {
        const existingProduct = await Product.findOne({ sku, _id: { $ne: id } });
        if (existingProduct) {
           return res.status(400).json({ message: "Product with this SKU already exists" });
        }
     }
     
     // Handle new image upload if present, otherwise keep the existing image
     const imagePath = req.file ? req.file.path : product.image;
     
     // Build update payload
     const updateData = {
        productName: productName || product.productName,
        sku: sku || product.sku,
        barcode: barcode !== undefined ? barcode : product.barcode,
        category: category || product.category,
        supplier: supplier || product.supplier,
        purchasePrice: purchasePrice !== undefined ? parseFloat(purchasePrice) : product.purchasePrice,
        sellingPrice: sellingPrice !== undefined ? parseFloat(sellingPrice) : product.sellingPrice,
        quantity: quantity !== undefined ? parseInt(quantity, 10) : product.quantity,
        description: description !== undefined ? description : product.description,
        status: status || product.status,
        image: imagePath
     };

     const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
     });

     res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
   } catch (error) {
      console.error("Error updating product:", error.message);
      res.status(500).json({ message: "Server error" });
   } 
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProductFetch = async () => {
  try {
    const response = await api.get('/products');
    
    // Handle different backend response structures safely
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    
    // Fallback if it's an object wrapping arrays
    return [];
  } catch (error) {
    console.error(
      'GET PRODUCTS ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};