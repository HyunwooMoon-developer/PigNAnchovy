import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User_Model from '../models/user_models';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_TOKEN as string,
    },
    async (payload, done) => {
      const user = await User_Model.findById(payload.id);
      if (!user) {
        return done(null, false, { message: 'User is not exist' });
      }

      return done(null, user);
    }
  )
);

passport.use(
  new LocalStrategy(
    { session: false },
    async (username: string, password: string, done) => {
      try {
        let user = await User_Model.findOne({ username: username });

        if (!user) {
          return done(null, false, { message: "User dosen't exsit" });
        }

        if (password && bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Wrong password' });
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User_Model.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
