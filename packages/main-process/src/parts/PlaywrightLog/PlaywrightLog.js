import * as fs from 'node:fs'

fs.writeFileSync('/tmp/log.txt', 'start')
const logStream = fs.createWriteStream('/tmp/log.txt')

// workaround for https://github.com/microsoft/playwright/issues/5905
export const log = (...args) => {
  const stringifiedMessage = require('node:util').inspect(args)
  logStream.write(stringifiedMessage)
}
