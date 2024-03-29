import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getText: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')
const Ajax = await import('../src/parts/Ajax/Ajax.js')

test('prepare - fetch codeFrame', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    return `export const handleKeyArrowDownMenuOpen = (state) => {
  const { menus } = state
  const menu = menus.at(-1)
  const newFocusedIndex = Menu.getIndexToFocusNext(menu)
  const newMenus = [
    ...menus.slice(0, -1),
    {
      ...menu,
      focusedIndex: newFocusedIndex,
    },
  ]
  return {
    ...state,
    menus: newMenus,
  }
}
`
  })
  const error = new ReferenceError('Menu is not defined')
  error.stack = `ReferenceError: Menu is not defined
  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'Menu is not defined',
    codeFrame: `  2 |   const { menus } = state
  3 |   const menu = menus.at(-1)
> 4 |   const newFocusedIndex = Menu.getIndexToFocusNext(menu)
    |                           ^
  5 |   const newMenus = [
  6 |     ...menus.slice(0, -1),
  7 |     {`,
    stack: `  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`,
    type: 'ReferenceError',
  })
})

test('prepare - fetch codeFrame - error', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const error = new ReferenceError('Menu is not defined')
  error.stack = `ReferenceError: Menu is not defined
  at handleKeyArrowDownMenuOpen (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarHandleKeyArrowDownMenuOpen.js:4:27)
  at ifElseFunction (test:///packages/renderer-worker/src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBarIfElse.js:5:14)
  at TitleBarMenuBar/lazy/handleKeyArrowDown [as TitleBarMenuBar.handleKeyArrowDown] (test:///packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:115:30)
  at async Object.handleKeyBinding [as KeyBindings.handleKeyBinding] (test:///packages/renderer-worker/src/parts/KeyBindings/KeyBindings.js:36:3)
  at async handleMessageFromRendererProcess (test:///packages/renderer-worker/src/parts/RendererProcess/RendererProcess.js:45:3)`
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toBe(error)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(1, 'ErrorHandling Error')
  expect(spy).toHaveBeenNthCalledWith(2, new TypeError('x is not a function'))
})

test('prepare - error without stack', async () => {
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const error = new Error()
  error.message =
    'VError: Failed to import script http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.js: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.jss'
  error.stack =
    'VError: Failed to import script http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.js: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/packages/extension-host-worker-tests/src/ample.tab-completion-provider-error-invalid-return-value-number.jss'
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const prettyError = await PrettyError.prepare(error)
  expect(prettyError).toBe(error)
  expect(spy).not.toHaveBeenCalled()
})
