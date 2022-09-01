const jwt = require('jsonwebtoken');

export default (req, res) => {
  if (req.method === 'GET') {
    if (!('token' in req.cookies)) {
      res.status(401).json({message: 'Не получилось войти'});
      return;
    }
    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      } catch (e) {
        console.error(e);
      }
    }

    if (decoded) {
      res.json(decoded);
      return;
    } else {
      res.status(401).json({message: 'Не получилось войти'});
    }
  }
};
