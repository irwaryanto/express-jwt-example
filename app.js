const cors = require('cors');
const express = require('express');
const expressjwt = require('express-jwt');
const hash = require('pbkdf2-password')();
const jwt = require('jsonwebtoken');
const models = require('./models');

const app = express();

// middleware
const restrict = expressjwt({
  secret: 'shhhhh',
  isRevoked: (req, payload, done) => {
    models.Token.findById(payload.jti).then(token => {
      let revoked = true;
      if (token) {
        revoked = false;
      }
      done(null, revoked);
    });
  }
});

// Authenticate
function authenticate(email, pass, fn) {
  models.User.findOne({where: {email: email}}).then(user => {
    if (!user) return fn(new Error('cannot find user'));
    hash({password: pass, salt: user.salt}, (err, pass, salt, hash) => {
      if (err) return fn(err);
      if (hash === user.hash) {
        let payload = user.get({plain: true});
        return models.Token.findOrCreate({where: {userId: user.id}}).spread((token, created) => {
          payload.jti = token.id;
          return fn(null, payload);
        });
      }
      fn(new Error('invalid password'));
    });
  });
}

app.use(cors());
app.use(express.json());

app.get('/api/restricted', restrict, (req, res) => {
  res.json(req.user);
});

app.get('/api/logout', restrict, (req, res) => {
  models.Token.destroy({where: {id: req.user.jti, userId: req.user.id}}).then(() => {
    res.json({message: 'Logout success'});
  });
});

app.post('/api/login', (req, res) => {
  authenticate(req.body.email, req.body.password, (err, user) => {
    if (user) {
      jwt.sign(user, 'shhhhh', {expiresIn: '1h'}, (err, token) => {
        res.json({access_token: token, token_type: 'Bearer', expires_in: 3600});
      });
    } else {
      res.status(401).json({error: err.message});
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
