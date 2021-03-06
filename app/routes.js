(function() {
  var Event, User, isLoggedIn;

  Event = require('../app/models/interest');

  User = require('../app/models/user');

  module.exports = function(app, passport) {
    app.get('/auth/facebook/token', passport.authenticate('facebook-token'), function(req, res) {
      return res.send(200);
    });
    app.post('/gen_test_user', function(req, res) {
      var user;
      user = new User();
      user.id = '0';
      user.token = '0';
      user.email = 'test@test.net';
      user.name = 'tester';
      user.picture = '';
      user.bio = 'nothing';
      return user.save(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        return res.send(200);
      });
    });
    app.get('/get_user', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return User.findById(userId).exec(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        return res.send(user);
      });
    });
    app.post('/update_location', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return User.findById(userId).exec(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        user.location.latitude = req.query.latitude;
        user.location.longitude = req.query.longitude;
        return user.save(function(err, user) {
          if (err != null) {
            return console.log(err);
          }
          return res.send(200);
        });
      });
    });
    app.post('/update_info', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return User.findById(userId).exec(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        user.facebook.bio = req.body.info;
        return user.save(function(err, user) {
          if (err != null) {
            return console.log(err);
          }
          console.log(user);
          return res.send(200);
        });
      });
    });
    app.post('/update_interest', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return User.findById(userId).exec(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        user.facebook.interests[req.body.id] = req.body.new_interest;
        return user.save(function(err, user) {
          if (err != null) {
            return console.log(err);
          }
          return res.send(200);
        });
      });
    });
    app.post('/get_peers', isLoggedIn, function(req, res) {
      var ids;
      console.log(req.body.ids);
      ids = req.body.ids.toString().split("'");
      console.log(ids);
      return User.find({
        "facebook.id": {
          $in: ids
        }
      }).exec(function(err, users) {
        if (err != null) {
          return console.log(err);
        }
        return res.send(users);
      });
    });
    return app.post('/get_all_peers', isLoggedIn, function(req, res) {
      return User.find().exec(function(err, users) {
        if (err != null) {
          return console.log(err);
        }
        return res.send(users);
      });
    });
  };

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/');
    }
  };

}).call(this);
