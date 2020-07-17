import jwt from 'jsonwebtoken';

const generateToken = (username: string) => {
  if (process.env.TOKEN_SECRET !== undefined) {
    const token = jwt.sign(username, process.env.TOKEN_SECRET, {
      expiresIn: '7 days',
    });
    console.log(token);
    return token;
  }
};

export default generateToken;
