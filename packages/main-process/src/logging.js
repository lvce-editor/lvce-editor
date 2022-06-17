const { Console } = require('console')
const { createWriteStream } = require('fs')
const { tmpdir } = require('os')

// TODO disable logging via environment variable, don't enable logging during tests

const writeStream = createWriteStream(`${tmpdir()}/log-main-process.txt`)
const logger = new Console(writeStream)

for (const method of ['log', 'info', 'warn', 'error']) {
  const originalFn = console[method]
  console[method] = (...args) => {
    originalFn(...args)
    logger[method](...args)
  }
}

process.on('unhandledRejection', (event) => {
  console.error(event)
  writeStream.end(() => {
    process.exit(1)
  })
})

process.on('uncaughtException', (event) => {
  console.error(event)
  writeStream.end(() => {
    process.exit(1)
  })
})
