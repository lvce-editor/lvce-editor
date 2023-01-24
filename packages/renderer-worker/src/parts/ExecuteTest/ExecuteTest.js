import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Timestamp from '../Timestamp/Timestamp.js'

const printError = (error) => {
  if (error && error.constructor.name === 'AssertionError') {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

export const executeTest = async (name, fn, globals = {}) => {
  let _error
  let _start
  let _end
  let _duration
  try {
    _start = Timestamp.now()
    await fn(globals)
    _end = Timestamp.now()
    _duration = `${_end - _start}ms`
    console.info(`[test passed] ${name} in ${_duration}`)
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.message.startsWith(`Failed to load command TestFrameWork.`)
    ) {
      await ErrorHandling.handleError(error)
      return
    }
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
  await RendererProcess.invoke('TestFrameWork.showOverlay', state, background, text)
}
