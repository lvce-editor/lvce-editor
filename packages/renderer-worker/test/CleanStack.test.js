import * as CleanStack from '../src/parts/CleanStack/CleanStack.js'

test('cleanStack - firefox stack', () => {
  const stack = `ReferenceError: Menu is not defined
handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27
ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14
TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30
Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3
handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3`
  expect(CleanStack.cleanStack(stack)).toEqual([
    'handleKeyArrowDownMenuOpen@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27',
    'ifElseFunction@test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14',
    'TitleBarMenuBar/lazy/handleKeyArrowDown@test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30',
    'Object.handleKeyBinding@test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3',
    'handleMessageFromRendererProcess@test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3',
  ])
})
