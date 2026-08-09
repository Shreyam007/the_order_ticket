import jwt from 'jsonwebtoken';

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'orderticket_access_secret_key_2026_super_secure';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'orderticket_refresh_secret_key_2026_super_secure';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
