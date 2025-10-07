import jwt from "jsonwebtoken";

const JWT_SECRET = 'ADGAG#$%ADQT235@#RAG#@';

export const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token found" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
