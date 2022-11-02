import * as PtyController from './parts/PtyController/PtyController.js'
import * as Debug from './parts/Debug/Debug.js'

// const handleMessage = (message) => {
//   switch (message.method) {
//     case 'Terminal.create':
//       Debug.debug('create terminal')
//       PtyController.create(...message.params)
//       break
//     case 'Terminal.write':
//       PtyController.write(...message.params)
//       break
//     default:
//       console.warn('unknown message', message)
//       break
//   }
// }

const handleMessage = (message) => {
  console.log({ message })
}

const main = async () => {
  console.log('hello from pty host')
  process.on('message', handleMessage)
  // if (process.send) {
  //   process.send('ready')
  // }
}

main()
