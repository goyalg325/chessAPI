const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const OAuth2ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const jwt = require('jsonwebtoken');

// Import your user model or data access functions here
const User = require('./models/user');

// Local Strategy for username/password login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email' });
      if (!user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  }
));

// JWT Strategy for token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key', // Replace with your secret key
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    return done(null, false);
  });
}));

// OAuth2 Client Password Strategy (for example, with OAuth2 provider)
passport.use('oauth2-client-password', new OAuth2ClientPasswordStrategy(
  (clientId, clientSecret, done) => {
    // Validate the client credentials (e.g., against your database)
    if (clientId === 'your-client-id' && clientSecret === 'your-client-secret') {
      return done(null, { client_id: clientId });
    }
    return done(null, false, { message: 'Incorrect client credentials' });
  }
));

// Create and validate JWT tokens
function createToken(user) {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };
  return jwt.sign(payload, jwtOptions.secretOrKey);
}

module.exports = {
  initialize: passport.initialize(),
  authenticateLocal: passport.authenticate('local', { session: false }),
  authenticateJwt: passport.authenticate('jwt', { session: false }),
  authenticateOAuth2: passport.authenticate('oauth2-client-password', { session: false }),
  createToken,
};
