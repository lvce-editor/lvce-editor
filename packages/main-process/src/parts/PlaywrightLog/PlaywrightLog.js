const fs = require('fs')

fs.writeFileSync('/tmp/log.txt', 'start')
const logStream = fs.createWriteStream('/tmp/log.txt')

// workaround for https://github.com/microsoft/playwright/issues/5905
exports.log = (...args) => {
  const stringifiedMessage = require('util').inspect(args)
  logStream.write(stringifiedMessage)
}
