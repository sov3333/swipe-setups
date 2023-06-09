import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import requireAuth from '../auth/authMiddleware.js';
import cookieParser from 'cookie-parser';
import User from '../mongodb/models/user.js';
import Setup from '../mongodb/models/setup.js';

const router = express.Router();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secretid', { expiresIn: maxAge });
};

router.get('/testLoggedIn', requireAuth, async (req, res) => {
  res.send('I AM LOGGED IN, I AM SHOWN');
});

// router.post('/logout', (req, res) => {
//   // // Delete JWT Cookie by replacing it with a blank cookie with a super short expiry
//   // res.cookie('jwt', '', { maxAge: 1 });
//   // res.json({ jwt: '' });
//   // // console.log('logging out');
//   // // // res.redirect('http://localhost:5173/');
//   // console.log('logging out');
//   console.log('hi, im here');
// });

router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).send({
    message: 'Logout Successful',
  });
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const createdUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: hashedPassword,
      });

      createdUser
        .save()
        .then((result) => {
          const token = createToken(result._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

          res
            .status(201)
            .send({ message: 'User Successfully Created', result });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error creating user', err });
        });
    })
    .catch((err) => {
      // Catch error if password hash not successful
      res.status(500).send({
        message: 'Password was not hashed successfully',
        err,
      });
    });
});

router.post('/login', async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            res.status(400).send({
              message: 'Passwords do not match',
              err,
            });
          }
          //create JWT Token
          // const token = jwt.sign(
          //   {
          //     userId: user._id,
          //     userEmail: user.email,
          //   },
          //   'RANDOM-TOKEN',
          //   { expiresIn: '24h' }
          // );
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).send({
            message: 'Login Successful',
            user: user._id,
            email: user.email,
            token,
            role: user.role,
          });
        })
        .catch((err) => {
          res.status(400).send({ message: 'Passwords do not match', err });
        });
    })
    .catch((err) => {
      res.status(404).send({ message: 'Email not found', err });
    });
});

//User Routes

router.get('/setups/:id', async (req, res) => {
  try {
    const userSetups = await Setup.find({ userId: req.params.id });
    res.status(200).send(userSetups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
router.get('/id', cookieParser(), (req, res) => {
  // Decode JWT token and extract user ID
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, 'secretid');
  res.json(decodedToken.id);
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//Update Route to update profile
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      updatedProfile,
      {
        new: true,
      }
    );
    console.log(user);
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Update Route for swipe page
router.put('/swipe/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // to return document after `update` was applied
    );
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
