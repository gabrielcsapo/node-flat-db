# node-flat-db

[![Build Status](https://travis-ci.org/gabrielcsapo/node-flat-db.svg?branch=master)](https://travis-ci.org/gabrielcsapo/node-flat-db)
[![Npm Version](https://img.shields.io/npm/v/node-flat-db.svg)](https://www.npmjs.com/package/node-flat-db)
[![Dependency Status](https://david-dm.org/gabrielcsapo/node-flat-db.svg)](https://david-dm.org/gabrielcsapo/node-flat-db)
[![devDependency Status](https://david-dm.org/gabrielcsapo/node-flat-db/dev-status.svg)](https://david-dm.org/gabrielcsapo/node-flat-db#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/node-flat-db.svg)]()
[![npm](https://img.shields.io/npm/dm/node-flat-db.svg)]()

> This is a fork of [lowdb](https://github.com/typicode/lowdb) before they broke the api and no longer is as stable as before (fork of 12.5 lowdb)

> Need a quick way to get a local database for a CLI, an Electron app, a small server or the browser?

## Example

```js
const flat = require('node-flat-db')
const storage = require('node-flat-db/file-sync')

const db = flat('db.json', { storage })

db('posts').push({ title: 'node-flat-db is awesome'})
```

Database is __automatically__ saved to `db.json`.

```js
{
  "posts": [
    { "title": "node-flat-db is awesome" }
  ]
}
```

You can query and manipulate it using __any__ [lodash](https://lodash.com/docs) __method__.

```js
db('posts').find({ title: 'node-flat-db is awesome' })
```

And access underlying database object any time.

```js
db.object.posts
```

__[Click here to try node-flat-db in the browser.](http://typicode.github.io/node-flat-db/)__

## ES2015

Examples use ES2015 syntax for convenience, but you can use ES5 syntax too. For example:

```js
var db = flat('db.json', { storage: storage })
```

Please note also that node-flat-db can only be run in one instance of Node, it doesn't support Cluster.

## Installation

Using npm:

```bash
npm install node-flat-db --save
```

A standalone UMD build is also available on [npmcdn](https://npmcdn.com/):

```html
<script src="http://npmcdn.com/node-flat-db@^0.2.0/dist/node-flat-db.min.js"></script>
<script>
  var db = flat() // in-memory
  var db = flat('db', { storage: flat.localStorage }) // localStorage
</script>
```

## Features

* Very small (~100 lines for core)
* lodash API
* Extendable:
  * __Custom storage__ (file, browser, in-memory, ...)
  * __Custom format__ (JSON, BSON, YAML, ...)
  * __Mixins__ (id support, ...)
  * __Encryption__

node-flat-db is also very easy to learn since it has __only a few methods and properties__.

_node-flat-db powers [json-server](https://github.com/typicode/json-server) package, [jsonplaceholder](http://jsonplaceholder.typicode.com/) website and [many other great projects](https://www.npmjs.com/browse/depended/node-flat-db)._

## Usage examples

Depending on the context, you can use different storages and formats.

node-flat-db comes bundled with `file-sync`, `file-async` and `browser` storages, but you can also write your own if needed.

### CLI

For CLIs, it's easier to use `node-flat-db/file-sync` synchronous file storage .

```js
const flat = require('node-flat-db')
const storage = require('node-flat-db/file-sync')

const db = flat('db.json', { storage })

db('users').push({ name: 'typicode' })
const user = db('users').find({ name: 'typicode' })
```

### Server

For servers, it's better to avoid blocking requests. Use `node-flat-db/file-async` asynchronous file storage.

__Important__

* When you modify the database, a Promise is returned.
* When you read from the database, the result is immediately returned.

```js
const flat = require('node-flat-db').
const storage = require('node-flat-db/file-async')

const db = flat('db.json', { storage })

app.get('/posts/:id', (req, res) => {
  // Returns a post
  const post = db('posts').find({ id: req.params.id })
  res.send(post)
})

app.post('/posts', (req, res) => {
  // Returns a Promise that resolves to a post
  db('posts')
    .push(req.body)
    .then(post => res.send(post))
})
```

### Browser

In the browser, `node-flat-db/browser` will add `localStorage` support.

```js
const flat = require('node-flat-db')
const storage = require('node-flat-db/browser')

const db = flat('db', { storage })

db('users').push({ name: 'typicode' })
const user = db('users').find({ name: 'typicode' })
```

### In-memory

For the best performance, use node-flat-db in-memory storage.

```js
const flat = require('node-flat-db')
const db = flat()

db('users').push({ name: 'typicode' })
const user = db('users').find({ name: 'typicode' })
```

Please note that, as an alternative, you can also disable `writeOnChange` if you want to control when data is written.

## Compression

> compresses 1000 record db from `77kb` to `7kb`

The best way to use node-flat-db if space constraint is an issue, use lzstring adapter

```js
const flat = require('node-flat-db')
const storage = require('node-flat-db/file-compress-sync')

const db = flat('db', { storage })

db('users').push({ name: 'typicode' })
const user = db('users').find({ name: 'typicode' })
```

## API

__flat([filename, [storage, [writeOnChange = true]]])__

Creates a new database instance. Here are some examples:

```js
flat()                                      // in-memory
flat('db.json', { storage: /* */ })         // persisted
flat('db.json', { storage: /* */ }, false)  // auto write disabled

// To create read-only or write-only database,
// set only storage.read or storage.write
const fileSync = require('node-flat-db/file-sync')

// write-only
flat('db.json', {
  storage: { write: fileSync.write }
})

// read-only
flat('db.json', {
  storage: { read: fileSync.read }
})
```

You can also define custom storages and formats:

```js
const myStorage = {
  read: (source, deserialize) => // obj or a Promise
  write: (dest, obj, serialize) => // undefined or a Promise
}

const myFormat = {
  format: {
    deserialize: (data) => // obj
    serialize: (obj) => // data
  }
}

flat(source, { storage: myStorage, format: myFormat }, writeOnChange)
```

__db.___

Database lodash instance. Use it to add your own utility functions or third-party mixins like [underscore-contrib](https://github.com/documentcloud/underscore-contrib) or [underscore-db](https://github.com/typicode/underscore-db).

```js
db._.mixin({
  second: function(array) {
    return array[1]
  }
})

const post1 = db('posts').first()
const post2 = db('posts').second()
```

__db.object__

Use whenever you want to access or modify the underlying database object.

```js
db.object // { posts: [ ... ] }
```

If you directly modify the content of the database object, you will need to manually call `write` to persist changes.

```js
// Delete an array
delete db.object.posts
db.write()

// Drop database
db.object = {}
db.write()
```

__db.write([source])__

Persists database using `storage.write` method. Depending on the storage, it may return a promise.

Note: by default, node-flat-db automatically calls it when database changes.

```js
const db = flat('db.json', { storage })
db.write()            // writes to db.json
db.write('copy.json') // writes to copy.json
```

__db.read([source])__

Reads source using `storage.read` method. Depending on the storage, it may return a promise.

```js
const db = flat('db.json', { storage })
db.read()            // re-reads db.json
db.read('copy.json') // reads copy.json
```

## Guide

### How to query

With node-flat-db, you get access to the entire [lodash API](http://lodash.com/), so there is many ways to query and manipulate data. Here are a few examples to get you started.

Please note that data is returned by reference, this means that modifications to returned objects may change the database. To avoid such behaviour, you need to use `.cloneDeep()`.

Also, the execution of chained methods is lazy, that is, execution is deferred until `.value()` is called.

#### Examples

Sort the top five posts.

```js
db('posts')
  .chain()
  .filter({published: true})
  .sortBy('views')
  .take(5)
  .value()
```

Retrieve post titles.

```js
db('posts').map('title')
```

Get the number of posts.

```js
db('posts').size()
```

Make a deep clone of posts.

```js
db('posts').cloneDeep()
```

Update a post.

```js
db('posts')
  .chain()
  .find({ title: 'flat!' })
  .assign({ title: 'hi!'})
  .value()
```

Remove posts.

```js
db('posts').remove({ title: 'flat!' })
```

### How to use id based resources

Being able to retrieve data using an id can be quite useful, particularly in servers. To add id-based resources support to node-flat-db, you have 2 options.

[underscore-db](https://github.com/typicode/underscore-db) provides a set of helpers for creating and manipulating id-based resources.

```js
const db = flat('db.json')

db._.mixin(require('underscore-db'))

const postId = db('posts').insert({ title: 'flat!' }).id
const post = db('posts').getById(postId)
```

[uuid](https://github.com/broofa/node-uuid) is more minimalist and returns a unique id that you can use when creating resources.

```js
const uuid = require('uuid')

const postId = db('posts').push({ id: uuid(), title: 'flat!' }).id
const post = db('posts').find({ id: postId })
```

### How to use custom format

By default, node-flat-db storages will use `JSON` to `parse` and `stringify` database object.

But it's also possible to specify custom `format.serializer` and `format.deserializer` methods that will be passed by node-flat-db to `storage.read` and `storage.write` methods.

For example, if you want to store database in `.bson` files ([MongoDB file format](https://github.com/mongodb/js-bson)):

```js
const flat = require('node-flat-db')
const storage = require('node-flat-db/file-sync')
const bson = require('bson')
const BSON = new bson.BSONPure.BSON()

flat('db.bson', { storage, format: {
  serialize: BSON.serialize,
  deserialize: BSON.deserialize
}})

// Alternative ES2015 short syntax
const bson = require('bson')
const format = new bson.BSONPure.BSON()
flat('db.bson', { storage, format })
```

### How to encrypt data

Simply `encrypt` and `decrypt` data in `format.serialize` and `format.deserialize` methods.

For example, using [cryptr](https://github.com/MauriceButler/cryptr):

```js
const Cryptr = require("./cryptr"),
const cryptr = new Cryptr('my secret key')

const db = flat('db.json', {
  format: {
    deserialize: (str) => {
      const decrypted = cryptr.decrypt(str)
      const obj = JSON.parse(decrypted)
      return obj
    },
    serialize: (obj) => {
      const str = JSON.stringify(obj)
      const encrypted = cryptr.encrypt(str)
      return encrypted
    }
  }
})
```

## Changelog

See changes for each version in the [release notes](https://github.com/typicode/node-flat-db/releases).

## Limits

node-flat-db is a convenient method for storing data without setting up a database server. It is fast enough and safe to be used as an embedded database.

However, if you seek high performance and scalability more than simplicity, you should probably stick to traditional databases like MongoDB.

## Benchmarks

> `npm install microtime`

`npm run benchmarks`


## License

MIT - [Gabriel J. Csapo](https://github.com/gabrielcsapo)
