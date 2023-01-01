import * as ExecuteTest from '../ExecuteTest/ExecuteTest.js'
import * as ExposeGlobals from '../ExposeGlobals/ExposeGlobals.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.js'
import * as TestFrameWorkComponent from '../TestFrameWorkComponent/TestFrameWorkComponent.js'
import * as TestState from '../TestState/TestState.js'
import * as Workspace from '../Workspace/Workspace.js'

export const state = {
  tests: [],
}

export const execute = async (href) => {
  ExposeGlobals.exposeGlobals(globalThis, TestFrameWorkComponent)
  ExposeGlobals.exposeGlobals(globalThis, TestFrameWork)
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await ImportScript.importScript(scriptUrl)
  if (module.mockExec) {
    // TODO this should not be in workspace but in another module
    Workspace.state.mockExec = module.mockExec
  }
  const tests = TestState.getTests()
  for (const test of tests) {
    await ExecuteTest.executeTest(test.name, test.fn)
  }
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}
