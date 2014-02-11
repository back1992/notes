
var users = require('./users');
users.connect({
    dbname: "..", username: "..", password: "..",
    params: {
      host: 'localhost',
      // port: 10000,
      dialect: 'mysql'
    }
  },
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
        })
    }
  });