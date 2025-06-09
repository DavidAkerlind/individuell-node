import express from 'express';
import { createUser, getUser } from '../services/userServices.js';
import { generateUserId } from '../utils/utils.js';
import { validateAuthData } from '../middlewares/validators.js';
import { fallbackService } from '../services/fallbackService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

//logout
router.get('/logout', (req, res, next) => {
	res.status(200).json({
		success: true,
		message: `Successfully logged out ${loggedOutUser}`,
	});
});

// register user
router.post('/register', validateAuthData, async (req, res, next) => {
	const { username, password, role = 'user' } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await createUser({
			username,
			password: hashedPassword,
			userId: generateUserId(),
			role,
		});
		if (user) {
			return res
				.status(201)
				.json({ success: true, message: `User created successfully` });
		} else {
			return next({
				status: 400,
				message: `Registration was not successful`,
			});
		}
	} catch (error) {
		return next({ status: 500, message: error.message });
	}
});

//login user
router.post('/login', validateAuthData, async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const user = await getUser(username);
		if (!user) {
			return next({ status: 400, message: `No user found` });
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return next({ status: 400, message: `Wrong username or password` });
		}
		if (user.role === 'admin') {
			const token = jwt.sign(
				{
					userId: user.userId,
					username: user.username,
					role: user.role,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);
			return res.status(200).json({
				success: true,
				message: `Logged in ${user.username} successfully`,
				token,
				userId: user.userId,
				role: user.role,
			});
		} else {
			return res.status(200).json({
				success: true,
				message: `Logged in ${user.username} successfully`,
				userId: user.userId,
				role: user.role,
			});
		}
	} catch (error) {
		return next({ status: 500, message: error.message });
	}
});

// ==== FALLBACK ====
router.use(fallbackService);

export default router;
