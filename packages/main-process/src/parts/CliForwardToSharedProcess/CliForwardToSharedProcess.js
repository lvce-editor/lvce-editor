const ElectronApp = require('../ElectronApp/ElectronApp.js')
const NodeWorker = require('../NodeWorker/NodeWorker.js')
const Platform = require('../Platform/Platform.js')

const handleCliArgs = async (parsedArgs) => {
  const sharedProcessPath = Platform.getSharedProcessPath()
  const worker = NodeWorker.create(sharedProcessPath, {
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
