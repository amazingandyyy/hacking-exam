const ReverseMd5 = require('reverse-md5')

const md5breaker = ReverseMd5({
  lettersUpper: false,
  lettersLower: false,
  numbers: true,
  special: false,
  whitespace: false,
  maxLen: 7
})

module.exports = md5breaker;