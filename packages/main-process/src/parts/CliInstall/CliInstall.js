const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const { Worker } = require('worker_threads')

const handleCliArgs = async (parsedArgs) => {
  const extension = parsedArgs._
  const sharedProcessPath = Platform.getSharedProcessPath()
  const process = new Worker(sharedProcessPath, {
    argv: parsedArgs._,
    // execArgv
  })
  process.postMessage({ method: '' })
  await new Promise((resolve, reject) => {
    process.on('error', reject)
    process.on('exit', resolve)
  })
  console.log('shared process exited')
  Electron.app.quit()
  return true
}

exports.handleCliArgs = handleCliArgs
