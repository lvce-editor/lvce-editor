import { VError } from '../VError/VError.js'
import * as TestFrameWorkComponent from '../TestFrameWorkComponent/TestFrameWorkComponent.js'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.js'

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

export const execute = async (href) => {
  exposeGlobals(globalThis, TestFrameWorkComponent)
  exposeGlobals(globalThis, TestFrameWork)
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await importScript(scriptUrl)
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
