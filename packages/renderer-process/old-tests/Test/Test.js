import * as Command from '../Command/Command.js'
import { check, domOperation, keyboardOperation } from './utils.js'

const testViews = async () => {
  await domOperation('.ActivityBarItem[aria-label="Explorer"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Explorer"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Search"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Search"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Run and Debug"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="RunAndDebug"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Source Control"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="SourceControl"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Extensions"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Extensions"]'
  )
}

const testEditor = async () => {
  await domOperation('#Editor', 'focus')
  await domOperation('#Editor', 'setValue', '<h1>hello world</h1>')
}

const testWorkbench = async () => {
  await check('#SideBar', 'isVisible')
  await keyboardOperation({ key: 'b', ctrlKey: true })
  await check('#SideBar', 'not.isVisible')
  await keyboardOperation({ key: 'b', ctrlKey: true })
  await check('#SideBar', 'isVisible')

  await check('#Panel', 'isVisible')
  await keyboardOperation({ key: '`', ctrlKey: true })
  await check('#Panel', 'not.isVisible')
  await keyboardOperation({ key: '`', ctrlKey: true })
  await check('#Panel', 'isVisible')
}

const testQuickPick = async () => {
  await keyboardOperation({ key: 'p', ctrlKey: true })
  await check('#QuickPick', 'isVisible')
  await check('#QuickPickInput', 'isFocused')
  await check('#QuickPickItems', 'contains', '.QuickPickItem#item-0')
}

const testQuickPickClosesWithEscape = async () => {
  await keyboardOperation({ key: 'p', ctrlKey: true })
  await check('#QuickPick', 'isVisible')
  await check('#QuickPickInput', 'isFocused')
  await keyboardOperation({ key: 'Escape' })
  await check('#QuickPick', 'not.isVisible')
}

const msw = async () => {
  await import('../../../node_modules/msw/lib/umd/index.js')
  const { setupWorker, rest } = window.MockServiceWorker
  return {
    setupWorker,
    rest,
  }
}

const testViewletExtensions = async () => {
  const { setupWorker, rest } = await msw()
  const worker = setupWorker(
    rest.get(
      'https://marketplace.22e924c84de072d4b25b.com/api/extensions',
      (request, response, ctx) => {
        return response(
          ctx.json([
            {
              id: 'microsoft.python',
              name: 'python',
              displayName: 'Python',
              description:
                'Linting, Debugging (multi-threaded, remote), Intellisense, Jupyter Notebooks, code formatting, refactoring, unit tests, and more.',
              authorId: 'microsoft',
              authorName: 'Microsoft',
              version: '0.0.5',
            },
            {
              id: 'formulahendry.auto-rename-tag',
              name: 'auto-rename-tag',
              displayName: 'Auto Rename Tag',
              description: 'Auto rename paired HTML/XML tag',
              authorId: 'formulahendry',
              authorName: 'Jun Han',
              version: '1.0.5',
            },
            {
              id: 'aaron-bond.better-comments',
              name: 'better-comments',
              displayName: 'Better Comments',
              description:
                'Improve your code commenting by annotating with alert, informational, TODOs, and more!',
              authorId: 'aaron-bond',
              authorName: 'Aaron Bond',
              version: '1.0.6',
            },
            {
              id: 'test-author.test-extension',
              name: 'test-extension-1',
              authorId: 'test-author',
              authorName: 'Test Author',
              version: '0.0.0',
            },
          ])
        )
      }
    )
  )
  await worker.start()

  await worker.resetHandlers()

  await domOperation('.ActivityBarItem[aria-label="Explorer"]', 'click')
  await domOperation('.ActivityBarItem[aria-label="Extensions"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Extensions"]'
  )
  await check(
    '#SideBarContent',
    'contains',
    '.Extension:nth-of-type(1)',
    'Python'
  )
  await check(
    '#SideBarContent',
    'contains',
    '.Extension:nth-of-type(2)',
    'Auto Rename Tag'
  )
  await check(
    '#SideBarContent',
    'contains',
    '.Extension:nth-of-type(3)',
    'Better Comments'
  )
  await check(
    '#SideBarContent',
    'contains',
    '.Extension:nth-of-type(4)',
    'test-extension-1'
  )
  await worker.stop()
}

const runTest = async (fn) => {
  try {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.info(`${fn.name} passed in ${end - start}ms`)
  } catch (error) {
    console.error(`${fn.name} failed`, error)
  }
}

let state = 'default'

const testFns = [
  testViews,
  testEditor,
  testWorkbench,
  testQuickPick,
  testQuickPickClosesWithEscape,
  // testViewletExtensions,
]

const runTests = async () => {
  switch (state) {
    case 'default':
      state = 'running'
      await runTest(testViews)
      await runTest(testEditor)
      await runTest(testWorkbench)
      await runTest(testQuickPick)
      await runTest(testQuickPickClosesWithEscape)
      await runTest(testViewletExtensions)
      state = 'default'
      break
    case 'running':
      break
    default:
      break
  }
}

export const runTestWithName = async (testName) => {
  const testFn = testFns.find((testFn) => testFn.name === testName)
  await runTest(testFn)
}

export const runAllTests = () => {}

export const getTests = () => {
  return [
    testViews,
    testEditor,
    testWorkbench,
    testQuickPick,
    testQuickPickClosesWithEscape,
    testViewletExtensions,
  ].map((fn) => fn.name)
}

export const __initialize__ = () => {
  Command.register(909021, runTests)
}
