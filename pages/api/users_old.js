const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bcrypt = require('bcrypt');
const v4 = require('uuid').v4;
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

function createUser(db, name, email, password, callback) {
  const collection = db.collection('user');
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    collection.insertOne(
      {
        userId: v4(),
        name,
        email,
        isAdmin: false,
        password: hash,
      },
      function(err, userCreated) {
        assert.equal(err, null);
        callback(userCreated);
      },
    );
  });
}

export default (req, res) => {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.email, 'Обязательное поле - Имя');
      assert.notEqual(null, req.body.email, 'Обязательное поле - Почта');
      assert.notEqual(null, req.body.password, 'Обязательное поле - Пароль');
    } catch (bodyError) {
      res.status(403).json({error: true, message: bodyError.message});
    }

    // verify email does not exist already
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
          // proceed to Create
          createUser(db, name, email, password, function(creationResult) {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                {userId: user.userId, name: user.name, email: user.email},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            }
          });
        } else {
          // User exists
          res.status(403).json({error: true, message: 'Почта уже существует'});
          return;
        }
      });
    });
  }
  else if(req.method === 'GET') {
    if (!('token' in req.cookies)) {
      res.status(401).json({message: 'Not admin'});
      return;
    }
    let decoded;
    const token = req.cookies.token;
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (e) {
        console.error(e);
      }
    }

    if (decoded) {
      client.connect(function(err) {
        const db = client.db(dbName);

        console.log(db.collection('user').getAll());

        res.status(200).json(db.collection('user').getAll());
      });
    } else {
      res.status(401).json({message: 'Not admin'});
    }
  }
  else {
    // Handle any other HTTP method
    res.status(200).json({users: ['John Doe']});
  }
};
