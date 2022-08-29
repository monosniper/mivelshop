const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'SUPERSECRETE20220';

const saltRounds = 10;
const url = process.env.mongodburl;
const dbName = process.env.mongodbname;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function findUser(db, email, callback) {
  const collection = db.collection('user');
  collection.findOne({email}, callback);
}

function authUser(db, password, hash, callback) {
  const collection = db.collection('user');
  bcrypt.compare(password, hash, callback);
}

export default (req, res) => {
  if (req.method === 'POST') {
    //login
    try {
      assert.notEqual(null, req.body.email, 'Обязательное поле - Почта');
      assert.notEqual(null, req.body.password, 'Обязательное поле - Пароль');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }

    client.connect(function(err) {
      assert.equal(null, err);
      console.log('Connected to MongoDB server =>');
      const db = client.db(dbName);
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;

      findUser(db, email, function(err, user) {
        if (err) {
          res.status(500).json({error: true, message: 'Пользователь не найден'});
          return;
        }
        if (!user) {
          res.status(404).json({error: true, message: 'Пользователь не найден'});
          return;
        } else {
          authUser(db, password, user.password, function(err, match) {
            if (err) {
              res.status(500).json({error: true, message: 'Не получилось войти'});
            }
            if (match) {
              const token = jwt.sign(
                {userId: user.userId, isAdmin: user.isAdmin, name: user.name, email: user.email},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            } else {
              res.status(401).json({error: true, message: 'Не получилось войти'});
              return;
            }
          });
        }
      });
    });
  } else {
    // Handle any other HTTP method
    res.statusCode = 401;
    res.end();
  }
};
