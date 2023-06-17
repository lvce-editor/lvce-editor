import * as MergeStacks from '../src/parts/MergeStacks/MergeStacks.js'

test('mergeStacks', () => {
  const parent = `VError: Failed to close widget 123: instance not found 123
  at Module.closeWidget (/test/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:310:11)
  at selectIndex (/test/packages/renderer-worker/src/parts/ViewletQuickPick/ViewletQuickPick.js:145:21)
  at async runFn (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:45:22)
  at async QuickPick/selectItem (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:91:5)
  at async Module.selectItem (/test/packages/renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponentQuickPick.js:29:3)
  at async test (/test/packages/extension-host-worker-tests/src/sample.command-provider-error-command-not-found.js:10:3)
  at async Module.executeTest (/test/packages/renderer-worker/src/parts/ExecuteTest/ExecuteTest.js:20:5)
  at async execute (/test/packages/renderer-worker/src/parts/Test/Test.js:32:7)
  at async Module.startup (/test/packages/renderer-worker/src/parts/Workbench/Workbench.js:172:5)
  at async main (/test/packages/renderer-worker/src/rendererWorkerMain.js:7:3)`
  const child = `Error: instance not found 123
  at Module.getState (/test/packages/renderer-worker/src/parts/ViewletStates/ViewletStates.js:60:11)
  at Module.closeWidget (/test/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:304:33)
  at selectIndex (/test/packages/renderer-worker/src/parts/ViewletQuickPick/ViewletQuickPick.js:145:21)
  at async runFn (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:45:22)
  at async QuickPick/selectItem (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:91:5)
  at async Module.selectItem (/test/packages/renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponentQuickPick.js:29:3)
  at async test (/test/packages/extension-host-worker-tests/src/sample.command-provider-error-command-not-found.js:10:3)
  at async Module.executeTest (/test/packages/renderer-worker/src/parts/ExecuteTest/ExecuteTest.js:20:5)
  at async execute (/test/packages/renderer-worker/src/parts/Test/Test.js:32:7)
  at async Module.startup (/test/packages/renderer-worker/src/parts/Workbench/Workbench.js:172:5)`
  expect(MergeStacks.mergeStacks(parent, child)).toBe(`VError: Failed to close widget 123: instance not found 123
  at Module.getState (/test/packages/renderer-worker/src/parts/ViewletStates/ViewletStates.js:60:11)
  at Module.closeWidget (/test/packages/renderer-worker/src/parts/Viewlet/Viewlet.js:304:33)
  at selectIndex (/test/packages/renderer-worker/src/parts/ViewletQuickPick/ViewletQuickPick.js:145:21)
  at async runFn (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:45:22)
  at async QuickPick/selectItem (/test/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:91:5)
  at async Module.selectItem (/test/packages/renderer-worker/src/parts/TestFrameWorkComponent/TestFrameWorkComponentQuickPick.js:29:3)
  at async test (/test/packages/extension-host-worker-tests/src/sample.command-provider-error-command-not-found.js:10:3)
  at async Module.executeTest (/test/packages/renderer-worker/src/parts/ExecuteTest/ExecuteTest.js:20:5)
  at async execute (/test/packages/renderer-worker/src/parts/Test/Test.js:32:7)
  at async Module.startup (/test/packages/renderer-worker/src/parts/Workbench/Workbench.js:172:5)`)
})
