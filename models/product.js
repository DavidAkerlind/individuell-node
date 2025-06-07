import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
	prodId: {
		type: String,
		required: true,
		unique: true,
	},
	title: {
		type: String,
		required: true,
		unique: true,
	},
	desc: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
		min: [0, 'Price cannot be negative'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	modifiedAt: {
		type: Date,
	},
});

const Product = mongoose.model('Product', productSchema);

export default Product;
