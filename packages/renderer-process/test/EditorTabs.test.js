/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as EditorTabs from '../src/parts/EditorTab/EditorTab.js'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.js'

const create$Tab = () => {
  const $Tab = document.createElement('li')
  // @ts-ignore
  $Tab.role = 'tab'
  $Tab.className = 'EditorTab'
  $Tab.setAttribute('aria-description', '')
  return $Tab
}

afterEach(() => {
  jest.restoreAllMocks()
})

test.skip('setTabs - renderTabsLess', () => {
  const state = {
    $EditorTabs: document.createElement('div'),
  }
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  EditorTabs.setTabs(state, tabs)
  expect(state.$EditorTabs.innerHTML).toBe(
    '<li role="tab" class="EditorTab" aria-selected="true" tabindex="0" aria-description="" title="/tmp/some-file.txt" data-language-id="plaintext" data-file-name="some-file.txt">some-file.txt</li>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test.skip('setTabs - renderTabsLess - single tab already exists', () => {
  const state = {
    $EditorTabs: document.createElement('div'),
  }
  state.$EditorTabs.append(create$Tab())
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
    {
      uri: '/tmp/some-file-2.txt',
      languageId: 'plaintext',
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  EditorTabs.setTabs(state, tabs)
  expect(state.$EditorTabs.innerHTML).toBe(
    '<li role="tab" class="EditorTab" aria-description="" title="/tmp/some-file.txt" data-language-id="plaintext" data-file-name="some-file.txt">some-file.txt</li><li role="tab" class="EditorTab" aria-selected="true" tabindex="0" aria-description="" title="/tmp/some-file-2.txt" data-language-id="plaintext" data-file-name="some-file-2.txt">some-file-2.txt</li>'
  )
  expect(spy).toHaveBeenCalledTimes(1)
})

test.skip('setTabs - renderTabsEqual', () => {
  const state = {
    $EditorTabs: document.createElement('div'),
  }
  state.$EditorTabs.append(create$Tab())
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  EditorTabs.setTabs(state, tabs)
  expect(state.$EditorTabs.innerHTML).toBe(
    '<li role="tab" class="EditorTab" aria-description="" title="/tmp/some-file.txt" data-language-id="plaintext" data-file-name="some-file.txt">some-file.txt</li>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test.skip('setTabs - renderTabsMore', () => {
  const state = {
    $EditorTabs: document.createElement('div'),
  }
  state.$EditorTabs.append(create$Tab())
  state.$EditorTabs.append(create$Tab())
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
  ]
  const spy = jest.spyOn(document, 'createElement')
  EditorTabs.setTabs(state, tabs)
  expect(state.$EditorTabs.innerHTML).toBe(
    '<li role="tab" class="EditorTab" aria-description="" title="/tmp/some-file.txt" data-language-id="plaintext" data-file-name="some-file.txt">some-file.txt</li>'
  )
  expect(spy).not.toHaveBeenCalled()
})

test.skip('event - contextmenu', () => {
  const state = {
    $EditorTabs: EditorTabs.create(),
  }
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
  ]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  EditorTabs.setTabs(state, tabs)
  state.$EditorTabs.children[0].dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([95, 50, 50])
})

test.skip('event - middle click', () => {
  const state = {
    $EditorTabs: EditorTabs.create(),
  }
  const tabs = [
    {
      uri: '/tmp/some-file.txt',
      languageId: 'plaintext',
    },
  ]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  EditorTabs.setTabs(state, tabs)
  state.$EditorTabs.children[0].dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 1,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([99])
})
