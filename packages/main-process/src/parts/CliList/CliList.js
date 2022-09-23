const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const { Worker } = require('worker_threads')

const handleCliArgs = async (parsedArgs) => {
  const sharedProcessPath = Platform.getSharedProcessPath()
  const process = new Worker(sharedProcessPath, {
    argv: parsedArgs._,
  })
  process.postMessage({ method: '' })
  await new Promise((resolve, reject) => {
    process.on('error', reject)
    process.on('exit', resolve)
  })
  Electron.app.quit()
}

exports.handleCliArgs = handleCliArgs
