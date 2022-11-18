import * as ImportScript from '../ImportScript/ImportScript.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.js'
import * as TestFrameWorkComponent from '../TestFrameWorkComponent/TestFrameWorkComponent.js'
import * as TestState from '../TestState/TestState.js'
import * as Timestamp from '../Timestamp/Timestamp.js'

export const state = {
  tests: [],
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

export const execute = async (href) => {
  exposeGlobals(globalThis, TestFrameWorkComponent)
  exposeGlobals(globalThis, TestFrameWork)
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await ImportScript.importScript(scriptUrl)
  if (module.mockExec) {
    console.log({ mockExec: module.mockExec })
  }
  console.log({ module })

  const tests = TestState.getTests()
  for (const test of tests) {
    await executeTest(test.name, test.fn)
  }
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
