import Product from '../models/product.js';
import { v4 as uuid } from 'uuid';

export async function getProduct(prodId) {
	try {
		const product = await Product.findOne({ prodId: prodId });
		return product;
	} catch (error) {
		console.log(error.message);
		return null;
	}
}

// kanske inte behövs ändå
export async function getMenu() {
	try {
		const menu = await Product.find();
		return menu;
	} catch (error) {
		console.log(error.message);
		throw error;
	}
}

export async function deleteProduct(prodId) {
	try {
		const product = await Product.findOneAndDelete({ prodId });
		return product;
	} catch (error) {
		console.log(error.message);
		throw error;
	}
}

export async function createProduct({ title, desc, price }) {
	try {
		const { v4: uuid } = await import('uuid');
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
		return product;
	} catch (error) {
		console.log(error.message);
		throw error;
	}
}

export async function updateProduct(prodId, { title, desc, price }) {
	try {
		const update = { modifiedAt: new Date() };
		if (title) update.title = title;
		if (desc) update.desc = desc;
		if (typeof price === 'number') update.price = price;
		const product = await Product.findOneAndUpdate({ prodId }, update, {
			new: true,
		});
		return product;
	} catch (error) {
		console.log(error.message);
		throw error;
	}
}
