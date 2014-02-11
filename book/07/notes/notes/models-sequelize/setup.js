
var users = require('./users');
users.connect(require('../sequelize-params'),
  function(err) {
    if (err) throw err;
    else {
        users.create('1', 'bob', 'secret', 'bob@example.com', function(err) {
            if (err) throw err;
            else {
                users.create('2', 'joe', 'birthday', 'joe@example.com', function(err) {
                    if (err) throw err;
                });
            }
        });
    }
  });