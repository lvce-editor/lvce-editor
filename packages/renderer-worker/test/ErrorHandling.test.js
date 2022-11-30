import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getText() {
      return ''
    },
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)
const Ajax = await import('../src/parts/Ajax/Ajax.js')

test('handleError - normal error', async () => {
  const mockError = new Error('oops')
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(expect.stringMatching(/^Error: oops/))
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 'Notification.create',
    'error',
    'Error: oops'
  )
})

test('handleError - null', async () => {
  const mockError = null
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 'Notification.create',
    'error',
    'Error: null'
  )
})

test('handleError - multiple causes', async () => {
  const mockError1 = new Error(
    'SyntaxError: Unexpected token , in JSON at position 7743'
  )
  // @ts-ignore
  const mockError2 = new Error('Failed to load url /keyBindings.json', {
    cause: mockError1,
  })
  // @ts-ignore
  const mockError3 = new Error('Failed to load keybindings', {
    cause: mockError2,
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError3)
  expect(spy).toHaveBeenCalledWith(
    expect.stringMatching(
      'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743'
    )
  )
  // expect(spy).toHaveBeenCalledWith(mockError2)
  // expect(spy).toHaveBeenCalledWith(mockError1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 'Notification.create',
    'error',
    'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743'
  )
})

test('handleError - with code frame, error stack includes message', async () => {
  const mockError = new Error()
  mockError.name = 'VError'
  mockError.message = `Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"`
  mockError.stack = `VError: Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  // @ts-ignore
  mockError.codeFrame = `  62 |     await loadCommand(command)
  63 |     if (!(command in commands)) {
> 64 |       throw new Error(\`Unknown command "\${command}"\`)
     |             ^
  65 |     }
  66 |   }
  67 |   return commands[command](...args)`
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy)
    .toHaveBeenCalledWith(`Error: Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"

  62 |     await loadCommand(command)
  63 |     if (!(command in commands)) {
> 64 |       throw new Error(\`Unknown command "\${command}"\`)
     |             ^
  65 |     }
  66 |   }
  67 |   return commands[command](...args)

VError: Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`)
})
