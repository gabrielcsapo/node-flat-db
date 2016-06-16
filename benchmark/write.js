var fs = require('fs');

try {
    fs.unlinkSync('./benchmark/db.json');
    fs.unlinkSync('./benchmark/db-compressed.json');
} catch(ex) {}

var stats = {};
var microtime = require('microtime');
var filesize = require('filesize');
var flat = require('../src/index');
var storage = require('../src/file-sync');
var db = flat('./benchmark/db.json', { storage: storage });

for(var i = 0; i < 1000; i++) {
    var start = microtime.now();
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

var storage = require('../src/file-compress-sync');
var db = flat('./benchmark/db-compressed.json', { storage: storage });
var stats = {};

for(var i = 0; i < 1000; i++) {
    var start = microtime.now();
    db('posts').push({
        id: i,
        title: 'node-flat-db is awesome'
    });
    stats[i] = {
        time: microtime.now() - start,
        size: filesize(fs.statSync('./benchmark/db-compressed.json')['size'])
    };
}

fs.writeFileSync('./benchmark/stats/write-compress.json', JSON.stringify(stats, null, 4));
