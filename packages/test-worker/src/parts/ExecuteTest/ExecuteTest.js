import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as Rpc from '../Rpc/Rpc.js'
import * as TestType from '../TestType/TestType.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import { VError } from '../VError/VError.js'

const printError = (error) => {
  if (error && error.constructor.name === 'AssertionError') {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

const stringifyError = (error) => {
  if (!error) {
    return `${error}`
  }
  if (error && error.message && error.constructor.name && error.constructor.name !== 'Error' && error.constructor.name !== 'VError') {
    return `${error}`
  }
  return `${error.message}`
}

const formatDuration = (duration) => {
  return duration.toFixed(2) + 'ms'
}
export const executeTest = async (name, fn, globals = {}) => {
  let _error
  let _start
  let _end
  let _duration
  let _formattedDuration
  try {
    _start = Timestamp.now()
    await fn(globals)
    _end = Timestamp.now()
    _duration = _end - _start
    _formattedDuration = formatDuration(_duration)
    console.info(`PASS ${name} in ${_formattedDuration}`)
  } catch (error) {
    if (
      error &&
      // @ts-ignore
      error.message.startsWith('Failed to load command TestFrameWork.')
    ) {
      await ErrorHandling.handleError(error)
      return
    }
    // @ts-ignore
    _error = stringifyError(error)
    if (!(error instanceof VError)) {
      error = new VError(error, `Test failed: ${name}`)
    }
    // @ts-ignore
    printError(error)
  }
  let state
  let background
  let text
  if (_error) {
    state = TestType.Fail
    background = 'red'
    text = `test failed: ${_error}`
  } else {
    background = 'green'
    text = `test passed in ${_formattedDuration}`
    state = TestType.Pass
  }
  await Rpc.invoke('TestFrameWork.showOverlay', state, background, text)
}
