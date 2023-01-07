const { Worker } = require('node:worker_threads')
const Platform = require('../Platform/Platform.js')
const ElectronApp = require('../ElectronApp/ElectronApp.js')

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
  ElectronApp.quit()
}

exports.handleCliArgs = handleCliArgs
