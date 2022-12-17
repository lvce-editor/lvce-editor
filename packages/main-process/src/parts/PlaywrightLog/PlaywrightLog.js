const fs = require('node:fs')

fs.writeFileSync('/tmp/log.txt', 'start')
const logStream = fs.createWriteStream('/tmp/log.txt')

// workaround for https://github.com/microsoft/playwright/issues/5905
exports.log = (...args) => {
  const stringifiedMessage = require('node:util').inspect(args)
  logStream.write(stringifiedMessage)
}
