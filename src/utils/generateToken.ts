import jwt from 'jsonwebtoken';

const generateToken = (username: string) => {
  return jwt.sign(username, process.env.TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
};

export default generateToken;
