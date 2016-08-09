var fs = require('fs');

try {
    fs.unlinkSync('./benchmark/db.json');
    fs.unlinkSync('./benchmark/db-compressed.json');
} catch(ex) {
    throw new Error(ex);
}

var stats = {};
var start = 0;
var microtime = require('microtime');
var filesize = require('filesize');
var flat = require('../src/index');
var storage = require('../src/file-sync');
var db = flat('./benchmark/db.json', { storage: storage });

for(var i = 0; i < 1000; i++) {
    start = microtime.now();
    db('posts').push({
        id: i,
        title: 'node-flat-db is awesome'
    });
    stats[i] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/write.json', JSON.stringify(stats, null, 4));

storage = require('../src/file-compress-sync');
db = flat('./benchmark/db-compressed.json', { storage: storage });
stats = {};

for(var j = 0; j < 1000; j++) {
    start = microtime.now();
    db('posts').push({
        id: j,
        title: 'node-flat-db is awesome'
    });
    stats[j] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db-compressed.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/write-compress.json', JSON.stringify(stats, null, 4));
