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
  const globals = {
    ...TestFrameWorkComponent,
    ...TestFrameWork,
  }
  ExposeGlobals.exposeGlobals(globalThis, globals)
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await ImportScript.importScript(scriptUrl)
  if (module.mockExec) {
    TestState.setMockExec(module.mockExec)
  }
  if (module.test) {
    ExposeGlobals.unExposeGlobals(globalThis, globals)
    await ExecuteTest.executeTest(module.name, module.test, globals)
  } else {
    const tests = TestState.getTests()
    for (const test of tests) {
      await ExecuteTest.executeTest(test.name, test.fn)
    }
  }
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}

export const executeMockExecFunction = async (...args) => {
  const fn = TestState.getMockExec()
  if (!fn) {
    throw new Error(`mockExec does not exist`)
  }
  // @ts-ignore
  const result = await fn(...args)
  return result
}
