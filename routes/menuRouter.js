import express from 'express';
import Product from '../models/product.js';
import { fallbackService } from '../services/fallbackService.js';
import { v4 as uuid } from 'uuid';
import adminOnly from '../middlewares/admin.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// GET product to menu
router.get('/', async (req, res, next) => {
	const menu = await Product.find();
	if (menu && menu.length > 0) {
		console.log('Menu loaded successfully');
		return res
			.status(200)
			.json({ success: true, message: `Found menu`, menu: menu });
	} else {
		return next({ status: 400, message: `No menu found` });
	}
});

// Lägg till ny produkt (admin)
router.post('/', auth, adminOnly, async (req, res, next) => {
	const { title, desc, price } = req.body;
	if (!title || !desc || typeof price !== 'number') {
		return next({
			status: 400,
			message: 'All fields are required (title, desc and price)',
		});
	}
	try {
		const prodId = `prod-${uuid()
			.toString()
			.replace(/-/g, '')
			.substring(0, 5)}`;
		const createdAt = new Date();
		const product = await Product.create({
			prodId,
			title,
			desc,
			price,
			createdAt,
		});
		return res.status(201).json({ success: true, product });
	} catch (error) {
		return next({ status: 400, message: error.message });
	}
});

// Uppdatera produkt (admin)
router.put('/:prodId', auth, adminOnly, async (req, res, next) => {
	const { prodId } = req.params;
	const { title, desc, price } = req.body;
	if (!title && !desc && typeof price !== 'number') {
		return next({
			status: 400,
			message: 'One field required (title, desc or price)',
		});
	}
	try {
		const update = { modifiedAt: new Date() };
		if (title) update.title = title;
		if (desc) update.desc = desc;
		if (typeof price === 'number') update.price = price;
		const product = await Product.findOneAndUpdate({ prodId }, update, {
			new: true,
		});
		if (!product) {
			return next({ status: 404, message: 'Product-id does not exist' });
		}
		return res.status(200).json({ success: true, product });
	} catch (error) {
		return next({ status: 400, message: error.message });
	}
});

// Ta bort produkt (admin)
router.delete('/:prodId', auth, adminOnly, async (req, res, next) => {
	const { prodId } = req.params;
	try {
		const product = await Product.findOneAndDelete({ prodId });
		if (!product) {
			return next({ status: 404, message: 'Product-id does not exist' });
		}
		return res.status(200).json({
			success: true,
			message: `Product with id:${prodId} deleted successfully`,
		});
	} catch (error) {
		return next({ status: 400, message: error.message });
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
