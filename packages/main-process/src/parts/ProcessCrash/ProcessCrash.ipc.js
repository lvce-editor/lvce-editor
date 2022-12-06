const ProcessCrash = require('./ProcessCrash.js')

exports.name = 'ProcessCrash'

// prettier-ignore
exports.Commands = {
  crash: ProcessCrash.crash,
  crashAsync: ProcessCrash.crashAsync,
  hang: ProcessCrash.hang,
}
