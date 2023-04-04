const { IpcError } = require('../IpcError/IpcError.js')
const { utilityProcess } = require('electron')
const Assert = require('../Assert/Assert.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')
const { join } = require('path')
const { tmpdir } = require('os')
const { writeFile } = require('fs/promises')

const createCode = (path) => {
  return `const main = async () => {
  await import("${path}")
}

main()`
}

const createTmpFile = async (content) => {
  const temporaryFile = join(tmpdir(), 'file.js')
  await writeFile(temporaryFile, content)
  return temporaryFile
}

exports.create = async ({ path, argv, execArgv = [] }) => {
  Assert.string(path)
  const code = createCode(path)
  const temporaryFile = await createTmpFile(code)
  const childProcess = utilityProcess.fork(temporaryFile, argv, {
    execArgv,
    stdio: 'pipe',
  })
  const { type, event, stdout, stderr } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr)
  }
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout)
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr)
  return childProcess
}

exports.wrap = (process) => {
  return {
    process,
    on(event, listener) {
      this.process.on(event, listener)
    },
    send(message) {
      this.process.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.process.postMessage(message, transfer)
    },
    dispose() {
      this.process.kill()
    },
  }
}
