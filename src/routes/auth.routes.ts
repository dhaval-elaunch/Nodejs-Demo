import express from 'express';
import { register, login, logout, createProduct, getProducts, registerAdmin, uploadMedia } from '../controllers/auth.controller';
import { admin, protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

router.post('/admin/register', registerAdmin);

router.post('/createProduct', protect, admin, createProduct);
router.get('/getProducts', protect, admin, getProducts);

router.post('/uploadMedia', protect, admin, uploadMedia);

export default router;
