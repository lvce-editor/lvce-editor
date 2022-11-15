import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.js'
import * as TestFrameWorkComponent from '../TestFrameWorkComponent/TestFrameWorkComponent.js'
import * as TestState from '../TestState/TestState.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

export const state = {
  tests: [],
}

const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    throw new VError(error, `Failed to import script ${url}`)
  }
}

const exposeGlobals = (global, object) => {
  for (const [key, value] of Object.entries(object)) {
    global[key] = value
  }
}

const printError = (error) => {
  if (error && error.constructor.name === 'AssertionError') {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

const executeTest = async (name, fn) => {
  let _error
  let _start
  let _end
  let _duration
  try {
    _start = Timestamp.now()
    await fn()
    _end = Timestamp.now()
    _duration = `${_end - _start}ms`
    console.info(`[test passed] ${name} in ${_duration}`)
  } catch (error) {
    console.log({ error })
    // @ts-ignore
    _error = error.message
    // @ts-ignore
    error.message = `Test failed: ${name}: ${error.message}`
    printError(error)
  }
  let state
  let background
  let text
  if (_error) {
    state = 'fail'
    background = 'red'
    text = `test failed: ${_error}`
  } else {
    background = 'green'
    text = `test passed in ${_duration}`
    state = 'pass'
  }
  await RendererProcess.invoke(
    'TestFrameWork.showOverlay',
    state,
    background,
    text
  )
}

const setupMocks = async (mocks) => {
  const assetDir = Platform.getAssetDir()
  const url = `${assetDir}/test/testServiceWorker.js`
  await Command.execute('ServiceWorker.register', url, '/test/')
  const ipc = await Command.execute('ServiceWorker.connect')
  console.log({ ipc })
  // TODO register service worker
  // TODO create ipc channel to to service worker
  // TODO send mocks to service worker
}

const clearMocks = async () => {
  await Command.execute('ServiceWorker.uninstall')
}

export const execute = async (href) => {
  exposeGlobals(globalThis, TestFrameWorkComponent)
  exposeGlobals(globalThis, TestFrameWork)
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await importScript(scriptUrl)

  if (module.mocks) {
    await setupMocks(module.mocks)
  }
  console.log(module.mocks)
  // TODO setup mocks

  const tests = TestState.getTests()
  for (const test of tests) {
    await executeTest(test.name, test.fn)
  }
  // 3. if import fails, display error message

  if (module.mocks) {
    await clearMocks()
  }

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
