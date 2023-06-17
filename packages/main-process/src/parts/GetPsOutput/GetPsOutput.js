const { VError } = require('verror')
const childProcess = require('node:child_process')
const Signal = require('../Signal/Signal.js')
const util = require('node:util')

const execFile = util.promisify(childProcess.execFile)

exports.getPsOutput = async () => {
  try {
    const { stdout } = await execFile('ps', ['-ax', '-o', 'pid=,ppid=,pcpu=,pmem=,command='])
    return stdout.trim()
  } catch (error) {
    // @ts-ignore
    if (error && error.signal === Signal.SIGINT) {
      return ''
    }
    // @ts-ignore
    throw new VError(error, `Failed to execute ps`)
  }
}
