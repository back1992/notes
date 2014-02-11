var workforce = require('workforce');

var manager = workforce('./app.js')
  .set('workers', 4)
  .set('title', 'Notes')
  .set('restart threshold', '10s')
  .set('exit timeout', '5s');

manager.configure('development', function(){
  // manager.use(workforce.watch([
  //   './routes', './models-mongoose', './models-sequelize',
  //   './models-levelup', './models-sqlite3', '.'
  // ]));
});

manager.listen(process.env.PORT || 3000);