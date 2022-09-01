import User from "../../models/user";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export default async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const {email, password} = req.body

        if (!email || !password) throw "invalid data";

        const user = await User.findOne({email})

        if (!user) throw 'Пользователь не найден';

        bcrypt.compare(password, user.password, (err, match) => {
          if (err) res.status(500).json({ok: false, error: 'Не получилось войти'});;
          const token = jwt.sign(
              {
                userId: user.userId,
                isAdmin: user.isAdmin,
                name: user.name,
                email: user.email,
                id: user._id,
              },
              process.env.NEXT_PUBLIC_JWT_SECRET,
              {
                expiresIn: 3000, //50 minutes
              },
          );
          res.status(200).json({ok: true, data: token});
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ok: false, error});
      }
      break;
    default:
      res.statusCode = 401;
      res.end();
      break;
  }
}