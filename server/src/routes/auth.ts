import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.route('/login').post(async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.send(err);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid User' });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      jwt.sign(
        { id: user._id },
        process.env.SECRET_TOKEN as string,
        {
          expiresIn: '1h',
        },
        (err, token) => {
          if (err) {
            console.log(err);
            return next(err);
          }

          return res.json({ success: true, token: token });
        }
      );
    });
  })(req, res);
});

export default router;
