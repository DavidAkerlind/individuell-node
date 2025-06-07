export default function adminOnly(req, res, next) {
	if (!global.user) {
		return next({ status: 401, message: 'Not logged in' });
	}
	if (global.user.role !== 'admin') {
		return next({ status: 403, message: 'Admin access required' });
	}
	next();
}
