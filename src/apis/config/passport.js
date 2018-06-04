const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, (payload, done) => {
    User.findById(payload.id)
      .then((user) => {
        if (user) {
          /* user found, send user object to route */
          return done(null, user);
        }
        /* else throw an error */
        return done(null, false);
      });
  }));
};
