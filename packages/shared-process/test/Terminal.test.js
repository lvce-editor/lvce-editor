import { Buffer } from 'node:buffer'
import waitForExpect from 'wait-for-expect'
import * as Platform from '../src/parts/Platform/Platform.js'
import * as Terminal from '../src/parts/Terminal/Terminal.js'

afterEach(() => {
  Terminal.disposeAll()
})

test.skip('Terminal', async () => {
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  let allData = ''
  const socket = {
    send(message) {
      const parsed = JSON.parse(message)
      console.log({ parsed })
      const data = Buffer.from(parsed.params[2].data).toString()
      allData += data
      console.log({ allData })
    },
    on(event, listener) {},
  }
  Terminal.create(socket, 0, '/tmp')
  Terminal.write(0, 'abc')
  await waitForExpect(() => {
    expect(allData).toContain('abc')
    // expect(true).toBe(false)
    // expect(allData).toContain('abc')
    // expect(socket.send).toHaveBeenCalledWith('abc')
  })
})

// test.skip('Terminal echo', async () => {
//   await new Promise((resolve) => {
//     // @ts-ignore
//     const terminal = create({
//       env: {
//         TEST: '`',
//       },
//       handleData(data) {
//         if (data.toString().includes('`')) {
//           terminal.dispose()
//           // @ts-ignore
//           resolve()
//         }
//       },
//     })
//     terminal.write('echo $TEST\n')
//   })
// })
