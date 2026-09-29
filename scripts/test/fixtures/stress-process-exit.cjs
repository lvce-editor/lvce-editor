const { pbkdf2 } = require('node:crypto')

const originalExit = process.exit
let exiting = false

// Keep native shutdown busy while V8's stress allocator requests a main-thread
// GC. A forced exit can deadlock waiting for that allocator; natural shutdown
// disposes the isolate first. See https://github.com/nodejs/node/pull/66171.
process.exit = (code) => {
  if (!exiting) {
    exiting = true
    pbkdf2('shutdown', 'regression', 5_000_000, 64, 'sha512', () => {})
  }
  originalExit(code)
}
