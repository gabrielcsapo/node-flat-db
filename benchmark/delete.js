var fs = require('fs');
var stats = {};
var microtime = require('microtime');
var filesize = require('filesize');
var flat = require('../src/index');
var storage = require('../src/file-sync');
var db = flat('./benchmark/db.json', { storage: storage });

for(var i = 1000; i > 0; i--) {
    var start = microtime.now();
    db('posts')
      .remove({ id: i });
    stats[i] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/delete.json', JSON.stringify(stats, null, 4));
