import waitForExpect from 'wait-for-expect'
import * as Pty from '../src/parts/Pty/Pty.js'
import * as Platform from '../src/parts/Platform/Platform.js'

let pty

beforeEach(() => {
  pty = Pty.create()
})

afterEach(() => {
  Pty.dispose(pty)
})

test('pty', async () => {
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  let allData = ''
  Pty.onData(pty, (data) => {
    allData += data
  })
  Pty.write(pty, 'abc')
  await waitForExpect(() => {
    expect(allData).toContain('abc')
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
