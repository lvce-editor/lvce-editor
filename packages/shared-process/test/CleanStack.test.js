import * as CleanStack from '../src/parts/CleanStack/CleanStack.js'

test('cleanStack - remove useless Promise.all', () => {
  const stack = `    at file:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1
    at async Promise.all (index 0)
    at async Module.create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)
    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async Module.create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:80:23)`
  expect(CleanStack.cleanStack(stack)).toEqual([
    `    at file:///test/packages/shared-process/src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js:5:1`,
    `    at async Module.create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:4:18)`,
    `    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)`,
    `    at async Module.create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:80:23)`,
  ])
})
