const router = require("express").Router();
const bcrypt = require("bcrypt");
const Users = require('../auth/auth-model');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secrets');
const { isValid } = require('./services');


router.post('/register', (req, res) => {
  if (isValid(req.body)) {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
   
    user.password = hash;
    Users.add(user)
      .then((saved) => {
        res.status(201).json(saved)
      })
      .catch((err) => {
        res.status(500).json({ message: 'username taken' })
      })
  } else {
    res.status(500).json({ message: 'username and password required' })
  }
  })

 
router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}`,token});
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'username and password required' })
    })  
})

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
    lat: Date.now()
  }
  const options = {
    expiresIn: '20mins'
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;