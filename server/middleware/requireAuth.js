/**
 * middleware/requireAuth.js
 *
 * Express middleware that protects admin-only routes.
 *
 * How it works:
 *   - express-session stores a session object on req.session
 *   - When an admin logs in, we set req.session.adminId = admin._id
 *   - This middleware checks for that value on each request
 *   - If present → the request is authenticated → call next()
 *   - If absent  → return 401 Unauthorized
 *
 * Usage: apply to any route that should be admin-only
 *   router.get('/contacts', requireAuth, handler)
 */
export function requireAuth(req, res, next) {
  if (req.session?.adminId) {
    return next()
  }
  res.status(401).json({ error: 'Not authenticated' })
}
