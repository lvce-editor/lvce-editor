/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'
import * as ViewletExtensions from '../src/parts/Viewlet/ViewletExtensions.js'

const isLeaf = (node) => {
  return node.childElementCount === 0
}

const getTextContent = (node) => {
  return node.textContent
}

const getSimpleList = (state) => {
  return Array.from(state.$ExtensionList.children).map((node) => {
    const children = node.querySelectorAll('*')
    return Array.from(children)
      .filter(isLeaf)
      .map(getTextContent)
      .filter(Boolean)
  })
}

beforeEach(() => {
  jest.restoreAllMocks()
})

test('name', () => {
  expect(ViewletExtensions.name).toBe('Extensions')
})

test('create', () => {
  const state = ViewletExtensions.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.dispose(state)
})

test('refresh', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Publisher',
    },
  ])
  expect(getSimpleList(state)).toEqual([
    ['Test Extension 1', 'n/a', 'Test Author'],
    ['Test Extension 2', 'n/a', 'Test Publisher'],
  ])
})

test.skip('setExtensionState', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test-extension-1',
      name: 'Test Extension 1',
    },
    {
      id: 'test-author.test-extension-2',
      name: 'Test Extension 2',
    },
  ])
  ViewletExtensions.setExtensionState(
    state,
    'test-author.test-extension-2',
    'installing'
  )
  // @ts-ignore
  expect(state.$Extensions.children[1].dataset.state).toBe('installing')
  ViewletExtensions.setExtensionState(
    state,
    'test-author.test-extension-2',
    'installed'
  )
  // @ts-ignore
  expect(state.$Extensions.children[1].dataset.state).toBe('installed')
  ViewletExtensions.setExtensionState(
    state,
    'test-author.test-extension-2',
    'uninstalling'
  )
  // @ts-ignore
  expect(state.$Extensions.children[1].dataset.state).toBe('uninstalling')
  ViewletExtensions.setExtensionState(
    state,
    'test-author.test-extension-2',
    'uninstalled'
  )
  // @ts-ignore
  expect(state.$Extensions.children[1].dataset.state).toBe('uninstalled')
  ViewletExtensions.setExtensionState(state, 'non-existing', 'installed')
})

test.skip('event -  input', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$InputBox.value = 'abc'
  state.$InputBox.dispatchEvent(
    new Event('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(state.element.ariaBusy).toBe('true')
  expect(RendererWorker.send).toHaveBeenCalledWith([
    2133,
    'Extensions',
    'handleInput',
    'abc',
  ])
  ViewletExtensions.setExtensions(state, [])
  expect(state.element.hasAttribute('aria-busy')).toBe(false)
})

// TODO
test.skip('user clicks install', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    1,
    2133,
    'Extensions',
    'handleInstall',
    'test-author.test=extension-1',
  ])
})

test.skip('user clicks while installing', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'installing',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test.skip('event - click - somewhere else', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test=extension-1',
      name: 'Test Extension 1',
      state: 'uninstalled',
    },
  ])
  state.$Extensions.children[0].dispatchEvent(
    new Event('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    867,
    'test-author.test=extension-1',
  ])
})

// TODO
test.skip('user clicks uninstall', () => {
  const state = ViewletExtensions.create()
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  ViewletExtensions.setExtensions(state, [
    {
      id: 'test-author.test-extension-1',
      name: 'Test Extension 1',
      state: 'installed',
    },
  ])
  state.$Extensions.children[0]
    // @ts-ignore
    .querySelector('.ExtensionManage')
    .dispatchEvent(
      new Event('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    1,
    2133,
    'Extensions',
    'handleUninstall',
    'test-author.test-extension-1',
  ])
})

test('dispose', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.dispose(state)
})

// TODO check that options are applied
// TODO check that individual entries are highlighted
test('openSuggest / closeSuggest', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.openSuggest(state)
  expect(state.$ExtensionSuggestions).toBeDefined()
  // TODO this should use widget
  expect(document.body.children[0]).toBe(state.$ExtensionSuggestions)
  ViewletExtensions.closeSuggest(state)
  expect(document.body.children.length).toBe(0)
})

test('icon - fallback src', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Publisher',
      icon: '/test-publisher.test-extension/icon.png',
    },
  ])
  const $ExtensionList = state.$ExtensionList
  const $FirstExtension = $ExtensionList.children[0]
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionIcon')
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
  const $SecondExtension = $ExtensionList.children[1]
  const $SecondIcon = $SecondExtension.querySelector('.ExtensionIcon')
  // @ts-ignore
  expect($SecondIcon.src).toBe(
    'http://localhost/test-publisher.test-extension/icon.png'
  )
})

test('icon - error', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
    },
  ])
  const $ExtensionList = state.$ExtensionList
  const $FirstExtension = $ExtensionList.children[0]
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionIcon')
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/not-found.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  // @ts-ignore
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
})

test('icon - error - endless loop bug', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(
    state,
    [
      {
        name: 'Test Extension 1',
        publisher: 'Test Author',
        icon: '/not-found.png',
      },
    ],
    0
  )
  const $ExtensionList = state.$ExtensionList
  const $FirstExtension = $ExtensionList.children[0]
  // @ts-ignore
  const $FirstIcon = $FirstExtension.querySelector('.ExtensionIcon')
  const spy = jest.spyOn($FirstIcon, 'src', 'set')
  expect($FirstIcon.src).toBe('http://localhost/not-found.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  expect(spy).toHaveBeenCalledTimes(1)
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
  $FirstIcon.dispatchEvent(new ErrorEvent('error', { bubbles: true }))
  expect($FirstIcon.src).toBe('http://localhost/icons/extensionDefaultIcon.png')
  expect(spy).toHaveBeenCalledTimes(1)
})

test('focus', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(
    state,
    [
      {
        name: 'Test Extension 1',
        publisher: 'Test Author',
        icon: '/not-found.png',
      },
    ],
    0
  )
  Viewlet.mount(document.body, state)
  ViewletExtensions.focus(state)
  expect(document.activeElement).toBe(state.$InputBox)
})

test('accessibility - InputBox should have placeholder', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(
    state,
    [
      {
        name: 'Test Extension 1',
        publisher: 'Test Author',
        icon: '/not-found.png',
      },
    ],
    0
  )
  expect(state.$InputBox.placeholder).toBe('Search Extensions in Marketplace')
  expect(state.$InputBox.ariaLabel).toBeUndefined()
})

test('accessibility - extensions should have ariaSetSize, ariaPosInSet, and ariaRoleDescription', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  const $ExtensionOne = state.$ExtensionList.children[0]
  expect($ExtensionOne.ariaSetSize).toBe(2)
  expect($ExtensionOne.ariaPosInSet).toBe(1)
  expect($ExtensionOne.ariaRoleDescription).toBe('Extension')
  // expect($ExtensionOne.ariaLabel).toBe('Test Extension 1')

  const $ExtensionTwo = state.$ExtensionList.children[1]
  expect($ExtensionTwo.ariaSetSize).toBe(2)
  expect($ExtensionTwo.ariaPosInSet).toBe(2)
  expect($ExtensionTwo.ariaRoleDescription).toBe('Extension')
  // expect($ExtensionTwo.ariaLabel).toBe('Test Extension 2')
})

test('handleError', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.handleError(state, 'TypeError: x is not a function')
  expect(state.$ExtensionList.textContent).toBe(
    'TypeError: x is not a function'
  )
})

test('setNegativeMargin', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setNegativeMargin(state, -10)
  expect(state.$ExtensionList.style.top).toBe('-10px')
})

test('setExtensions - add one', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/images/logo.png',
      setSize: 2,
      posInSet: 1,
    },
  ])
  expect(state.$ExtensionList.children).toHaveLength(1)
  const $ExtensionOne = state.$ExtensionList.children[0]
  const $ExtensionName = $ExtensionOne.querySelector('.ExtensionName')
  const $ExtensionIcon = $ExtensionOne.querySelector('.ExtensionIcon')
  expect($ExtensionName.textContent).toBe('Test Extension 1')
  expect($ExtensionIcon.src).toBe('http://localhost/images/logo.png')
})

test('setFocusedIndex - move focus down by one', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  ViewletExtensions.setFocusedIndex(state, 0, 1)
  const $ExtensionOne = state.$ExtensionList.children[0]
  expect($ExtensionOne.className).not.toContain('Focused')
  const $ExtensionTwo = state.$ExtensionList.children[1]
  expect($ExtensionTwo.className).toContain('Focused')
  expect(state.$ExtensionList.getAttribute('aria-activedescendant')).toBe(
    $ExtensionTwo.id
  )
})

test('setExtensions - renderExtensionsEqual', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  const spy = jest.spyOn(document, 'createElement')
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  expect(state.$ExtensionList.children).toHaveLength(2)
  expect(spy).not.toHaveBeenCalled()
})

test('setExtensions - renderExtensionsLess', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  const spy = jest.spyOn(document, 'createElement')
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 2,
    },
    {
      name: 'Test Extension 3',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 3,
    },
  ])
  expect(state.$ExtensionList.children).toHaveLength(3)
  expect(spy).toHaveBeenCalledTimes(11)
})

test('setExtensions - renderExtensionsMore', () => {
  const state = ViewletExtensions.create()
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 2,
    },
    {
      name: 'Test Extension 3',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 3,
      posInSet: 3,
    },
  ])
  const spy = jest.spyOn(document, 'createElement')
  ViewletExtensions.setExtensions(state, [
    {
      name: 'Test Extension 1',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'Test Extension 2',
      publisher: 'Test Author',
      icon: '/not-found.png',
      setSize: 2,
      posInSet: 2,
    },
  ])
  expect(state.$ExtensionList.children).toHaveLength(2)
  expect(spy).not.toHaveBeenCalled()
})
