import * as Expect from '../Expect/Expect.ts'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as TestState from '../TestState/TestState.ts'

export { create as Locator } from '../Locator/Locator.ts'

export const getTmpDir = async () => {
  return 'memfs://'
}

export const test = async (name, fn) => {
  NameAnonymousFunction.nameAnonymousFunction(fn, `test/${name}`)
  TestState.addTest(name, fn)
}

test.skip = async (id, fn) => {
  const state = 'skip'
  const background = 'yellow'
  const text = `test skipped ${id}`
  await Rpc.invoke('TestFrameWork.showOverlay', state, background, text)
}

const Assert = {
  string(value, message) {
    if (typeof value !== 'string') {
      throw new TypeError(message)
    }
  },
  number(value, message) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new TypeError(message)
    }
  },
}

export const expect = Expect.expect
