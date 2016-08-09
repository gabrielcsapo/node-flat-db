var fs = require('fs');
var start = 0;
var stats = {};
var microtime = require('microtime');
var filesize = require('filesize');
var flat = require('../src/index');
var storage = require('../src/file-sync');
var db = flat('./benchmark/db.json', { storage: storage });

for(var i = 1000; i > 0; i--) {
    start = microtime.now();
    db('posts')
      .remove({ id: i });
    stats[i] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/delete.json', JSON.stringify(stats, null, 4));

stats = {};
storage = require('../src/file-compress-sync');
db = flat('./benchmark/db-compressed.json', { storage: storage });

for(var j = 1000; j > 0; j--) {
    start = microtime.now();
    db('posts')
      .remove({ id: j });
    stats[j] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db-compressed.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/delete-compressed.json', JSON.stringify(stats, null, 4));
