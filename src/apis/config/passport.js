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
          return done(null, user);
        }
        return done(null, false);
      });
  }));
};
