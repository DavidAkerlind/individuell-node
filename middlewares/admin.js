export default function adminOnly(req, res, next) {
	if (!req.user || req.user.role !== 'admin') {
		console.log(req.user);

		return res.status(403).json({ message: 'Admin access required' });
	}
	next();
}
