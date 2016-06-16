var steno = require('steno');
var _require = require('./json');
var stringify = _require.stringify;
var parse = _require.parse;
var lzstring = require('lz-string/libs/lz-string');
var fs = require('graceful-fs');

module.exports = {
  read: function read(source) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? parse : arguments[1];

    if (fs.existsSync(source)) {
      // Read database
      var data = fs.readFileSync(source, 'utf-8') || '{}';
      data = lzstring.decompressFromBase64(data);

      try {
        return deserialize(data);
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = 'Malformed JSON in file: ' + source + '\n' + e.message;
        }
        throw e;
      }
    } else {
      // Initialize empty database
      fs.writeFileSync(source, '{}');
      return {};
    }
  },
  write: function write(dest, obj) {
    var serialize = arguments.length <= 2 || arguments[2] === undefined ? stringify : arguments[2];

    return new Promise(function (resolve, reject) {
      var data = serialize(obj);
      data = lzstring.compressToBase64(data);
      steno.writeFile(dest, data, function (err) {
        if (err) return reject(err);
        resolve();
      });

    });
  }
};
