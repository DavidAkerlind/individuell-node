import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return res
			.status(401)
			.json({ success: false, message: 'Token missing' });

	const token = authHeader.split(' ')[1];
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user; // Lägg till användaren på req-objektet
		next();
	} catch {
		res.status(401).json({ success: false, message: 'Invalid token' });
	}
}
