import jwt from 'jsonwebtoken';

const generateJWTtoken = (userId, phone) => {
  return jwt.sign({ userId, phone }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export { generateJWTtoken };