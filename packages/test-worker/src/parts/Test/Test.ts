import * as ExecuteTest from '../ExecuteTest/ExecuteTest.ts'
import * as ImportTest from '../ImportTest/ImportTest.ts'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.ts'
import * as TestFrameWorkComponent from '../TestFrameWorkComponent/TestFrameWorkComponent.ts'
import * as TestState from '../TestState/TestState.ts'

export const state = {
  tests: [],
}

export const execute = async (href) => {
  const globals = {
    ...TestFrameWorkComponent,
    ...TestFrameWork,
  }
  // TODO
  // 0. wait for page to be ready
  // 1. get script to import from renderer process (url or from html)
  const scriptUrl = href
  // 2. import that script
  const module = await ImportTest.importTest(scriptUrl)
  if (module.mockRpc) {
    TestState.setMockRpc(module.mockRpc)
  }
  if (module.test) {
    if (module.skip) {
      await TestFrameWork.test.skip(module.name, () => {})
    } else {
      await ExecuteTest.executeTest(module.name, module.test, globals)
    }
  } else {
    const tests = TestState.getTests()
    for (const test of tests) {
      // @ts-ignore
      await ExecuteTest.executeTest(test.name, test.fn)
    }
  }
  // 3. if import fails, display error message

  // 4. run the test
  // 5. if test fails, display error message
  // 6. if test succeeds, display success message
}

export const executeMockRpcFunction = async (name, command, ...args) => {
  const map = TestState.getMockRpc(name)
  if (!map) {
    throw new Error(`Mock rpc ${name} not found`)
  }
  const fn = map.commands[command]
  if (!fn) {
    throw new Error(`Command ${command} not found`)
  }
  const result = await fn(...args)
  return result
}
