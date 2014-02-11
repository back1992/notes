var fs = require('fs');
var assert = require('assert');
var df = require('./deleteFile');
df.deleteFile("no-such-file", function(err) {
    assert.throws(
        function() { if (err) throw err; },
        function(error) {
            if ((error instanceof Error)
             && /does not exist/.test(error)) {
               return true;
            } else return false;
        },
        "unexpected error"
    );
});