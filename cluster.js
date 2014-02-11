
var clusterMaster = require("cluster-master");

clusterMaster("cluster.js");

clusterMaster({ exec: "app.js" // script to run
              , size: 5 // number of workers
              , silent: false
              , signals: false
              , onMessage: function (msg) {
                  console.error("Message from %s %j"
                               , this.uniqueID
                               , msg)
                }
              });