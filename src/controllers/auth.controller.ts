import { Request, Response } from 'express';
import User from '../models/user';
import { generateToken } from '../utils/generateToken';
import Product from '../models/product';
import AuthRequest from '../middleware/auth.middleware';
import { generateThumbnail } from '../utils/ffmpeg';
import path from 'path';
import fs from 'fs';
import { upload } from '../utils/multer';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password, role: 'user' });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id.toString(), user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// 👑 Admin Registration (only for testing — secure this in production)
export const registerAdmin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const adminExists = await User.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await User.create({ username, email, password, role: 'admin' });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id.toString(), admin.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id.toString(), user.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Create Product
export const createProduct = async (req: AuthRequest, res: Response) => {
  const { name, description, price } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      createdBy: req.user?._id
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get All Products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('createdBy', 'username email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get Single Product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'username email');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update Product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { name, description, price } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only creator can update
    if (product.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete Product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only creator can delete
    if (product.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Upload Media
export const uploadMedia = async (req: Request, res: Response) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const filePath = req.file.path;
      
      const fileType = req.file.mimetype;

      // For video files, generate a thumbnail
      if (fileType.startsWith('video/')) {
        const thumbnailName = `${path.parse(req.file.filename).name}-thumbnail.png`;
        const thumbnailPath = path.join('src/uploads', 'thumbnails', thumbnailName);

        // Ensure the thumbnails directory exists
        fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });

        await generateThumbnail(filePath, thumbnailPath);

        return res.status(200).json({
          message: 'Video uploaded with thumbnail generated',
          videoPath: filePath,
          thumbnailPath,
        });
      }

      // For image uploads
      res.status(200).json({
        message: 'Image uploaded successfully',
        imagePath: filePath,
      });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ message: 'File upload failed', error });
    }
  });
};
