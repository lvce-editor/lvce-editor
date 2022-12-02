const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const { Worker } = require('worker_threads')

const handleCliArgs = async (parsedArgs) => {
  const sharedProcessPath = Platform.getSharedProcessPath()
  const worker = new Worker(sharedProcessPath, {
    argv: parsedArgs._,
  })
  worker.postMessage({ method: '' })
  await new Promise((resolve, reject) => {
    worker.on('error', reject)
    worker.on('exit', resolve)
  })
  Electron.app.quit()
}

exports.handleCliArgs = handleCliArgs
