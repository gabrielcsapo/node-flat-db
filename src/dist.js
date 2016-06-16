// Entry point for standalone build
var index = require('./')
index.localStorage = require('./browser')
module.exports = index
